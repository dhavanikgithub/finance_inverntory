import { NextResponse } from 'next/server';
import createJsReportClient from '../../../lib/jsreport-client'; // Import the JSReport client
import pool from '../../../lib/db'; // Database connection pool
import { formatAmount, formatDate, formatTime } from '@/utils/helper';
import fs from 'fs';
import path  from 'path';

export async function POST(req) {
  const { clientId, startDate, endDate, isClientSpecific } = await req.json();

  try {
    // SQL query to fetch the transaction data based on filters
    let query = `
      SELECT 
        tr.*, 
        c.name AS client_name
      FROM public.transaction_records tr
      JOIN public.client c ON tr.client_id = c.id
      WHERE tr.create_date BETWEEN $1 AND $2
    `;

    if (isClientSpecific && clientId) {
      query += ` AND tr.client_id = $3`;
    }

    const transactions = await pool.query(query, [startDate, endDate, clientId].filter(Boolean));

    // Group data by client and adjust to the required format
    let groupedData = transactions.rows.reduce((acc, row) => {
      if (!acc[row.client_name]) {
        acc[row.client_name] = {
          total: {
            amount: 0,
            final_amount: 0,
            transaction_amount: 0,
            widthdraw_charges: 0,
            actual_transaction_amount: 0,
          },
          data: []
        };
      }
      let widthdraw_charges = (row.transaction_amount * row.widthdraw_charges) / 100
      let actual_transaction_amount = row.transaction_amount - widthdraw_charges;
      // Add transaction data to 'data' array
      acc[row.client_name].data.push({
        transaction_type: `${row.transaction_type === 0 ? 'Diposit' : 'Widthdraw'}`,
        amount: `₹${formatAmount(row.amount.toString())}/-`,
        final_amount: `₹${formatAmount(row.final_amount.toString())}/-`,
        transaction_amount: `₹${formatAmount(row.transaction_amount.toString())}/-`,
        widthdraw_charges: `₹${formatAmount(widthdraw_charges.toString())}/-`,
        widthdraw_charges_pr: `${row.widthdraw_charges.toString()}%`,
        date: `${formatDate(row.create_date)}`,
        time: `${formatTime(row.create_time)}`,
        actual_transaction_amount: `₹${formatAmount(actual_transaction_amount.toString())}/-`,
        is_widthdraw_transaction: row.transaction_type === 1
      });

      // Update totals
      acc[row.client_name].total.amount += row.amount;
      acc[row.client_name].total.final_amount += row.final_amount;
      acc[row.client_name].total.transaction_amount += row.transaction_amount;
      acc[row.client_name].total.widthdraw_charges += widthdraw_charges;
      acc[row.client_name].total.actual_transaction_amount += actual_transaction_amount;

      return acc;
    }, {});

    // Format the totals as currency
    Object.keys(groupedData).forEach(clientName => {
      groupedData[clientName].total.amount = `₹${formatAmount(groupedData[clientName].total.amount.toString())}/-`;
      groupedData[clientName].total.final_amount = `₹${formatAmount(groupedData[clientName].total.final_amount.toString())}/-`;
      groupedData[clientName].total.transaction_amount = `₹${formatAmount(groupedData[clientName].total.transaction_amount.toString())}/-`;
      groupedData[clientName].total.widthdraw_charges = `₹${formatAmount(groupedData[clientName].total.widthdraw_charges.toString())}/-`;
      groupedData[clientName].total.actual_transaction_amount = `₹${formatAmount(groupedData[clientName].total.actual_transaction_amount.toString())}/-`;
    });

    // Prepare the report data object
    const reportData = {
      isClientSpecific,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      groupedData,
      columns: ['transaction_type', 'amount', 'final_amount', 'transaction_amount', 'widthdraw_charges', 'date_and_time'],
    };

    // Create JSReport client instance
    const jsReportClient = createJsReportClient();

    // Join the current working directory (CWD) with the relative path to the HTML file
    const filePath = path.join(process.cwd(), 'public', 'templates', 'report.html');

    // Read the HTML file content
    let htmlContent = '';

    try {
      htmlContent = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error('Error reading HTML file:', error);
    }

    // Generate report using JSReport
    const report = await jsReportClient.render({
      template: {
        content: htmlContent,
        engine: 'handlebars',
        recipe: 'chrome-pdf',
      },
      data: reportData,
    });


    // Get the PDF body buffer
    const bodyBuffer = await report.body(); // Get the body as a buffer
    const bodyBufferBase64 = bodyBuffer.toString('base64')

    // Return the PDF content as a buffer in the response
    return NextResponse.json({ pdfContent: bodyBufferBase64 }, { status: 200 }); // Encode to base64 to send as JSON
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Error generating report' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import createJsReportClient from '../../../lib/jsreport-client'; // Import the JSReport client
import pool from '../../../lib/db'; // Database connection pool
import { formatAmount, formatDate, formatTime, getTransactionTypeStr, isTransactionTypeDeposit, isTransactionTypeWidthdraw } from '@/utils/helper';
import fs from 'fs';
import path from 'path';
import Transaction from '@/app/model/Transaction';


// Define types for the incoming request data
interface RequestBody {
  clientId?: string | null;
  startDate?: string;
  endDate?: string;
}

interface GroupedData {
  total: {
    final_amount: string;
    transaction_amount: string;
    widthdraw_charges: string;
  };
  data: Array<{
    transaction_type: string;
    transaction_amount: string;
    widthdraw_charges: string;
    widthdraw_charges_pr: string;
    date: string;
    time: string;
    is_widthdraw_transaction: boolean;
    bank_name:string;
    card_name:string;
  }>;
}

export async function POST(req: Request): Promise<NextResponse> {
  const { clientId, startDate, endDate }: RequestBody = await req.json();
  
  const isClientSpecific = clientId !== undefined && clientId !== null;

  if(!startDate){
    return NextResponse.json({ error: 'Required field "startDate" is missing' }, { status: 400 });
  }
  if(!endDate){
    return NextResponse.json({ error: 'Required field "endDate" is missing' }, { status: 400 });
  }
  
  try {
    // SQL query to fetch the transaction data based on filters
    let query = `
      SELECT tr.*, c.name AS client_name, bk.name AS bank_name, ct.name AS card_name
      FROM public.transaction_records tr 
      JOIN public.client c ON tr.client_id = c.id 
      LEFT JOIN public.bank bk ON tr.bank_id = bk.id
      LEFT JOIN public.card ct ON tr.card_id = ct.id
      WHERE tr.create_date BETWEEN $1 AND $2
    `;

    if (isClientSpecific) {
      query += ` AND tr.client_id = $3`;
    }

    const transactions = await pool.query<Transaction>(query, [startDate, endDate, clientId].filter(Boolean));
    let isOnlyWithdraw = true;
    // Group data by client and adjust to the required format
    let groupedData: { [clientName: string]: GroupedData } = transactions.rows.reduce((acc: { [clientName: string]: GroupedData }, row: Transaction) => {
      if (!acc[row.client_name]) {
        acc[row.client_name] = {
          total: {
            final_amount: "0",
            transaction_amount: "0",
            widthdraw_charges: "0",
          },
          data: []
        };
      }

      let widthdraw_charges = (row.transaction_amount * row.widthdraw_charges) / 100;
      
      // Add transaction data to 'data' array
      acc[row.client_name].data.push({
        transaction_type: `${getTransactionTypeStr(row.transaction_type)}`,
        transaction_amount: `₹${formatAmount(row.transaction_amount.toString())}/-`,
        widthdraw_charges: `₹${formatAmount(widthdraw_charges.toString())}/-`,
        widthdraw_charges_pr: `${row.widthdraw_charges.toString()}%`,
        date: row.create_date ? formatDate(row.create_date): '-',
        time: row.create_time ? formatTime(row.create_time): '-',
        is_widthdraw_transaction: isTransactionTypeWidthdraw(row.transaction_type),
        bank_name: row.bank_name || '',
        card_name: row.card_name || '',
      });

      // Update totals
      if (isTransactionTypeDeposit(row.transaction_type)) {
        isOnlyWithdraw = false;
        acc[row.client_name].total.transaction_amount = (parseFloat(acc[row.client_name].total.transaction_amount) + row.transaction_amount).toString();
      } else {
        acc[row.client_name].total.transaction_amount = (parseFloat(acc[row.client_name].total.transaction_amount) - row.transaction_amount).toString();
      }

      acc[row.client_name].total.widthdraw_charges = (parseFloat(acc[row.client_name].total.widthdraw_charges) + widthdraw_charges).toString();
      acc[row.client_name].total.final_amount = (parseFloat(acc[row.client_name].total.transaction_amount) + parseFloat(acc[row.client_name].total.widthdraw_charges)).toString();

      return acc;
    }, {});

    function transactionAmountWithSign(amount: string): string {
      let num = parseFloat(amount.toString());
      if (isOnlyWithdraw) {
        num = 0;
      }
      return `₹${formatAmount(Math.abs(num).toString())}/-`;
    }

    function finalAmountWithSign(amount: string, widthdraw_charges: string): string {
      let num = parseFloat(amount.toString());
      if (isOnlyWithdraw) {
        return `- ₹${formatAmount(widthdraw_charges)}/-`;
      } else {
        return `+ ₹${formatAmount(Math.abs(num).toString())}/-`;
      }
    }

    // Format the totals as currency
    Object.keys(groupedData).forEach(clientName => {
      groupedData[clientName].total.widthdraw_charges = `₹${formatAmount(groupedData[clientName].total.widthdraw_charges)}/-`;
      groupedData[clientName].total.final_amount = finalAmountWithSign(groupedData[clientName].total.final_amount, groupedData[clientName].total.widthdraw_charges);
      groupedData[clientName].total.transaction_amount = transactionAmountWithSign(groupedData[clientName].total.transaction_amount);
    });

    // Prepare the report data object
    const reportData = {
      isClientSpecific,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      groupedData,
      columns: ['transaction_type', 'transaction_amount', 'widthdraw_charges', 'bank_name','card_name','date_and_time'],
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
    const bodyBufferBase64 = bodyBuffer.toString('base64');

    // Return the PDF content as a buffer in the response
    return NextResponse.json({ pdfContent: bodyBufferBase64 }, { status: 200 }); // Encode to base64 to send as JSON
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Error generating report' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Database connection pool
import { formatAmount, formatDate, formatTime, getTransactionTypeStr, isTransactionTypeDeposit, isTransactionTypeWidthdraw } from '@/utils/helper';
import fs from 'fs';
import path from 'path';
import Transaction from '@/app/model/Transaction';
import TransactionReportPDF from '@/app/api/generate-report/templates/TransactionReportPDF';

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

export async function POST(req: NextRequest,context: { params: Promise<{ name: string }> }): Promise<NextResponse> {
  const { name } = await context.params;
  const clientName = decodeURIComponent(name);

  
  try {
    // SQL query to fetch the transaction data based on filters
    let query = `
      SELECT tr.*, c.name AS client_name, bk.name AS bank_name, ct.name AS card_name
      FROM transaction_records tr 
      JOIN client c ON tr.client_id = c.id 
      LEFT JOIN bank bk ON tr.bank_id = bk.id
      LEFT JOIN card ct ON tr.card_id = ct.id
      WHERE tr.client_id = (SELECT id FROM client WHERE name = $1)
    `;


    const transactions = await pool.query<Transaction>(query, [clientName].filter(Boolean));
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
        transaction_amount: `Rs. ${formatAmount(row.transaction_amount.toString())}/-`,
        widthdraw_charges: `Rs. ${formatAmount(widthdraw_charges.toString())}/-`,
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
      return `Rs. ${formatAmount(Math.abs(num).toString())}/-`;
    }

    function finalAmountWithSign(amount: string, widthdraw_charges: string): string {
      let num = parseFloat(amount.toString());
      if (isOnlyWithdraw) {
        return `Rs. ${formatAmount(widthdraw_charges)}/-`;
      } else {
        return `Rs. ${formatAmount(Math.abs(num).toString())}/-`;
      }
    }

    // Format the totals as currency
    Object.keys(groupedData).forEach(clientName => {
      groupedData[clientName].total.widthdraw_charges = `Rs. ${formatAmount(groupedData[clientName].total.widthdraw_charges)}/-`;
      groupedData[clientName].total.final_amount = finalAmountWithSign(groupedData[clientName].total.final_amount, groupedData[clientName].total.widthdraw_charges);
      groupedData[clientName].total.transaction_amount = transactionAmountWithSign(groupedData[clientName].total.transaction_amount);
    });

    // Prepare the report data object
    const reportData = {
      isClientSpecific:true,
      startDate: "All",
      endDate: "All",
      groupedData,
      columns: ['transaction_type', 'transaction_amount', 'widthdraw_charges', 'bank_name','card_name','date_and_time'],
    };

    try {
      // Create PDF generator instance
      const reportGenerator = new TransactionReportPDF();

      // Generate temporary file path
      const tempFileName = `transaction_report_${Date.now()}.pdf`;
      const tempFilePath = path.join(process.cwd(), 'temp', tempFileName);

      // Ensure temp directory exists
      const tempDir = path.dirname(tempFilePath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Generate PDF file
      await reportGenerator.generatePDF(reportData, tempFilePath);

      // Read the generated PDF file
      const pdfBuffer = fs.readFileSync(tempFilePath);

      // Convert to base64
      const bodyBufferBase64 = pdfBuffer.toString('base64');

      // Clean up temporary file
      fs.unlinkSync(tempFilePath);

      // Return the PDF content as a buffer in the response
      return NextResponse.json({ pdfContent: bodyBufferBase64 }, { status: 200 });

    } catch (error) {
      console.error('Error generating PDF:', error);
      return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Error generating report' }, { status: 500 });
  }
}

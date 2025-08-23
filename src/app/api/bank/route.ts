import { Bank, BankInput } from '@/app/model/Bank';
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET all banks with card type information
export async function GET(): Promise<NextResponse> {
  try {
    const query = `
    WITH bank_with_transactions AS (
    SELECT 
        b.id AS bank_id, 
        COUNT(*) AS transaction_count
    FROM transaction_records
    LEFT JOIN bank b ON b.id = transaction_records.bank_id
    GROUP BY b.id
)
SELECT 
    bank.id, 
    bank.name, 
    bank.create_date, 
    bank.create_time, 
    bank.modify_date, 
    bank.modify_time, 
    COALESCE(bank_with_transactions.transaction_count, 0) AS transaction_count
FROM bank
LEFT JOIN bank_with_transactions 
    ON bank_with_transactions.bank_id = bank.id
ORDER BY bank.name ASC;
    `;
    const result = await pool.query<Bank>(query);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new bank
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data: BankInput = await request.json();
    
    if (!data.name) {
      return NextResponse.json(
        { error: 'Name are required' },
        { status: 400 }
      );
    }

    // Insert and return the new bank with card type info
    const insertQuery = `
      WITH inserted_bank AS (
        INSERT INTO bank (name)
        VALUES ($1)
        RETURNING *
      )
      SELECT *, 0 AS transaction_count
      FROM inserted_bank
      ORDER BY name ASC;
    `;

    const result = await pool.query<Bank>(insertQuery, [data.name]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a bank
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const data: Bank = await request.json();
    
    if (!data.id || !data.name) {
      return NextResponse.json(
        { error: 'ID, and name are required' },
        { status: 400 }
      );
    }

    // Update and return the bank with card type info
    const updateQuery = `WITH updated_bank AS (
    UPDATE bank 
    SET name = $1
    WHERE id = $2
    RETURNING *
)
SELECT 
    ub.*, 
    COALESCE(bt.transaction_count, 0) AS transaction_count
FROM updated_bank ub
LEFT JOIN (
    SELECT bank_id, COUNT(*) AS transaction_count
    FROM transaction_records
    GROUP BY bank_id
) bt ON bt.bank_id = ub.id
ORDER BY ub.name ASC;
`;

    const result = await pool.query<Bank>(updateQuery, 
      [data.name, data.id]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Bank not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a bank
export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const {id} = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'DELETE FROM bank WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Bank not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Bank deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { Bank, BankInput } from '@/app/model/Bank';
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET all banks with card type information
export async function GET(): Promise<NextResponse> {
  try {
    const query = `
      SELECT *
      FROM public.bank
      ORDER BY name ASC
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
        INSERT INTO public.bank (name)
        VALUES ($1)
        RETURNING *
      )
      SELECT *
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
    const updateQuery = `
      WITH updated_bank AS (
        UPDATE public.bank 
        SET name = $1
        WHERE id = $2
        RETURNING *
      )
      SELECT *
      FROM updated_bank
      ORDER BY name ASC;
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
      'DELETE FROM public.bank WHERE id = $1 RETURNING *',
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
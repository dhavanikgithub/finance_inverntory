import { Bank, BankInput } from '@/app/model/Bank';
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET all banks with card type information
export async function GET(): Promise<NextResponse> {
  try {
    const query = `
      SELECT b.*, ct.name as card_type_name 
      FROM public.bank b
      JOIN public.card_type ct ON b.card_type_id = ct.id
      ORDER BY b.id
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
    
    if (!data.name || !data.card_type_id) {
      return NextResponse.json(
        { error: 'Name and card type ID are required' },
        { status: 400 }
      );
    }

    // Insert and return the new bank with card type info
    const insertQuery = `
      WITH inserted_bank AS (
        INSERT INTO public.bank (name, card_type_id)
        VALUES ($1, $2)
        RETURNING *
      )
      SELECT ib.*, ct.name as card_type_name
      FROM inserted_bank ib
      JOIN public.card_type ct ON ib.card_type_id = ct.id
    `;

    const result = await pool.query<Bank>(insertQuery, [data.name, data.card_type_id]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a bank
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const data: Bank = await request.json();
    
    if (!data.id || !data.name || !data.card_type_id) {
      return NextResponse.json(
        { error: 'ID, name, and card type ID are required' },
        { status: 400 }
      );
    }

    // Update and return the bank with card type info
    const updateQuery = `
      WITH updated_bank AS (
        UPDATE public.bank 
        SET name = $1, card_type_id = $2
        WHERE id = $3
        RETURNING *
      )
      SELECT ub.*, ct.name as card_type_name
      FROM updated_bank ub
      JOIN public.card_type ct ON ub.card_type_id = ct.id
    `;

    const result = await pool.query<Bank>(updateQuery, 
      [data.name, data.card_type_id, data.id]);

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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
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
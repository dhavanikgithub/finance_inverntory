import { Card, CardInput } from '@/app/model/Card';
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// GET all card types
export async function GET(): Promise<NextResponse> {
  try {
    const result = await pool.query<Card>('SELECT * FROM public.card ORDER BY name');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new card type
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data: CardInput = await request.json();
    
    if (!data.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = await pool.query<Card>(
      'INSERT INTO public.card (name) VALUES ($1) RETURNING *',
      [data.name]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update a card type
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const data: Card = await request.json();
    
    if (!data.id || !data.name) {
      return NextResponse.json(
        { error: 'ID and name are required' },
        { status: 400 }
      );
    }

    const result = await pool.query<Card>(
      'UPDATE public.card SET name = $1 WHERE id = $2 RETURNING *',
      [data.name, data.id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Card type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a card type
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
      'DELETE FROM public.card WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Card type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Card type deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
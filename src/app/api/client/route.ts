// import { NextResponse } from 'next/server';
// import pool from '../../../lib/db';

// // Handler to get all clients
// export async function GET() {
//   try {
//     const result = await pool.query('SELECT * FROM public.client');
//     return NextResponse.json(result.rows);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { Client } from '@/store/slices/clientSlice';


// Handler to get all clients
export async function GET(): Promise<NextResponse> {
  try {
    const result = await pool.query<Client>('SELECT * FROM public.client');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Handler to create a new client
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const data: Client = await req.json();
    const { name } = data;

    const result = await pool.query<Client>(
      'INSERT INTO public.client (name) VALUES ($1) RETURNING *',
      [name]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handler to update a client
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const data: Client = await req.json();
    const { id, name } = data;

    const result = await pool.query<Client>(
      'UPDATE public.client SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handler to delete a client
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const { id }: { id: number } = await req.json();

    const result = await pool.query('DELETE FROM public.client WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
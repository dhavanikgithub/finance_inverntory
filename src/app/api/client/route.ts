import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { Client } from '@/app/model/Client';
import { isValidContact, isValidEmail } from '@/utils/validators';


// Handler to get all clients
export async function GET(): Promise<NextResponse> {
  try {
    const result = await pool.query<Client>('SELECT * FROM public.client ORDER BY name');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Handler to create a new client
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const data: Client = await req.json();
    const { name, email, contact, address } = data;

    // Optional field validations
    const errors: string[] = [];

    if (email !== '' && email !== undefined && !isValidEmail(email)) {
      errors.push('Invalid email format');
    }

    if (contact !== '' && contact !== undefined && !isValidContact(contact)) {
      errors.push('Invalid contact number');
    }
    const values: any[] = [];
    values.push(name);
    if (email !== undefined) { // Allow email to be optional
      if (email === '') {
        values.push(null); // Handle empty email as null
      }
      else {
        values.push(email);
      }
    }

    if (contact !== undefined) {
      if (contact === '') {
        values.push(null); // Handle empty contact as null
      }
      else {
        values.push(contact);
      }
    }
    if (address !== undefined) { // Allow address to be optional
      if (address === '') {
        values.push(null); // Handle empty address as null
      }
      else {
        values.push(address);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    const result = await pool.query<Client>(
      'INSERT INTO public.client (name, email, contact, address) VALUES ($1, $2, $3, $4) RETURNING *',values
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const data: Client = await req.json();
    const { id, name, email, contact, address } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Optional field validations
    const errors: string[] = [];

    if (email !== '' && email !== undefined && !isValidEmail(email)) {
      errors.push('Invalid email format');
    }

    if (contact !== '' && contact !== undefined && !isValidContact(contact)) {
      errors.push('Invalid contact number');
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    // Build dynamic query
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }

    if (email !== undefined) { // Allow email to be optional
      fields.push(`email = $${index++}`);
      if (email === '') {
        values.push(null); // Handle empty email as null
      }
      else {
        values.push(email);
      }
    }

    if (contact !== undefined) {
      fields.push(`contact = $${index++}`);
      if (contact === '') {
        values.push(null); // Handle empty contact as null
      }
      else {
        values.push(contact);
      }
    }
    if (address !== undefined) { // Allow address to be optional
      fields.push(`address = $${index++}`);
      if (address === '') {
        values.push(null); // Handle empty address as null
      }
      else {
        values.push(address);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    values.push(id); // Last parameter is always the ID
    const query = `UPDATE public.client SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    const result = await pool.query<Client>(query, values);

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
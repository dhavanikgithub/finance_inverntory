import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { Client } from '@/app/model/Client';
import { isValidContact, isValidEmail } from '@/utils/validators';
import kysely from '@/lib/kysely-db';
import { ClientService } from '@/services/clientService';

const clientService = new ClientService();
// Handler to get all clients
export async function GET(): Promise<NextResponse> {
  try {
    const clients = await clientService.getAllClients();
    return NextResponse.json(clients, { status: 200 });
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

    const insertedClient = await clientService.createClient(values);

    return NextResponse.json(insertedClient, { status: 201 });
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

    const updateData: Record<string, any> = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email === '' ? null : email;
    }

    if (contact !== undefined) {
      updateData.contact = contact === '' ? null : contact;
    }

    if (address !== undefined) {
      updateData.address = address === '' ? null : address;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const updated = await kysely
      .updateTable('client')
      .set(updateData)
      .where('id', '=', id)
      .returningAll()
      .execute();

    const [result] = await kysely
      .selectFrom('transaction_records')
      .where('client_id', '=', id)
      .select(kysely.fn.countAll().as('transaction_count'))
      .execute();

    const transaction_count = result?.transaction_count ?? 0;

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ ...updated[0], transaction_count }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handler to delete a client
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const { id }: { id: number } = await req.json();

    const deleted = await kysely
      .deleteFrom('client')
      .where('id', '=', id)
      .returningAll()
      .execute();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
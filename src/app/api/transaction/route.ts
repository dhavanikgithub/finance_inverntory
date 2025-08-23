import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import Transaction from '@/app/model/Transaction';

// Handler to get all transactions with client name, ordered by creation date and time
export async function GET(): Promise<NextResponse> {
    try {
        const { rows }: { rows: Transaction[] } = await pool.query<Transaction>(`
      SELECT tr.*, c.name AS client_name, bk.name AS bank_name, ct.name AS card_name
      FROM transaction_records tr 
      JOIN client c ON tr.client_id = c.id 
      LEFT JOIN bank bk ON tr.bank_id = bk.id
      LEFT JOIN card ct ON tr.card_id = ct.id
      ORDER BY tr.create_date DESC, tr.create_time DESC;
    `);

        // Return the transactions in the response
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error("Error fetching transactions with client name: ", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: 'Error fetching transactions with client name' }, { status: 500 });
    }
}

interface PostRequestBody {
    client_id?: string;
    transaction_type?: number;
    widthdraw_charges?: number;
    transaction_amount?: number;
    bank_id?: number;
    card_id?: number;
    remark?: string;  // remark is optional
}

// Handler to create a new transaction and return it with client name
export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { client_id, transaction_type, widthdraw_charges, transaction_amount, remark, bank_id, card_id }: PostRequestBody = await req.json();

        // Step 1: Validate required fields
        if (client_id === undefined) {
            return NextResponse.json({ error: 'Required field "client_id" is missing' }, { status: 400 });
        }
        if (transaction_amount === undefined) {
            return NextResponse.json({ error: 'Required field "transaction_amount" is missing' }, { status: 400 });
        }
        if (transaction_type === undefined) {
            return NextResponse.json({ error: 'Required field "transaction_type" is missing' }, { status: 400 });
        }
        if (widthdraw_charges === undefined) {
            return NextResponse.json({ error: 'Required field "widthdraw_charges" is missing' }, { status: 400 });
        }

        // Step 2: Validate data types
        if (widthdraw_charges < 0 || widthdraw_charges > 100) {
            return NextResponse.json({ error: 'Invalid value for "widthdraw_charges". It should be between 0 and 100.' }, { status: 400 });
        }

        // Step 3: Insert the new transaction into the database
        const newTransaction = await pool.query(
            `INSERT INTO transaction_records(client_id, transaction_type, widthdraw_charges, transaction_amount, remark, bank_id, card_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
            [client_id, transaction_type, widthdraw_charges, transaction_amount, remark || '', bank_id, card_id]
        );

        // Step 4: Get the client name for the inserted transaction
        const transactionWithClientName = await pool.query<Transaction>(
            `SELECT tr.*, c.name AS client_name, bk.name AS bank_name, ct.name AS card_name
      FROM transaction_records tr 
      JOIN client c ON tr.client_id = c.id 
      LEFT JOIN bank bk ON tr.bank_id = bk.id
      LEFT JOIN card ct ON tr.card_id = ct.id
         WHERE tr.id = $1;`,
            [newTransaction.rows[0].id]
        );

        return NextResponse.json(transactionWithClientName.rows[0], { status: 201 });
    } catch (error) {
        console.error(error); // Log error for debugging purposes
        return NextResponse.json({ error: 'Error saving transaction' }, { status: 500 });
    }
}


interface PutRequestBody {
    id?: number;
    client_id?: number;
    transaction_type?: number;
    widthdraw_charges?: number;
    transaction_amount?: number;
    remark?: string; // remark is optional
    bank_id?:number;
    card_id?:number;
}

// Handler to update a transaction
export async function PUT(req: Request): Promise<NextResponse> {
    try {
        const { id, client_id, transaction_type, widthdraw_charges, transaction_amount, remark, bank_id, card_id }: PutRequestBody = await req.json();

        // Check for required field (id is mandatory for updating a transaction)
        if (!id) {
            return NextResponse.json({ error: 'Required field "id" is missing' }, { status: 400 });
        }

        // Start building the SET clause of the query dynamically
        let setClause: string[] = [];
        let values: (string | number)[] = [];

        // Validation for each variable
        if (client_id !== undefined) {
            if (typeof client_id !== 'number' || isNaN(client_id)) {
                return NextResponse.json({ error: 'Invalid value for "client_id". It should be a number.' }, { status: 400 });
            }
            setClause.push("client_id = $" + (values.length + 1));
            values.push(client_id);
        }

        if (transaction_type !== undefined) {
            if (typeof transaction_type !== 'number' || isNaN(transaction_type)) {
                return NextResponse.json({ error: 'Invalid value for "transaction_type". It should be a valid integer.' }, { status: 400 });
            }
            setClause.push("transaction_type = $" + (values.length + 1));
            values.push(transaction_type);
        }

        if (widthdraw_charges !== undefined) {
            if (typeof widthdraw_charges !== 'number' || isNaN(widthdraw_charges)) {
                return NextResponse.json({ error: 'Invalid value for "widthdraw_charges". It should be a number.' }, { status: 400 });
            }
            if (widthdraw_charges < 0 || widthdraw_charges > 100) {
                return NextResponse.json({ error: 'Invalid value for "widthdraw_charges". It should be between 0 and 100.' }, { status: 400 });
            }
            setClause.push("widthdraw_charges = $" + (values.length + 1));
            values.push(widthdraw_charges);
        }
        if (transaction_amount !== undefined) {
            if (typeof transaction_amount !== 'number' || isNaN(transaction_amount)) {
                return NextResponse.json({ error: 'Invalid value for "transaction_amount". It should be a number.' }, { status: 400 });
            }
            setClause.push("transaction_amount = $" + (values.length + 1));
            values.push(transaction_amount);
        }
        if (bank_id !== undefined) {
            if (typeof bank_id !== 'number' || isNaN(bank_id)) {
                return NextResponse.json({ error: 'Invalid value for "bank_id". It should be a number.' }, { status: 400 });
            }
            setClause.push("bank_id = $" + (values.length + 1));
            values.push(bank_id);
        }
        if (card_id !== undefined) {
            if (typeof card_id !== 'number' || isNaN(card_id)) {
                return NextResponse.json({ error: 'Invalid value for "card_id". It should be a number.' }, { status: 400 });
            }
            setClause.push("card_id = $" + (values.length + 1));
            values.push(card_id);
        }
        if (remark !== undefined) {
            setClause.push("remark = $" + (values.length + 1));
            values.push(remark);
        }

        // Check if at least one field to update is provided
        if (setClause.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        // Add the ID as the last parameter for the WHERE clause
        values.push(id);

        // Build the final SQL query string
        const query = `UPDATE transaction_records SET ${setClause.join(', ')} WHERE id = $${(values.length)} RETURNING *`;

        // Execute the query
        const updatedTransaction = await pool.query(query, values);

        // Step 4: Get the client name for the updated transaction
        const updatedTransactionWithClientName = await pool.query(
            `SELECT tr.*, c.name AS client_name, bk.name AS bank_name, ct.name AS card_name
      FROM transaction_records tr 
      JOIN client c ON tr.client_id = c.id 
      LEFT JOIN bank bk ON tr.bank_id = bk.id
      LEFT JOIN card ct ON tr.card_id = ct.id
         WHERE tr.id = $1;`,
            [updatedTransaction.rows[0].id]
        );

        // Return the updated transaction
        return NextResponse.json(updatedTransactionWithClientName.rows[0], { status: 201 });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return NextResponse.json({ error: 'Error updating transaction' }, { status: 500 });
    }
}

// Handler to delete a transaction
export async function DELETE(req: Request): Promise<NextResponse> {
    try {
        const { id }: { id?: number } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'Required field "id" is missing' }, { status: 400 });
        }

        const deletedTransaction = await pool.query(
            'DELETE FROM transaction_records WHERE id = $1 RETURNING *',
            [id]
        );

        return NextResponse.json(deletedTransaction.rows[0], { status: 200 });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return NextResponse.json({ error: 'Error deleting transaction' }, { status: 500 });
    }
}
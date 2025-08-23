import { NextRequest, NextResponse } from 'next/server';
import kysely from '@/lib/kysely-db';
import { NextApiRequest } from 'next';


// Handler to get all clients
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ name: string }> }
): Promise<NextResponse> {
    try {
        const { name } = await context.params;
        const clientName = decodeURIComponent(name);
        const transactions = await kysely
            .selectFrom('transaction_records as tr')
            .leftJoin('client', 'tr.client_id', 'client.id')
            .leftJoin('bank as bk', 'tr.bank_id', 'bk.id')
            .leftJoin('card as ct', 'tr.card_id', 'ct.id')
            .select([
                'tr.id',
                'tr.transaction_type',
                'tr.client_id',
                'tr.widthdraw_charges',
                'tr.transaction_amount',
                'client.name as client_name',
                'bk.name as bank_name',
                'ct.name as card_name',
                'tr.bank_id',
                'tr.card_id',
                'tr.remark',
                'tr.create_date',
                'tr.create_time',
                'tr.modify_date',
                'tr.modify_time'
            ])
            .where('client.name', '=', clientName)
            .orderBy('tr.create_date', 'asc') // 👈 fixed alias usage
            .execute();

        return NextResponse.json(transactions, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

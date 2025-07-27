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
            .selectFrom('client')
            .selectAll()
            .where('name', '=', clientName)
            .execute();

        return NextResponse.json(transactions, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

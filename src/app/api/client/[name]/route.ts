import { NextRequest, NextResponse } from 'next/server';
import { ClientService } from '@/services/clientService';


// Handler to get all clients
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ name: string }> }
): Promise<NextResponse> {
    try {
        const { name } = await context.params;
        const clientName = decodeURIComponent(name);
        const clientService = new ClientService();
        const clients = await clientService.getClientByName(clientName);

        return NextResponse.json([clients], { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

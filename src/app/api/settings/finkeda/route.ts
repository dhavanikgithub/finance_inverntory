import { NextResponse } from 'next/server';
import kysely from '@/lib/kysely-db';
import { FinkedaService } from '@/services/finkedaService';
const finkedaService = new FinkedaService();
export async function GET(): Promise<NextResponse> {
  try {
    const latest = await finkedaService.getLatestSettings();

    if (!latest) {
      return NextResponse.json({ error: 'No settings found' }, { status: 404 });
    }

    return NextResponse.json(latest, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const { rupay_card_charge_amount, master_card_charge_amount } = await req.json();

    if (
      typeof rupay_card_charge_amount !== 'number' ||
      typeof master_card_charge_amount !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid charge amounts' }, { status: 400 });
    }

    const existing = await finkedaService.getLatestSettings();

    let updatedSetting;

    if (existing) {
      // Insert into history before update
      await finkedaService.insertSettingsHistory({
        calculator_settings_id: existing.id!,
        previous_rupay_amount: existing.rupay_card_charge_amount,
        previous_master_amount: existing.master_card_charge_amount,
        new_rupay_amount: rupay_card_charge_amount,
        new_master_amount: master_card_charge_amount,
      });

      // Update main table
      updatedSetting = await finkedaService.updateSettings(existing.id!, {
        rupay_card_charge_amount,
        master_card_charge_amount,
      });
    } else {
      updatedSetting = await finkedaService.insertSettings({
        rupay_card_charge_amount,
        master_card_charge_amount,
      })
    }

    return NextResponse.json(updatedSetting, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

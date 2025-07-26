import { NextResponse } from 'next/server';
import kysely from '@/lib/kysely-db';

export async function GET(): Promise<NextResponse> {
  try {
    const latest = await kysely
      .selectFrom('finkeda_calculator_settings')
      .selectAll()
      .orderBy('id', 'desc')
      .limit(1)
      .executeTakeFirst();

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

    const existing = await kysely
      .selectFrom('finkeda_calculator_settings')
      .selectAll()
      .orderBy('id', 'desc')
      .limit(1)
      .executeTakeFirst();

    let updatedSetting;

    if (existing) {
      // Insert into history before update
      await kysely
        .insertInto('finkeda_calculator_settings_history')
        .values({
          calculator_settings_id: existing.id!!,
          previous_rupay_amount: existing.rupay_card_charge_amount,
          previous_master_amount: existing.master_card_charge_amount,
          new_rupay_amount: rupay_card_charge_amount,
          new_master_amount: master_card_charge_amount,
        })
        .execute();

      // Update main table
      updatedSetting = await kysely
        .updateTable('finkeda_calculator_settings')
        .set({
          rupay_card_charge_amount,
          master_card_charge_amount,
          modify_date: new Date().toISOString().split('T')[0],
          modify_time: new Date().toTimeString().split(' ')[0],
        })
        .where('id', '=', existing.id)
        .returningAll()
        .executeTakeFirst();
    } else {
      updatedSetting = await kysely
        .insertInto('finkeda_calculator_settings')
        .values({
          rupay_card_charge_amount,
          master_card_charge_amount,
        })
        .returningAll()
        .executeTakeFirst();
    }

    return NextResponse.json(updatedSetting, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

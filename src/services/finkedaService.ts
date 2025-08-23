// lib/services/FinkedaService.ts

import kysely from '@/lib/kysely-db'

export class FinkedaService {
    async getLatestSettings() {
        const latest = await kysely
            .selectFrom('finkeda_calculator_settings')
            .selectAll()
            .orderBy('id', 'desc')
            .limit(1)
            .executeTakeFirst()

        return latest
    }
    async getSettingsHistory() {
        const history = await kysely
            .selectFrom('finkeda_calculator_settings_history')
            .selectAll()
            .orderBy('id', 'desc')
            .execute()

        return history
    }

    async insertSettings(data: {
        rupay_card_charge_amount: number
        master_card_charge_amount: number
    }) {
        return await kysely
            .insertInto('finkeda_calculator_settings')
            .values(data)
            .returningAll()
            .executeTakeFirst()
    }

    async updateSettings(
        id: number,
        data: {
            rupay_card_charge_amount: number
            master_card_charge_amount: number
        }
    ) {
        return await kysely
            .updateTable('finkeda_calculator_settings')
            .set({
                ...data,
                modify_date: new Date().toISOString().split('T')[0],
                modify_time: new Date().toTimeString().split(' ')[0],
            })
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst()
    }

    async insertSettingsHistory(historyData: {
        calculator_settings_id: number
        previous_rupay_amount: number
        previous_master_amount: number
        new_rupay_amount: number
        new_master_amount: number
    }) {
        return await kysely
            .insertInto('finkeda_calculator_settings_history')
            .values(historyData)
            .execute()
    }
}

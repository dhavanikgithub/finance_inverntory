import { Client } from '@/app/model/Client'
import pool from '@/lib/db'
import kysely from '@/lib/kysely-db'
import { sql } from 'kysely'

export class ClientService {
  async getClientById(clientId: number) {
    const client = await kysely
      .selectFrom('client')
      .selectAll()
      .where('id', '=', clientId)
      .executeTakeFirst()

    return client
  }

  async getClientByName(clientName: string) {
    const client = await kysely
      .selectFrom('client')
      .selectAll()
      .where('name', '=', clientName)
      .executeTakeFirst()

    return client
  }

  async getAllClients() {
    const clients = await pool.query<Client>(`SELECT 
    c.*, 
    COALESCE(tr.transaction_count, 0) AS transaction_count
FROM client c
LEFT JOIN (
    SELECT 
        client_id, 
        COUNT(*) AS transaction_count
    FROM transaction_records
    GROUP BY client_id
) tr ON tr.client_id = c.id
ORDER BY c.name ASC;`)

    return clients.rows
  }

  async createClient(values: any[]) {
    const [insertedClient] = await kysely
      .insertInto('client')
      .values({
        name: values[0],
        email: values[1],
        contact: values[2],
        address: values[3],
      })
      .returning([
    'id',
    'name',
    'email',
    'contact',
    'address',
    'create_date',
    'create_time',
    'modify_date',
    'modify_time',
    sql<number>`0`.as('transaction_count'),
  ])
      .execute()

    return insertedClient
  }
}

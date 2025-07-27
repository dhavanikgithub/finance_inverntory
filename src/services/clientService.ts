import kysely from '@/lib/kysely-db'

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
    const clients = await kysely
      .selectFrom('client')
      .selectAll()
      .orderBy('name', 'asc')
      .execute()

    return clients
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
      .returningAll()
      .execute()

    return insertedClient
  }
}

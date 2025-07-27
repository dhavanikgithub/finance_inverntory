import { Client } from '@/app/model/Client';
import ClientTransaction from './ClientTransaction';
import { ClientService } from '@/services/clientService';

export type ClientTransactionProps = {
  clients: Client[];
};


export default async function Home(context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params!;
  const clientService = new ClientService();
  const client = await clientService.getClientByName(decodeURIComponent(name)); // Fetch clients using the service
  if (!client) {
    return { notFound: true }; // optional: show 404 if client not found
  }
  return (
    <>
      {/* Render client component, passing server data */}
      <ClientTransaction clients={[client]} />
    </>
  );
}
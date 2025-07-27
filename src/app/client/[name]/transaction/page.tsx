import { Client } from '@/app/model/Client';
import ClientTransaction from './ClientTransaction';


export type ClientTransactionProps = {
  clients: Client[];
};


export default async function Home(context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params!;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/client/${encodeURIComponent(String(name))}`);
  if (!res.ok) {
    return { notFound: true }; // optional: show 404 if client not found
  }
  const clients: Client[] = await res.json();

  return (
    <>
      {/* Render client component, passing server data */}
      <ClientTransaction clients={clients} />
    </>
  );
}
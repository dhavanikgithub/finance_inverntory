import FinkedaCalculationScreen from './FinkedaCalculationScreen';
import { FinkedaSettings } from '../model/FinkedaSettings';

export const dynamic = 'force-dynamic'; // disables static optimization

export type ClientTransactionProps = {
  initialSettings: FinkedaSettings;
};


export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/settings/finkeda`);
  if (!res.ok) {
    return { notFound: true }; // optional: show 404 if client not found
  }
  const initialSettings: FinkedaSettings[] = await res.json();

  return (
    <>
      {/* Render client component, passing server data */}
      <FinkedaCalculationScreen initialSettings={initialSettings[0]} />
    </>
  );
}
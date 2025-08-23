import FinkedaCalculationScreen from './FinkedaCalculationScreen';
import { FinkedaSettings } from '../model/FinkedaSettings';
import { FinkedaService } from '@/services/finkedaService';

export type ClientTransactionProps = {
  initialSettings: FinkedaSettings;
};


export default async function Page() {
  const finkedaService = new FinkedaService();
  const finkedaSettings = await finkedaService.getLatestSettings();
  if(!finkedaSettings) {
    return { notFound: true }; // optional: show 404 if settings not found
  }
  const initialSettings: FinkedaSettings[] = [finkedaSettings];

  return (
    <>
      {/* Render client component, passing server data */}
      <FinkedaCalculationScreen initialSettings={initialSettings[0]} />
    </>
  );
}
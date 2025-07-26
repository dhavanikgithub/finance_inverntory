import { FinkedaSettings } from './FinkedaSettings';

interface FinkedaSettingsState {
  settings: FinkedaSettings | null;
  loading: boolean;
}

export default FinkedaSettingsState;

import { AppDispatch } from '../store';
import { setLoading, setSettings, updateSettings } from '../slices/finkedaSettingsSlice';
import { FinkedaSettings } from '@/app/model/FinkedaSettings';
import { APIResponseError } from '@/app/model/APIResponseError';
import { showToastError, showToastSuccess } from '@/utils/toast';

const API_URL = '/api/settings/finkeda';

// Fetch settings
export const fetchFinkedaSettings = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const data: FinkedaSettings = await response.json();
      dispatch(setSettings(data));
    } else {
      const errorData: APIResponseError = await response.json();
      console.error('Failed to fetch settings:', errorData.error);
      showToastError('Failed to fetch settings', errorData.error);
    }
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    showToastError('Error fetching settings', error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Update settings
export const updateFinkedaSettings = (settings: FinkedaSettings) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (response.ok) {
      const data: FinkedaSettings = await response.json();
      dispatch(updateSettings(data));
      showToastSuccess('Settings Updated', 'The card settings have been updated.');
    } else {
      const errorData: APIResponseError = await response.json();
      console.error('Failed to update settings:', errorData.error);
      showToastError('Failed to update settings', errorData.error);
    }
  } catch (error: any) {
    console.error('Error updating settings:', error);
    showToastError('Error updating settings', error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

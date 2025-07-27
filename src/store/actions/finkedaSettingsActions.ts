import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { FinkedaSettings } from '@/app/model/FinkedaSettings';
import { showToastError, showToastSuccess } from '@/utils/toast';

const API_URL = '/api/settings/finkeda';

// Fetch settings
export const fetchFinkedaSettings = createAsyncThunk<
  FinkedaSettings, // ✅ Return type
  void,            // ✅ No argument
  { rejectValue: string }
>(
  'settings/fetchFinkedaSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      if (axios.isAxiosError(error) && error.response) {
        showToastError('Failed to fetch settings', error.response.data);
        return rejectWithValue(error.response.data);
      } else if (axios.isAxiosError(error) && error.request) {
        showToastError('Error fetching settings', 'No response from server');
        return rejectWithValue('No response from server');
      } else {
        showToastError('Error fetching settings', 'Unexpected error');
        return rejectWithValue('Unexpected error');
      }
    }
  }
);

// Update settings
export const updateFinkedaSettings = createAsyncThunk<
  FinkedaSettings,           // ✅ Return updated settings
  FinkedaSettings,           // ✅ Takes updated settings as argument
  { rejectValue: string }
>(
  'settings/updateFinkedaSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await axios.put(API_URL, settings);
      showToastSuccess('Settings Updated', 'The card settings have been updated.');
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      if (axios.isAxiosError(error) && error.response) {
        showToastError('Failed to update settings', error.response.data);
        return rejectWithValue(error.response.data);
      } else if (axios.isAxiosError(error) && error.request) {
        showToastError('Error updating settings', 'No response from server');
        return rejectWithValue('No response from server');
      } else {
        showToastError('Error updating settings', 'Unexpected error');
        return rejectWithValue('Unexpected error');
      }
    }
  }
);

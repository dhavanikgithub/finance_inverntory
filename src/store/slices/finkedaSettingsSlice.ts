import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FinkedaSettings } from '@/app/model/FinkedaSettings';
import FinkedaSettingsState from '@/app/model/FinkedaSettingsState';
import {
  fetchFinkedaSettings,
  updateFinkedaSettings,
} from '../actions/finkedaSettingsActions';

const initialState: FinkedaSettingsState = {
  settings: null,
  loading: false,
};

const finkedaSettingsSlice = createSlice({
  name: 'finkedaSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch settings
    builder
      .addCase(fetchFinkedaSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFinkedaSettings.fulfilled, (state, action: PayloadAction<FinkedaSettings>) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchFinkedaSettings.rejected, (state) => {
        state.loading = false;
      });

    // Update settings
    builder
      .addCase(updateFinkedaSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFinkedaSettings.fulfilled, (state, action: PayloadAction<FinkedaSettings>) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateFinkedaSettings.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default finkedaSettingsSlice.reducer;

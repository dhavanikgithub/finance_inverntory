import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FinkedaSettings } from '@/app/model/FinkedaSettings';
import FinkedaSettingsState from '@/app/model/FinkedaSettingsState';

const initialState: FinkedaSettingsState = {
  settings: null,
  loading: false,
};

const finkedaSettingsSlice = createSlice({
  name: 'finkedaSettings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSettings: (state, action: PayloadAction<FinkedaSettings>) => {
      state.settings = action.payload;
    },
    updateSettings: (state, action: PayloadAction<FinkedaSettings>) => {
      state.settings = action.payload;
    },
  },
});

export const { setLoading, setSettings, updateSettings } = finkedaSettingsSlice.actions;

export default finkedaSettingsSlice.reducer;

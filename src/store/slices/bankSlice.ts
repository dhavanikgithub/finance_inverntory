import { Bank } from '@/app/model/Bank';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BankState {
  banks: Bank[];
  loading: boolean;
  error: string | null;
}

const initialState: BankState = {
  banks: [],
  loading: false,
  error: null,
};

const bankSlice = createSlice({
  name: 'bank',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setBanks: (state, action: PayloadAction<Bank[]>) => {
      state.banks = action.payload;
      state.error = null;
    },
    addBank: (state, action: PayloadAction<Bank>) => {
      state.banks.push(action.payload);
      state.error = null;
    },
    updateBank: (state, action: PayloadAction<Bank>) => {
      const index = state.banks.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.banks[index] = action.payload;
      }
      state.error = null;
    },
    deleteBank: (state, action: PayloadAction<number>) => {
      state.banks = state.banks.filter(b => b.id !== action.payload);
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setBanks,
  addBank,
  updateBank,
  deleteBank,
  setError,
} = bankSlice.actions;

export default bankSlice.reducer;

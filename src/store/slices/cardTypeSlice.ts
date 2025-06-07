import { CardType } from '@/app/model/CardType';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface CardTypeState {
  cardTypes: CardType[];
  loading: boolean;
  error: string | null;
}

const initialState: CardTypeState = {
  cardTypes: [],
  loading: false,
  error: null,
};

const cardTypeSlice = createSlice({
  name: 'cardType',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCardTypes: (state, action: PayloadAction<CardType[]>) => {
      state.cardTypes = action.payload;
      state.error = null;
    },
    addCardType: (state, action: PayloadAction<CardType>) => {
      state.cardTypes.push(action.payload);
      state.error = null;
    },
    updateCardType: (state, action: PayloadAction<CardType>) => {
      const index = state.cardTypes.findIndex(ct => ct.id === action.payload.id);
      if (index !== -1) {
        state.cardTypes[index] = action.payload;
      }
      state.error = null;
    },
    deleteCardType: (state, action: PayloadAction<number>) => {
      state.cardTypes = state.cardTypes.filter(ct => ct.id !== action.payload);
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setCardTypes,
  addCardType,
  updateCardType,
  deleteCardType,
  setError,
} = cardTypeSlice.actions;

export default cardTypeSlice.reducer;
import { Card } from '@/app/model/Card';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface CardTypeState {
  cards: Card[];
  loading: boolean;
  error: string | null;
}

const initialState: CardTypeState = {
  cards: [],
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
    setCards: (state, action: PayloadAction<Card[]>) => {
      state.cards = action.payload;
      state.error = null;
    },
    addCard: (state, action: PayloadAction<Card>) => {
      state.cards.push(action.payload);
      state.error = null;
    },
    updateCard: (state, action: PayloadAction<Card>) => {
      const index = state.cards.findIndex(ct => ct.id === action.payload.id);
      if (index !== -1) {
        state.cards[index] = action.payload;
      }
      state.error = null;
    },
    deleteCard: (state, action: PayloadAction<number>) => {
      state.cards = state.cards.filter(ct => ct.id !== action.payload);
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setCards,
  addCard,
  updateCard,
  deleteCard,
  setError,
} = cardTypeSlice.actions;

export default cardTypeSlice.reducer;
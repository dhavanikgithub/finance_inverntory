import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './slices/clientSlice';
import transactionReducer from './slices/transactionSlice';
import cardReducer from './slices/cardSlice';
import bankReducer from './slices/bankSlice';

// Configure the Redux store with types
const store = configureStore({
  reducer: {
    client: clientReducer,
    transaction: transactionReducer,
    card: cardReducer,
    bank: bankReducer
  },
});

// Define the types for the RootState and AppDispatch
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;

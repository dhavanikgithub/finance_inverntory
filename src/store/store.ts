import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './slices/clientSlice';
import transactionReducer from './slices/transactionSlice';

// Configure the Redux store with types
const store = configureStore({
  reducer: {
    client: clientReducer,
    transaction: transactionReducer,
  },
});

// Define the types for the RootState and AppDispatch
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;

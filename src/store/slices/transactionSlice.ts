import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchTransactions, addTransaction, updateTransaction, deleteTransaction } from '../actions/transactionActions';

// Define the type for a transaction (expand this based on your actual transaction structure)
export interface Transaction {
  id?: number;
  amount: number;
  transaction_type: number;
  client_id: number;
  final_amount: number;
  widthdraw_charges: number;
  transaction_amount: number;
  client_name: string;
  remark: string;
  create_date?: string;
  create_time?: string;
}

// Define the type for the state
interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch transactions
    builder.addCase(fetchTransactions.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
      state.loading = false;
      state.transactions = action.payload;
    })
    .addCase(fetchTransactions.rejected, (state) => {
      state.loading = false;
    });

    // Add transaction
    builder.addCase(addTransaction.pending, (state) => {
      state.loading = true;
    })
    .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
      state.loading = false;
      state.transactions.unshift(action.payload); // Add the new transaction at the first position
    })
    .addCase(addTransaction.rejected, (state) => {
      state.loading = false;
    });

    // Update transaction
    builder.addCase(updateTransaction.pending, (state) => {
      state.loading = true;
    })
    .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
      state.loading = false;
      state.transactions = state.transactions.map((transaction) =>
        transaction.id === action.payload.id ? action.payload : transaction
      );
    })
    .addCase(updateTransaction.rejected, (state) => {
      state.loading = false;
    });

    // Delete transaction
    builder.addCase(deleteTransaction.pending, (state) => {
      state.loading = true;
    })
    .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
      state.loading = false;
      // Remove the deleted transaction by id
      state.transactions = state.transactions.filter((transaction) => transaction.id !== action.payload.id);
    })
    .addCase(deleteTransaction.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default transactionSlice.reducer;

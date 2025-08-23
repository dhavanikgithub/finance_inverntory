import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchTransactions, addTransaction, updateTransaction, deleteTransaction, fetchTransactionsByClient } from '../actions/transactionActions';
import TransactionState from '@/app/model/TransactionState';
import Transaction from '@/app/model/Transaction';



const initialState: TransactionState = {
  transactions: [],
  loading: false,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 👇 New: Fetch transactions by client
    builder.addCase(fetchTransactionsByClient.pending, (state) => {
      state.loading = true;
    })
      .addCase(fetchTransactionsByClient.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsByClient.rejected, (state) => {
        state.loading = false;
      });

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

import Transaction from '@/app/model/Transaction';
import { showToastError, showToastSuccess } from '@/utils/toast';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



const API_URL = '/api/transaction';

// Fetch transactions
export const fetchTransactions = createAsyncThunk<
  Transaction[], // Return type of the async function (array of transactions)
  void, // The type of the argument passed to the async function (no arguments in this case)
  { rejectValue: string } // Type for rejectWithValue, error handling
>(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL); // GET request
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Server error response
        showToastError('Failed to fetch transactions',error.response.data);
        return rejectWithValue(error.response.data);
      } else if (axios.isAxiosError(error) && error.request) {
        // Network error or no response received
        showToastError('Error fetching transactions','Network error or no response received')
        return rejectWithValue('Network error or no response received');
      } else {
        // Other errors
        showToastError('Error fetching transactions','An error occurred while fetching transactions');
        return rejectWithValue('An error occurred while fetching transactions');
      }
    }
  }
);

// Add new transaction
export const addTransaction = createAsyncThunk<
  Transaction, // Return type of the async function (single transaction)
  Transaction, // The type of the argument passed to the async function (transaction data)
  { rejectValue: string } // Type for rejectWithValue, error handling
>(
  'transactions/addTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, transactionData); // POST request
      showToastSuccess('Transaction Added', 'The new transaction has been added successfully.');
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Server error response
        showToastError('Failed to add transaction',error.response.data);
        return rejectWithValue(error.response.data);
      } else if (axios.isAxiosError(error) && error.request) {
        // Network error or no response received
        showToastError('Error adding transaction','Network error or no response received');
        return rejectWithValue('Network error or no response received');
      } else {
        // Other errors
        showToastError('Error adding transaction', 'An error occurred while adding the transaction');
        return rejectWithValue('An error occurred while adding the transaction');
      }
    }
  }
);

// Update an existing transaction
export const updateTransaction = createAsyncThunk<
  Transaction, // Return type of the async function (updated transaction)
  Transaction, // The type of the argument passed to the async function (transaction data)
  { rejectValue: string } // Type for rejectWithValue, error handling
>(
  'transactions/updateTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.put(API_URL, transactionData); // PUT request
      showToastSuccess('Transaction Updated', 'The transaction was updated successfully.');
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Server error response
        showToastError('Failed to update transaction',error.response.data);
        return rejectWithValue(error.response.data);
      } else if (axios.isAxiosError(error) && error.request) {
        // Network error or no response received
        showToastError('Error updating transaction','Network error or no response received');
        return rejectWithValue('Network error or no response received');
      } else {
        // Other errors
        showToastError('Error updating transaction', 'An error occurred while updating the transaction');
        return rejectWithValue('An error occurred while updating the transaction');
      }
    }
  }
);

// Delete a transaction
export const deleteTransaction = createAsyncThunk<
  { id: number }, // Return type of the async function (response contains the deleted transaction id)
  number, // The type of the argument passed to the async function (transaction id)
  { rejectValue: string } // Type for rejectWithValue, error handling
>(
  'transactions/deleteTransaction',
  async (transactionId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(API_URL, { data: { id: transactionId } }); // DELETE request
      showToastSuccess('Transaction Deleted', 'The transaction was deleted successfully.');
      return response.data;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      if (axios.isAxiosError(error) && error.response) {
        // Server error response
        showToastError('Failed to delete transaction',error.response.data);
        return rejectWithValue(error.response.data);
      } else if (axios.isAxiosError(error) && error.request) {
        // Network error or no response received
        showToastError('Error deleting transaction','Network error or no response received');
        return rejectWithValue('Network error or no response received');
      } else {
        // Other errors
        showToastError('Error deleting transaction', 'An error occurred while deleting the transaction')
        return rejectWithValue('An error occurred while deleting the transaction');
      }
    }
  }
);

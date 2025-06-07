import { AppDispatch } from '../store';
import { Bank, BankInput } from '@/app/model/Bank';
import {
  setLoading,
  setBanks,
  addBank,
  updateBank,
  deleteBank,
  setError,
} from '../slices/bankSlice';

const API_URL = '/api/bank';

// Fetch all banks
export const fetchBanks = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL);
    const data: Bank[] = await response.json();
    dispatch(setBanks(data));
  } catch (error) {
    console.error('Error fetching banks:', error);
    dispatch(setError('Failed to fetch banks.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Add new bank
export const addNewBank = (bankInput: BankInput) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bankInput),
    });
    const data: Bank = await response.json();
    dispatch(addBank(data));
  } catch (error) {
    console.error('Error adding bank:', error);
    dispatch(setError('Failed to add bank.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Update bank
export const updateBankData = (bank: Bank) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bank),
    });
    const data: Bank = await response.json();
    dispatch(updateBank(data));
  } catch (error) {
    console.error('Error updating bank:', error);
    dispatch(setError('Failed to update bank.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete bank
export const deleteBankData = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    dispatch(deleteBank(id));
  } catch (error) {
    console.error('Error deleting bank:', error);
    dispatch(setError('Failed to delete bank.'));
  } finally {
    dispatch(setLoading(false));
  }
};

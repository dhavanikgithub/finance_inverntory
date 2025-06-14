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
import { APIResponseError } from '@/app/model/APIResponseError';
import { showToastError, showToastNotify } from '@/utils/toast';

const API_URL = '/api/bank';

// Fetch all banks
export const fetchBanks = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL);
    if(response.ok){
      const data: Bank[] = await response.json();
      dispatch(setBanks(data));
    }
    else{
      const data:APIResponseError = await response.json();
      dispatch(setError(data.error))
      showToastError('Failed to fetch banks.', data.error);
    }
  } catch (error:any) {
    console.error('Error fetching banks:', error);
    dispatch(setError(`Error fetching banks: ${error.message}`));
    showToastError('Error fetching banks', error.message);
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
    if(response.ok){
      const data: Bank = await response.json();
      dispatch(addBank(data));
    }
    else{
      const data:APIResponseError = await response.json();
      if(data.error === `duplicate key value violates unique constraint "bank_name_ukey"`){
        dispatch(setError('Bank Name Already Exists'))
        showToastNotify('Bank Name Already Exists', 'Please choose a different name for the bank.');
      }else{
        dispatch(setError(data.error))
        showToastError('Failed to add bank', data.error);
      }
    }
  } catch (error:any) {
    console.error('Error adding bank:', error.message);
    dispatch(setError(`Error adding bank: ${error.message}`));
    showToastError('Error adding bank', error.message);
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
    if(response.ok){
      const data: Bank = await response.json();
      dispatch(updateBank(data));
    }
    else{
      const data:APIResponseError = await response.json();
      if(data.error === `duplicate key value violates unique constraint "bank_name_ukey"`){
        dispatch(setError('Bank Name Already Exists'))
        showToastNotify('Bank Name Already Exists', 'Please choose a different name for the bank.');
      }
      else{
        dispatch(setError(data.error))
        showToastError('Failed to update bank', data.error);
      }
    }
  } catch (error: any) {
    console.error('Error updating bank:', error.message);
    dispatch(setError(`Error updating bank: ${error.message}`));
    showToastError('Error updating bank', error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete bank
export const deleteBankData = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if(response.ok){
      dispatch(deleteBank(id));
    }
    else{
      const data:APIResponseError = await response.json();
      dispatch(setError(data.error))
      showToastError('Failed to delete bank.', data.error);
    }
  } catch (error: any) {
    console.error('Error deleting bank:', error.message);
    dispatch(setError(`Error deleting bank: ${error.message}`));
    showToastError('Error deleting bank', error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

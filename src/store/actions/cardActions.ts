import { AppDispatch } from '../store';
import {
  setLoading,
  setCards,
  addCard,
  updateCard,
  deleteCard,
  setError,
} from '../slices/cardSlice';
import { Card } from '@/app/model/Card';
import { APIResponseError } from '@/app/model/APIResponseError';
import { showToastError, showToastNotify, showToastSuccess } from '@/utils/toast';

const API_URL = '/api/card';

// Fetch all cards
export const fetchCards = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      const errorData: APIResponseError = await response.json(); // Assuming the API returns an error object
      console.error('Failed to fetch cards:', errorData.error);
      showToastError('Failed to fetch cards', errorData.error);
    }
    const data: Card[] = await response.json();
    dispatch(setCards(data));
  } catch (error: any) {
    console.error('Error fetching cards:', error);
    dispatch(setError(error.message));
    showToastError('Error fetching cards', error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Add a new card
export const addNewCard = (card: Omit<Card, 'id'>) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });


    if (!response.ok) {
      const errorData: APIResponseError = await response.json(); // Assuming the API returns an error object
      console.error('Failed to add card:', errorData.error);
      if(errorData.error === `duplicate key value violates unique constraint "card_name_ukey"`){
        showToastNotify('Card Name Already Exists', 'Please choose a different name for the card.');
      }else{
        showToastError('Failed to add card', errorData.error);
      }
      return;
    }

    const data: Card = await response.json();
    dispatch(addCard(data));
    showToastSuccess('Card Added', 'The card was added successfully.');
  } catch (error: any) {
    console.error('Error adding card:', error.message);
    dispatch(setError(error.message));
    showToastError('Error Adding Card', error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Update an existing card
export const updateCardData = (cardType: Card) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardType),
    });
    if (!response.ok) {
      const errorData: APIResponseError = await response.json(); // Assuming the API returns an error object
      if(errorData.error === `duplicate key value violates unique constraint "card_name_ukey"`){
        showToastNotify('Card Name Already Exists', 'Please choose a different name for the card.');
      }
      else{
        showToastError('Failed to update card', errorData.error);
      }
      console.error('Failed to update card:', errorData.error);
      return;
    }

    const data: Card = await response.json();
    dispatch(updateCard(data));
    showToastSuccess('Card Updated', 'The card was updated successfully.')
  } catch (error: any) {
    console.error('Error updating card:', error.message);
    dispatch(setError(error.message));
    showToastError('Error Updating Card', error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete a card
export const deleteCardData = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData: APIResponseError = await response.json(); // Assuming the API returns an error object
      showToastError('Failed to delete card', errorData.error);
      console.error('Failed to delete card:', errorData.error);
      return;
    }

    await response.json();
    dispatch(deleteCard(id));
    showToastSuccess('Card Deleted', 'The card was deleted successfully.');
  } catch (error: any) {
    console.error('Error deleting card:', error);
    dispatch(setError(error.message));
    showToastError('Error Deleting Card', error.message);
  } finally {
    dispatch(setLoading(false));
  }
};
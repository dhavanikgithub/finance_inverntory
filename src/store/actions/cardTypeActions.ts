import { AppDispatch } from '../store';
import {
  setLoading,
  setCardTypes,
  addCardType,
  updateCardType,
  deleteCardType,
  setError,
} from '../slices/cardTypeSlice';
import { CardType } from '@/app/model/CardType';

const API_URL = '/api/card-type';

// Fetch all card types
export const fetchCardTypes = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch card types');
    }
    const data: CardType[] = await response.json();
    dispatch(setCardTypes(data));
  } catch (error: any) {
    dispatch(setError(error.message));
    console.error('Error fetching card types:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Add a new card type
export const addNewCardType = (cardType: Omit<CardType, 'id'>) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardType),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add card type');
    }
    
    const data: CardType = await response.json();
    dispatch(addCardType(data));
  } catch (error: any) {
    dispatch(setError(error.message));
    console.error('Error adding card type:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Update an existing card type
export const updateCardTypeData = (cardType: CardType) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardType),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update card type');
    }
    
    const data: CardType = await response.json();
    dispatch(updateCardType(data));
  } catch (error: any) {
    dispatch(setError(error.message));
    console.error('Error updating card type:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete a card type
export const deleteCardTypeData = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete card type');
    }
    
    await response.json();
    dispatch(deleteCardType(id));
  } catch (error: any) {
    dispatch(setError(error.message));
    console.error('Error deleting card type:', error);
  } finally {
    dispatch(setLoading(false));
  }
};
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

const API_URL = '/api/card';

// Fetch all cards
export const fetchCards = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }
    const data: Card[] = await response.json();
    dispatch(setCards(data));
  } catch (error: any) {
    dispatch(setError(error.message));
    console.error('Error fetching cards:', error);
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
      throw new Error('Failed to add card');
    }
    
    const data: Card = await response.json();
    dispatch(addCard(data));
  } catch (error: any) {
    dispatch(setError(error.message));
    console.error('Error adding card:', error);
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
      throw new Error('Failed to update card');
    }
    
    const data: Card = await response.json();
    dispatch(updateCard(data));
  } catch (error: any) {
    dispatch(setError(error.message));
    console.error('Error updating card:', error);
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
      throw new Error('Failed to delete card');
    }
    
    await response.json();
    dispatch(deleteCard(id));
  } catch (error: any) {
    dispatch(setError(error.message));
    console.error('Error deleting card:', error);
  } finally {
    dispatch(setLoading(false));
  }
};
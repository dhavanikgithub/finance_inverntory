import { AppDispatch } from '../store'; // Assuming AppDispatch is defined in your store file
import { setLoading, setClients, addClient, updateClient, deleteClient } from '../slices/clientSlice';
import { Client } from '@/app/model/Client';
import { APIResponseError } from '@/app/model/APIResponseError';
import { showToastError } from '@/utils/toast';

const API_URL = '/api/client';

// Fetch all clients
export const fetchClients = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL);
    if(response.ok){
      const data: Client[] = await response.json();  // Type the response as an array of clients
      dispatch(setClients(data));
    }
    else{
      const errorData: APIResponseError = await response.json(); // Assuming the API returns an error object
      console.error('Failed to fetch clients:', errorData.error);
      showToastError('Failed to fetch clients', errorData.error);
    }
  } catch (error:any) {
    console.error('Error fetching clients:', error);
    showToastError("Error fetching clients",error.message)
  } finally {
    dispatch(setLoading(false));
  }
};

// Add a new client
export const addNewClient = (client: Client) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if(response.ok){
      const data: Client = await response.json();  // Type the response as a single client
      dispatch(addClient(data));
    }
    else{
      const errorData: APIResponseError = await response.json(); // Assuming the API returns an error object
      console.error('Failed to add client:', errorData.error);
      showToastError("Failed to add client",errorData.error)
    }

  } catch (error:any) {
    console.error('Error adding client:', error);
    showToastError("Error adding client",error.message)
  } finally {
    dispatch(setLoading(false));
  }
};

// Update an existing client
export const updateClientData = (client: Client) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if(response.ok){
      const data: Client = await response.json();  // Type the response as a single client
      dispatch(updateClient(data));
    } else {
      const errorData: APIResponseError = await response.json(); // Assuming the API returns an error object
      console.error('Failed to update client:', errorData.error);
      showToastError("Failed to update client",errorData.error)
    }
  } catch (error:any) {
    console.error('Error updating client:', error);
    showToastError("Error updating client",error.message)
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete a client
export const deleteClientData = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      const errorData: APIResponseError = await response.json(); // Assuming the API returns an error object
      console.error('Failed to delete client:', errorData.error);
      showToastError("Failed to delete client",errorData.error)
      return;
    }
    await response.json();  // Assuming you don't need to use the response, but you can type it if necessary
    dispatch(deleteClient(id));
  } catch (error:any) {
    console.error('Error deleting client:', error);
    showToastError("Error deleting client",error.message)
  } finally {
    dispatch(setLoading(false));
  }
};

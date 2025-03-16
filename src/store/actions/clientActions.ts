import { AppDispatch } from '../store'; // Assuming AppDispatch is defined in your store file
import { setLoading, setClients, addClient, updateClient, deleteClient, Client } from '../slices/clientSlice';

const API_URL = '/api/client';

// Fetch all clients
export const fetchClients = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(API_URL);
    const data: Client[] = await response.json();  // Type the response as an array of clients
    dispatch(setClients(data));
  } catch (error) {
    console.error('Error fetching clients:', error);
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
    const data: Client = await response.json();  // Type the response as a single client
    dispatch(addClient(data));
  } catch (error) {
    console.error('Error adding client:', error);
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
    const data: Client = await response.json();  // Type the response as a single client
    dispatch(updateClient(data));
  } catch (error) {
    console.error('Error updating client:', error);
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
    await response.json();  // Assuming you don't need to use the response, but you can type it if necessary
    dispatch(deleteClient(id));
  } catch (error) {
    console.error('Error deleting client:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

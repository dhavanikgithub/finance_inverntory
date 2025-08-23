import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Client } from '@/app/model/Client';
import { showToastError, showToastSuccess } from '@/utils/toast';

const API_URL = '/api/client';

// ─────────────────────────────────────────────────────────────
// Fetch all clients
export const fetchClients = createAsyncThunk<
  Client[], // Return type
  void,
  { rejectValue: string }
>('clients/fetchClients', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    if (axios.isAxiosError(error) && error.response) {
      showToastError('Failed to fetch clients', error.response.data);
      return rejectWithValue(error.response.data);
    } else if (axios.isAxiosError(error) && error.request) {
      showToastError('Error fetching clients', 'Network error or no response received');
      return rejectWithValue('Network error or no response received');
    } else {
      showToastError('Error fetching clients', 'An unknown error occurred');
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// ─────────────────────────────────────────────────────────────
// Fetch a single client by name
export const fetchClientByName = createAsyncThunk<
  Client,
  string,
  { rejectValue: string }
>('clients/fetchClientByName', async (name, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${encodeURIComponent(name)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client by name:', error);
    if (axios.isAxiosError(error) && error.response) {
      showToastError('Failed to fetch client', error.response.data);
      return rejectWithValue(error.response.data);
    } else if (axios.isAxiosError(error) && error.request) {
      showToastError('Error fetching client', 'Network error or no response received');
      return rejectWithValue('Network error or no response received');
    } else {
      showToastError('Error fetching client', 'An unknown error occurred');
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// ─────────────────────────────────────────────────────────────
// Add new client
export const addClient = createAsyncThunk<
  Client,
  Client,
  { rejectValue: string }
>('clients/addClient', async (clientData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, clientData);
    showToastSuccess('Client Added', 'The new client has been added successfully.');
    return response.data;
  } catch (error) {
    console.error('Error adding client:', error);
    if (axios.isAxiosError(error) && error.response) {
      showToastError('Failed to add client', error.response.data);
      return rejectWithValue(error.response.data);
    } else if (axios.isAxiosError(error) && error.request) {
      showToastError('Error adding client', 'Network error or no response received');
      return rejectWithValue('Network error or no response received');
    } else {
      showToastError('Error adding client', 'An unknown error occurred');
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// ─────────────────────────────────────────────────────────────
// Update client
export const updateClient = createAsyncThunk<
  Client,
  Client,
  { rejectValue: string }
>('clients/updateClient', async (clientData, { rejectWithValue }) => {
  try {
    const response = await axios.put(API_URL, clientData);
    showToastSuccess('Client Updated', 'The client was updated successfully.');
    return response.data;
  } catch (error) {
    console.error('Error updating client:', error);
    if (axios.isAxiosError(error) && error.response) {
      showToastError('Failed to update client', error.response.data);
      return rejectWithValue(error.response.data);
    } else if (axios.isAxiosError(error) && error.request) {
      showToastError('Error updating client', 'Network error or no response received');
      return rejectWithValue('Network error or no response received');
    } else {
      showToastError('Error updating client', 'An unknown error occurred');
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// ─────────────────────────────────────────────────────────────
// Delete client
export const deleteClient = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>('clients/deleteClient', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(API_URL, {
      data: { id },
    });
    showToastSuccess('Client Deleted', 'The client was deleted successfully.');
    return response.data;
  } catch (error) {
    console.error('Error deleting client:', error);
    if (axios.isAxiosError(error) && error.response) {
      showToastError('Failed to delete client', error.response.data);
      return rejectWithValue(error.response.data);
    } else if (axios.isAxiosError(error) && error.request) {
      showToastError('Error deleting client', 'Network error or no response received');
      return rejectWithValue('Network error or no response received');
    } else {
      showToastError('Error deleting client', 'An unknown error occurred');
      return rejectWithValue('An unknown error occurred');
    }
  }
});

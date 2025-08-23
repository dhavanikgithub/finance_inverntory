import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client } from '@/app/model/Client';
import ClientState from '@/app/model/ClientState';
import {
  fetchClients,
  fetchClientByName,
  addClient,
  updateClient,
  deleteClient,
} from '../actions/clientActions';

const initialState: ClientState = {
  clients: [],
  loading: false,
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {}, // moved all logic to extraReducers
  extraReducers: (builder) => {
    // Fetch all clients
    builder.addCase(fetchClients.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchClients.rejected, (state) => {
      state.loading = false;
    });

    // Fetch client by name
    builder.addCase(fetchClientByName.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchClientByName.fulfilled, (state, action: PayloadAction<Client>) => {
      // Replace the client list with just the matched client
      state.clients = [action.payload];
      state.loading = false;
    });
    builder.addCase(fetchClientByName.rejected, (state) => {
      state.loading = false;
    });

    // Add client
    builder.addCase(addClient.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addClient.fulfilled, (state, action: PayloadAction<Client>) => {
      state.clients.unshift(action.payload); // Add to beginning
      state.loading = false;
    });
    builder.addCase(addClient.rejected, (state) => {
      state.loading = false;
    });

    // Update client
    builder.addCase(updateClient.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(updateClient.rejected, (state) => {
      state.loading = false;
    });

    // Delete client
    builder.addCase(deleteClient.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteClient.fulfilled, (state, action: PayloadAction<{ id: number }>) => {
      state.clients = state.clients.filter((c) => c.id !== action.payload.id);
      state.loading = false;
    });
    builder.addCase(deleteClient.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default clientSlice.reducer;

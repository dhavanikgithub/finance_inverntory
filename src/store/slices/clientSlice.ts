import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the client type (you can expand this based on your actual client structure)
export interface Client {
  id?: number;
  name: string;
  create_date?: string;
  create_time?: string;
}

// Define the state type
interface ClientState {
  clients: Client[];
  loading: boolean;
}

const initialState: ClientState = {
  clients: [],
  loading: false,
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
    },
    addClient: (state, action: PayloadAction<Client>) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action: PayloadAction<number>) => { // Assuming the payload is the client's id
      state.clients = state.clients.filter(client => client.id !== action.payload);
    },
  },
});

export const { setLoading, setClients, addClient, updateClient, deleteClient } = clientSlice.actions;

export default clientSlice.reducer;

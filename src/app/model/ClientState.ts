import { Client } from "./Client";

interface ClientState {
    clients: Client[];
    loading: boolean;
}

export default ClientState;
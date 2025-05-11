import Transaction from "./Transaction";

// Define the type for the state
interface TransactionState {
    transactions: Transaction[];
    loading: boolean;
}

export default TransactionState
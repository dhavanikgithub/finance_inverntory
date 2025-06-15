const Deposit = 'Deposit';
const Widthdraw = 'Widthdraw';
export type TransactionType = typeof Deposit | typeof Widthdraw;

interface Transaction {
    id?: number;
    transaction_type: number;
    client_id: number;
    widthdraw_charges: number;
    transaction_amount: number;
    client_name: string;
    bank_name?: string;
    card_name?: string;
    bank_id?: number;
    card_id?: number;
    remark: string;
    create_date?: string;
    create_time?: string;
    modify_date?: string;
    modify_time?: string;
}


export { Deposit, Widthdraw };
export default Transaction;
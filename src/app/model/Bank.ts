export interface Bank {
  id: number;
  name: string;
  create_date?: Date | null;
  create_time?: string | null;
  modify_date?: Date | null;
  modify_time?: string | null;
  transaction_count?: number;
}

export interface BankInput {
  name: string;
}
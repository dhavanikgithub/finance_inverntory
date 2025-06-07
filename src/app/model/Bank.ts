export interface Bank {
  id: number;
  name: string;
  card_type_id: number;
  card_type_name?: string; // Added for joined data
  create_date?: Date | null;
  create_time?: string | null;
  modify_date?: Date | null;
  modify_time?: string | null;
}

export interface BankInput {
  name: string;
  card_type_id: number;
}
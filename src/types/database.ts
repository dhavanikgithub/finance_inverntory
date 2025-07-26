interface Client {
    id?: number;
    name: string;
    email?: string;
    contact?: string;
    address?: string;
    create_date?: string;
    create_time?: string;
    modify_date?: string;
    modify_time?: string;
}

interface TransactionRecord {
  id: number;
  remark: string | null;
  transaction_type: number;
  client_id: number;
  widthdraw_charges: number;
  transaction_amount: number;
  create_date: string; // `date` in PostgreSQL maps to `string` in JS/TS
  create_time: string; // `time with time zone` also maps to string (ISO time)
  bank_id: number | null;
  card_id: number | null;
  modify_date: string | null;
  modify_time: string | null;
  bank_name: string | null;   // <-- allow null
  card_name: string | null;   // <-- allow null
}
interface Card {
  id: number;
  name: string;
  create_date: string | null;     // PostgreSQL `date` maps to ISO string
  create_time: string | null;     // `time with time zone` as string
  modify_date: string | null;
  modify_time: string | null;
}

interface Bank {
  id: number;
  name: string;
  create_date: string | null;     // PostgreSQL `date` → ISO string
  create_time: string | null;     // `time with time zone` → ISO string
  modify_date: string | null;
  modify_time: string | null;
}


interface FinkedaSettings {
  id?: number;
  rupay_card_charge_amount: number;
  master_card_charge_amount: number;
  create_date?: string;
  create_time?: string;
  modify_date?: string;
  modify_time?: string;
}

export interface FinkedaCalculatorSettingsHistoryTable {
  id?: number;
  calculator_settings_id: number;
  previous_rupay_amount: number;
  previous_master_amount: number;
  new_rupay_amount: number;
  new_master_amount: number;
  create_date?: Date;
  create_time?: string; // ISO 8601 time string
  modify_date?: Date;
  modify_time?: string; // ISO 8601 time string
}


export interface Database {
  client: Client;
  transaction_records: TransactionRecord;
  card: Card;
  bank: Bank;
  finkeda_calculator_settings: FinkedaSettings;
  finkeda_calculator_settings_history: FinkedaCalculatorSettingsHistoryTable;
}

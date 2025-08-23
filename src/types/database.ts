import { Bank } from "@/app/model/Bank";
import { Card } from "@/app/model/Card";
import { Client } from "@/app/model/Client";
import { FinkedaSettings } from "@/app/model/FinkedaSettings";
import Transaction from "@/app/model/Transaction";



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
  transaction_records: Transaction;
  card: Card;
  bank: Bank;
  finkeda_calculator_settings: FinkedaSettings;
  finkeda_calculator_settings_history: FinkedaCalculatorSettingsHistoryTable;
}

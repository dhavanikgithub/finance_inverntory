export interface Card {
  id: number;
  name: string;
  create_date?: Date | null;
  create_time?: string | null;
  modify_date?: Date | null;
  modify_time?: string | null;
}

export interface CardInput {
  name: string;
}
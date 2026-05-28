export interface EntrybookType {
  name: string;
  user_id: string;
  balance: number;
}

export interface ExpenseType {
  amount: number;
  message: string;
  createdAt: Date;
  _id: string;
}
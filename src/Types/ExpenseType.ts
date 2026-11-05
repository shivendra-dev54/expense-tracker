export interface EntrybookType {
  name: string;
  user_id: string;
  balance: number;
}

export interface ExpenseType {
  amount: number;
  message: string;
  expense_date: Date | string;
  createdAt: Date | string;
  _id: string;
}
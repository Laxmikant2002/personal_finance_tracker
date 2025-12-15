export interface Transaction {
  id: string;
  userId: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  createdAt: Date;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

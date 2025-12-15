import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Transaction } from '../types';
import Header from '../components/Header';
import Modal from '../components/Modal';
import AddTransaction from '../components/AddTransaction';
import TransactionTable from '../components/TransactionTable';
import FinanceChart from '../components/Charts/FinanceChart';
import ExpenseChart from '../components/Charts/ExpenseChart';
import { Plus } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionData: Transaction[] = [];
      snapshot.forEach((doc) => {
        transactionData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(transactionData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDeleteTransaction = async (id: string) => {
    await deleteDoc(doc(db, 'transactions', id));
  };

  const handleImportTransactions = async (importedTransactions: Omit<Transaction, 'id' | 'userId' | 'createdAt'>[]) => {
    if (!currentUser) return;

    const promises = importedTransactions.map(transaction =>
      addDoc(collection(db, 'transactions'), {
        userId: currentUser.uid,
        name: transaction.name,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        createdAt: new Date()
      })
    );

    await Promise.all(promises);
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Prepare chart data
  interface MonthlyData {
    name: string;
    income: number;
    expense: number;
  }
  
  const monthlyData = transactions.reduce((acc: Record<string, MonthlyData>, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { name: month, income: 0, expense: 0 };
    }
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expense += transaction.amount;
    }
    return acc;
  }, {});

  const chartData = Object.values(monthlyData);

  // Prepare expense breakdown by category
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {});

  const expenseChartData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value: value as number
  }));

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <div className="dashboard-main-full">
          <div className="welcome-header">
            <h1>Hi, Welcome back <span className="user-name">{currentUser?.displayName || 'User'}</span> 👋</h1>
            <button className="add-transaction-btn" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              Add Transaction
            </button>
          </div>

          <div className="dashboard-grid">
            <div className="balance-card">
              <p className="card-label">Total Balance</p>
              <h2 className="balance-amount">${balance.toFixed(2)}</h2>
              <div className="card-details">
                <span className="card-info">Track your finances effectively</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <p className="stat-label">Total Income</p>
              </div>
              <h3 className="stat-amount">${totalIncome.toFixed(2)}</h3>
              <div className="stat-footer">
                <span className="stat-description">All time income</span>
                <span className="stat-change positive">
                  {transactions.filter(t => t.type === 'income').length} transactions
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <p className="stat-label">Total Expenses</p>
              </div>
              <h3 className="stat-amount">${totalExpense.toFixed(2)}</h3>
              <div className="stat-footer">
                <span className="stat-description">All time expenses</span>
                <span className="stat-change negative">
                  {transactions.filter(t => t.type === 'expense').length} transactions
                </span>
              </div>
            </div>
          </div>

          <div className="chart-section">
            <FinanceChart data={chartData} />
            <ExpenseChart data={expenseChartData} />
          </div>

          <TransactionTable 
            transactions={transactions} 
            onDelete={handleDeleteTransaction}
            onImport={handleImportTransactions}
          />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddTransaction onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default Dashboard;
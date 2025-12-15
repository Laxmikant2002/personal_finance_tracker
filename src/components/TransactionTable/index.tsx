import { useState } from 'react';
import { Table, Input, Select, Button, Space } from 'antd';
import { Download, Upload, Trash2 } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import type { Transaction } from '../../types';
import type { ColumnsType } from 'antd/es/table';
import './styles.css';

const { Search } = Input;

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => Promise<void>;
  onImport: (transactions: Omit<Transaction, 'id' | 'userId' | 'createdAt'>[]) => Promise<void>;
}

function TransactionTable({ transactions, onDelete, onImport }: TransactionTableProps) {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await onDelete(id);
        toast.success('Transaction deleted successfully!');
      } catch {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const handleExportCSV = () => {
    const data = filteredData.map(t => ({
      Name: t.name,
      Amount: t.amount,
      Type: t.type,
      Category: t.category,
      Date: t.date
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success('Transactions exported successfully!');
  };

  const handleImportCSV = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        Papa.parse(file, {
          header: true,
          complete: async (results) => {
            try {
              interface CSVRow {
                Name?: string;
                Amount?: string;
                Type?: string;
                Category?: string;
                Date?: string;
              }

              const importedTransactions = (results.data as CSVRow[])
                .filter((row) => row.Name && row.Amount && row.Type && row.Category && row.Date)
                .map((row) => ({
                  name: row.Name!,
                  amount: parseFloat(row.Amount!),
                  type: row.Type!.toLowerCase() as 'income' | 'expense',
                  category: row.Category!,
                  date: row.Date!
                }));

              if (importedTransactions.length > 0) {
                await onImport(importedTransactions);
                toast.success(`Imported ${importedTransactions.length} transactions!`);
              } else {
                toast.error('No valid transactions found in CSV');
              }
            } catch (error) {
              console.error('Import error:', error);
              toast.error('Failed to import transactions');
            }
          },
          error: () => {
            toast.error('Failed to parse CSV file');
          }
        });
      }
    };
    input.click();
  };

  // Filter and search logic
  const filteredData = transactions.filter(transaction => {
    const matchesSearch = transaction.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number, record: Transaction) => (
        <span className={record.type === 'income' ? 'amount-income' : 'amount-expense'}>
          ${amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <span className={`type-badge ${type}`}>
          {type}
        </span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <button 
          className="delete-btn"
          onClick={() => handleDelete(record.id)}
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions yet. Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="transaction-table-container">
      <div className="table-header">
        <h3>Recent Transactions</h3>
        <Space>
          <Button 
            icon={<Upload size={18} />} 
            onClick={handleImportCSV}
            className="import-btn"
          >
            Import CSV
          </Button>
          <Button 
            icon={<Download size={18} />} 
            onClick={handleExportCSV}
            type="primary"
            className="export-btn"
          >
            Export CSV
          </Button>
        </Space>
      </div>

      <div className="table-filters">
        <Search
          placeholder="Search by name"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
        <Select
          value={filterType}
          onChange={setFilterType}
          style={{ width: 150 }}
          options={[
            { value: 'all', label: 'All Transactions' },
            { value: 'income', label: 'Income Only' },
            { value: 'expense', label: 'Expense Only' },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} transactions`,
        }}
        className="transaction-table"
      />
    </div>
  );
}

export default TransactionTable;

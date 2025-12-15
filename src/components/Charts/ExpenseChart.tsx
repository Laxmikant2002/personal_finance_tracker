import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './styles.css';

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface ExpenseChartProps {
  data: CategoryData[];
}

const COLORS = ['#4169e1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <div className="expense-chart-container">
      <h3 className="chart-title">Expense Breakdown</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => 
                `${entry.name}: ${entry.percent ? (entry.percent * 100).toFixed(0) : 0}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => value ? `$${Number(value).toFixed(2)}` : '$0.00'}
              contentStyle={{ 
                background: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="empty-chart">No expense data available</p>
      )}
    </div>
  );
}

export default ExpenseChart;

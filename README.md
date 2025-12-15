# 💰 Personal Finance Tracker

A modern, full-featured personal finance tracking application built with React, TypeScript, and Firebase.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)

## ✨ Features

- 🔐 **Secure Authentication** - Email/Password and Google Sign-in
- 💵 **Transaction Management** - Add, view, and delete income/expense transactions
- 📊 **Data Visualization** - Interactive charts showing financial trends
- � **Advanced Filtering** - Search by name, filter by type (all/income/expense)
- 📈 **Sortable Tables** - Sort transactions by name, amount, or date
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 📥 **CSV Export** - Download your transaction history
- 📤 **CSV Import** - Bulk import transactions from CSV files
- 🔄 **Real-time Updates** - Instant synchronization across devices
- 🎨 **Modern UI** - Clean, intuitive interface with Ant Design components

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Copy your Firebase config to `src/firebase.ts`

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📖 Complete Setup Guide

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed Firebase configuration, security rules, and deployment instructions.

## 🛠️ Technologies

- **Frontend**: React 19.2.0 + TypeScript + Vite
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **UI Components**: Ant Design (antd)
- **Charts**: Recharts
- **Routing**: React Router DOM
- **Notifications**: React Toastify
- **Icons**: Lucide React
- **CSV Processing**: PapaParse

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context (Auth)
├── pages/             # Page components  
├── types/             # TypeScript definitions
└── firebase.ts        # Firebase configuration
```

## 🎯 Key Features

### Dashboard
- Total Balance, Income, and Expense calculations
- Line chart for income vs expense trends
- Pie chart for expense breakdown by category
- **Advanced transaction table with:**
  - Search by transaction name
  - Filter by type (All/Income/Expense)
  - Sort by name, amount, or date
  - Pagination
- CSV export and import functionality

### Authentication
- Email/password signup and login
- Google OAuth integration
- Protected routes
- User-specific data isolation

## 🔒 Security

- Firebase Authentication
- Firestore security rules
- Protected routes
- User-specific queries

## 🚢 Deployment

```bash
npm run build
firebase deploy
```

---

**Start tracking your finances today!** 💰📈


```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

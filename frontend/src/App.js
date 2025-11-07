import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PlusCircle, Download, Search, Moon, Sun, Target, AlertCircle, Calendar, Filter, Edit2, Trash2, Eye, Bell, Settings, User, CreditCard, Zap, Award, TrendingDown as TrendDown, Activity, PieChart as PieIcon, BarChart3, Mail, Lock, ArrowRight, LogOut, EyeOff } from 'lucide-react';

// --- NEW UTILITY FUNCTION: RUPEE FORMATTING ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0, // Set to 2 if you want .00
    maximumFractionDigits: 0
  }).format(amount);
};
// --- END NEW UTILITY FUNCTION ---

// --- NEW COMPONENT: CURRENCY FORMAT ---
const CurrencyFormat = ({ amount, className }) => (
    <span className={className}>
        {formatCurrency(amount)}
    </span>
);
// --- END NEW COMPONENT: CURRENCY FORMAT ---

// --- NEW COMPONENT: GOAL ITEM ---
const GoalItem = ({ goal, theme, handleEdit, handleDelete }) => {
    const percentage = (goal.current / goal.target) * 100;
    const remaining = goal.target - goal.current;
    return (
        <div className="group p-4 border rounded-xl hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">{goal.emoji}</span>
                    <div>
                        <p className="font-semibold">{goal.name}</p>
                        <p className={`text-sm ${theme.textSecondary}`}>
                            <CurrencyFormat amount={goal.current} /> / <CurrencyFormat amount={goal.target} />
                        </p>
                        <p className="text-xs text-blue-600">
                            <CurrencyFormat amount={remaining} /> remaining • Deadline: {goal.deadline}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                     <span className="font-semibold text-blue-500">{percentage.toFixed(0)}%</span>
                     <button
                        onClick={() => handleEdit(goal)}
                        className="p-1 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Edit2 size={16} className="text-blue-500" />
                    </button>
                    <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} className="text-red-500" />
                    </button>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
            {percentage >= 100 && (
                <p className="text-sm mt-2 text-green-500 flex items-center">
                    <Award size={16} className="mr-1" />
                    Goal achieved! 🎉
                </p>
            )}
        </div>
    );
};
// --- END NEW COMPONENT: GOAL ITEM ---

// --- NEW COMPONENT: NOTIFICATION ITEM ---
const NotificationItem = ({ notif, theme }) => (
    <div
        key={notif.id}
        className={`p-3 rounded-lg ${notif.read ? theme.hover : 'bg-blue-50'} transition-all`}
    >
        <p className="text-sm">{notif.message}</p>
    </div>
);
// --- END NEW COMPONENT: NOTIFICATION ITEM ---


const App = () => {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  // --- END AUTHENTICATION STATE ---

  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false); // Transaction Modal
  
  // --- NEW GOAL STATE ---
  const [showGoalModal, setShowGoalModal] = useState(false); // Goal Modal
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalFormData, setGoalFormData] = useState({
    name: '',
    target: '',
    current: '',
    emoji: '🎯',
    deadline: new Date().toISOString().split('T')[0],
  });
  // --- END NEW GOAL STATE ---

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  
  // Mock Data
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 25.50, category: 'Food', description: 'Pizza Hut', date: '2025-11-02', emoji: '🍕' },
    { id: 2, type: 'income', amount: 3500, category: 'Salary', description: 'Monthly Salary', date: '2025-11-01', emoji: '💼' },
    { id: 3, type: 'expense', amount: 45, category: 'Transport', description: 'Gas Station', date: '2025-10-31', emoji: '⛽' },
    { id: 4, type: 'expense', amount: 120, category: 'Shopping', description: 'Clothes', date: '2025-10-30', emoji: '🛍️' },
    { id: 5, type: 'expense', amount: 1200, category: 'Rent', description: 'Monthly Rent', date: '2025-11-01', emoji: '🏠' },
    { id: 6, type: 'income', amount: 500, category: 'Freelance', description: 'Web Design Project', date: '2025-10-28', emoji: '💻' },
    { id: 7, type: 'expense', amount: 85, category: 'Food', description: 'Grocery Shopping', date: '2025-10-29', emoji: '🛒' },
    { id: 8, type: 'expense', amount: 60, category: 'Entertainment', description: 'Movie Tickets', date: '2025-10-27', emoji: '🎬' },
    { id: 9, type: 'income', amount: 200, category: 'Investment', description: 'Stock Dividends', date: '2025-10-26', emoji: '📈' },
  ]);

  const [budgets, setBudgets] = useState([
    { category: 'Food', limit: 1000, spent: 650, emoji: '🍕' },
    { category: 'Transport', limit: 500, spent: 460, emoji: '🚗' },
    { category: 'Shopping', limit: 400, spent: 320, emoji: '🛍️' },
    { category: 'Rent', limit: 1200, spent: 1200, emoji: '🏠' },
    { category: 'Entertainment', limit: 300, spent: 60, emoji: '🎮' },
  ]);

  const [goals, setGoals] = useState([
    { id: 101, name: 'Emergency Fund', target: 5000, current: 3240, emoji: '🎯', deadline: '2025-12-31' },
    { id: 102, name: 'Vacation', target: 2000, current: 850, emoji: '✈️', deadline: '2025-06-30' },
    { id: 103, name: 'New Laptop', target: 1500, current: 600, emoji: '💻', deadline: '2025-03-15' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Rent budget exceeded!', type: 'warning', read: false },
    { id: 2, message: 'Transport budget at 92%', type: 'info', read: false },
    { id: 3, message: 'New goal milestone reached!', type: 'success', read: true },
  ]);

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    notes: ''
  });

  const [converter, setConverter] = useState({
    from: 'USD',
    to: 'INR',
    amount: 100,
    rate: 83
  });

  const categories = {
    expense: [
      { name: 'Food', emoji: '🍕' },
      { name: 'Transport', emoji: '🚗' },
      { name: 'Shopping', emoji: '🛍️' },
      { name: 'Rent', emoji: '🏠' },
      { name: 'Bills', emoji: '💡' },
      { name: 'Entertainment', emoji: '🎮' },
      { name: 'Healthcare', emoji: '🏥' },
      { name: 'Education', emoji: '📚' },
    ],
    income: [
      { name: 'Salary', emoji: '💼' },
      { name: 'Freelance', emoji: '💻' },
      { name: 'Investment', emoji: '📈' },
      { name: 'Gift', emoji: '🎁' },
      { name: 'Bonus', emoji: '🎉' },
    ]
  };

  // --- AUTH HANDLERS (MOCKED) ---
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'signup') {
      if (authForm.password !== authForm.confirmPassword) {
        // In a real app, display an error message
        console.error('Passwords do not match!');
        return;
      }
      setCurrentUser({ name: authForm.name, email: authForm.email });
      setIsAuthenticated(true);
      setShowAuthModal(false);
    } else {
      // Simple mock login validation
      if (authForm.email && authForm.password) {
        setCurrentUser({ name: 'Demo User', email: authForm.email });
        setIsAuthenticated(true);
        setShowAuthModal(false);
      } else {
        console.error('Please enter email and password.');
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAuthModal(true);
    setCurrentUser(null);
    setAuthForm({ name: '', email: '', password: '', confirmPassword: '' });
  };
  // --- END AUTH HANDLERS ---
  
  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  const monthlyData = [
    { month: 'Jul', income: 3200, expense: 2800, savings: 400 },
    { month: 'Aug', income: 3500, expense: 3100, savings: 400 },
    { month: 'Sep', income: 3300, expense: 2900, savings: 400 },
    { month: 'Oct', income: 3800, expense: 3200, savings: 600 },
    { month: 'Nov', income: 4000, expense: 2600, savings: 1400 },
  ];

  const categoryTrends = [
    { category: 'Food', thisMonth: 650, lastMonth: 720 },
    { category: 'Transport', thisMonth: 460, lastMonth: 380 },
    { category: 'Shopping', thisMonth: 320, lastMonth: 450 },
    { category: 'Entertainment', thisMonth: 60, lastMonth: 180 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  // --- TRANSACTION HANDLERS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryObj = categories[formData.type].find(c => c.name === formData.category);
    
    if (selectedTransaction) {
      // Edit existing transaction
      setTransactions(transactions.map(t => 
        t.id === selectedTransaction.id 
          ? { ...t, ...formData, amount: parseFloat(formData.amount), emoji: categoryObj?.emoji || '💰' }
          : t
      ));
      setSelectedTransaction(null);
    } else {
      // Add new transaction
      const newTransaction = {
        id: Date.now(),
        ...formData,
        amount: parseFloat(formData.amount),
        emoji: categoryObj?.emoji || '💰'
      };
      setTransactions([newTransaction, ...transactions]);
    }
    
    setShowModal(false);
    setFormData({
      type: 'expense',
      amount: '',
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0],
      recurring: false,
      notes: ''
    });
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
      recurring: transaction.recurring || false,
      notes: transaction.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    } else {
        console.log("Transaction deletion cancelled.");
    }
  };
  // --- END TRANSACTION HANDLERS ---

  // --- GOAL HANDLERS ---
  const handleGoalSubmit = (e) => {
    e.preventDefault();
    
    const goalData = {
        ...goalFormData,
        target: parseFloat(goalFormData.target),
        current: parseFloat(goalFormData.current)
    };

    if (selectedGoal) {
        // Edit existing goal
        setGoals(goals.map(g => 
            g.id === selectedGoal.id 
              ? { ...g, ...goalData }
              : g
          ));
          setSelectedGoal(null);
    } else {
        // Add new goal
        const newGoal = {
            id: Date.now(),
            ...goalData,
        };
        setGoals([...goals, newGoal]);
    }
    
    setShowGoalModal(false);
    setGoalFormData({ name: '', target: '', current: '', emoji: '🎯', deadline: new Date().toISOString().split('T')[0] });
  };

  const handleGoalEdit = (goal) => {
    setSelectedGoal(goal);
    setGoalFormData({
        name: goal.name,
        target: goal.target,
        current: goal.current,
        emoji: goal.emoji,
        deadline: goal.deadline,
    });
    setShowGoalModal(true);
  };

  const handleGoalDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this financial goal?')) {
      setGoals(goals.filter(g => g.id !== id));
    } else {
        console.log("Goal deletion cancelled.");
    }
  };
  // --- END GOAL HANDLERS ---


  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const csvData = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.description,
      t.amount
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  };

  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
  };

  const StatCard = ({ icon: Icon, title, value, trend, color, subtitle }) => (
    <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border} transition-all hover:shadow-xl hover:scale-105 cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${theme.textSecondary} text-sm font-medium`}>{title}</p>
          {/* USES CurrencyFormat component for RUPEE DISPLAY */}
          <h3 className={`${theme.text} text-3xl font-bold mt-2`}>
            {typeof value === 'number' ? <CurrencyFormat amount={value} /> : value}
          </h3>
          {subtitle && <p className={`text-xs ${theme.textSecondary} mt-1`}>{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1">{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ icon: Icon, label, onClick, color }) => (
    <button
      onClick={onClick}
      className={`${theme.card} border ${theme.border} rounded-xl p-4 flex flex-col items-center space-y-2 transition-all hover:shadow-lg hover:scale-105`}
    >
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <span className={`text-sm font-medium ${theme.text}`}>{label}</span>
    </button>
  );

  // --- LOGIN/SIGNUP UI BLOCK ---
  if (!isAuthenticated && showAuthModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 font-sans">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl shadow-lg animate-bounce">
              <DollarSign size={40} className="text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">
            {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {authMode === 'login' ? 'Log in to manage your finances' : 'Sign up to start tracking your money'}
          </p>

          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                authMode === 'login'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                authMode === 'signup'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm({...authForm, confirmPassword: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {authMode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 rounded" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>{authMode === 'login' ? 'Log In (Demo)' : 'Create Account (Demo)'}</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="ml-2 text-blue-600 font-semibold hover:underline"
              >
                {authMode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all">
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // --- END LOGIN/SIGNUP UI BLOCK ---


  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${theme.card} border-b ${theme.border} sticky top-0 z-50 shadow-sm backdrop-blur-lg bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl animate-pulse">
                <DollarSign size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                  Finance Tracker
                </h1>
                <p className={`text-xs ${theme.textSecondary}`}>
                    Welcome, <span className="font-semibold">{currentUser?.name || 'Guest'}</span>!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-lg ${theme.hover} transition-colors relative`}
                >
                  <Bell size={20} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 ${theme.card} border ${theme.border} rounded-xl shadow-xl p-4 z-50`}>
                    <h3 className="font-bold mb-3">Notifications</h3>
                    <div className="space-y-2">
                      {/* USES NEW NotificationItem component */}
                      {notifications.map(notif => (
                        <NotificationItem key={notif.id} notif={notif} theme={theme} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${theme.hover} transition-colors`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {isAuthenticated && (
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-red-600 transition-all"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedTransaction(null);
                  setShowModal(true);
                }}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:shadow-lg transition-all hover:scale-105"
              >
                <PlusCircle size={20} />
                <span>Add Transaction</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`${theme.card} border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'transactions', label: 'Transactions', icon: CreditCard },
              { id: 'budgets', label: 'Budgets', icon: Target },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: PieIcon },
              { id: 'converter', label: 'Converter', icon: Zap },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-all flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-500'
                    : `border-transparent ${theme.textSecondary} ${theme.hover}`
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                icon={DollarSign}
                title="Total Balance"
                value={balance} // Value passed as number, formatted in StatCard
                trend={12}
                color="bg-gradient-to-r from-purple-500 to-pink-500"
                subtitle={`Savings Rate: ${savingsRate}%`}
              />
              <StatCard
                icon={TrendingUp}
                title="Total Income"
                value={totalIncome} // Value passed as number, formatted in StatCard
                trend={5}
                color="bg-gradient-to-r from-green-500 to-emerald-500"
                subtitle="This month"
              />
              <StatCard
                icon={TrendingDown}
                title="Total Expenses"
                value={totalExpense} // Value passed as number, formatted in StatCard
                trend={-8}
                color="bg-gradient-to-r from-red-500 to-orange-500"
                subtitle="This month"
              />
              <StatCard
                icon={Award}
                title="Goals Progress"
                value={`${goals.length}`}
                color="bg-gradient-to-r from-blue-500 to-cyan-500"
                subtitle="Active goals"
              />
            </div>

            {/* Quick Actions */}
            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickAction
                  icon={PlusCircle}
                  label="Add Income"
                  onClick={() => {
                    setFormData({...formData, type: 'income', category: 'Salary'});
                    setShowModal(true);
                  }}
                  color="bg-green-500"
                />
                <QuickAction
                  icon={TrendDown}
                  label="Add Expense"
                  onClick={() => {
                    setFormData({...formData, type: 'expense', category: 'Food'});
                    setShowModal(true);
                  }}
                  color="bg-red-500"
                />
                <QuickAction
                  icon={Download}
                  label="Export Data"
                  onClick={exportToCSV}
                  color="bg-blue-500"
                />
                {/* Updated Quick Action to open the Goal Modal */}
                <QuickAction
                  icon={Target}
                  label="Set Goal"
                  onClick={() => {
                    setSelectedGoal(null);
                    setGoalFormData({ name: '', target: '', current: '', emoji: '🎯', deadline: new Date().toISOString().split('T')[0] });
                    setShowGoalModal(true);
                  }}
                  color="bg-purple-500"
                />
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Area Chart */}
              <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-blue-500 text-sm hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 5).map(transaction => (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${theme.hover} transition-all hover:scale-102`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{transaction.emoji}</span>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className={`text-sm ${theme.textSecondary}`}>{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-4">
                      <div>
                         {/* USES CurrencyFormat component for RUPEE DISPLAY */}
                        <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          <CurrencyFormat amount={transaction.amount} className="inline-block" />
                        </p>
                        <p className={`text-sm ${theme.textSecondary}`}>{transaction.date}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transactions */}
        {activeTab === 'transactions' && (
          <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <h3 className="text-2xl font-bold">All Transactions</h3>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textSecondary}`} />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                >
                  <option value="all">All Types</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expense Only</option>
                </select>
                <button
                  onClick={exportToCSV}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                >
                  <Download size={18} />
                  <span>Export</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme.border}`}>
                    <th className={`text-left py-3 px-4 ${theme.textSecondary}`}>Date</th>
                    <th className={`text-left py-3 px-4 ${theme.textSecondary}`}>Description</th>
                    <th className={`text-left py-3 px-4 ${theme.textSecondary}`}>Category</th>
                    <th className={`text-right py-3 px-4 ${theme.textSecondary}`}>Amount</th>
                    <th className={`text-right py-3 px-4 ${theme.textSecondary}`}>Type</th>
                    <th className={`text-right py-3 px-4 ${theme.textSecondary}`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(transaction => (
                    <tr key={transaction.id} className={`border-b ${theme.border} ${theme.hover} transition-all`}>
                      <td className="py-3 px-4">{transaction.date}</td>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        <span>{transaction.emoji}</span>
                        <span>{transaction.description}</span>
                      </td>
                      <td className="py-3 px-4">{transaction.category}</td>
                      <td className={`py-3 px-4 text-right font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {/* USES CurrencyFormat component for RUPEE DISPLAY */}
                        <CurrencyFormat amount={transaction.amount} className="inline-block" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="text-blue-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <Eye size={48} className={`mx-auto ${theme.textSecondary} mb-4`} />
                <p className={theme.textSecondary}>No transactions found</p>
              </div>
            )}
          </div>
        )}

        {/* Budgets */}
        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
              <h3 className="text-2xl font-bold mb-6">Monthly Budgets</h3>
              <div className="space-y-6">
                {budgets.map((budget, index) => {
                  const percentage = (budget.spent / budget.limit) * 100;
                  const isWarning = percentage >= 80;
                  const isDanger = percentage >= 100;
                  const remaining = budget.limit - budget.spent;
                  return (
                    <div key={index} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{budget.emoji}</span>
                          <div>
                            <p className="font-semibold">{budget.category}</p>
                            <p className={`text-sm ${theme.textSecondary}`}>
                               {/* USES CurrencyFormat component for RUPEE DISPLAY */}
                              <CurrencyFormat amount={budget.spent} /> / <CurrencyFormat amount={budget.limit} />
                            </p>
                            <p className={`text-xs ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {/* USES CurrencyFormat component for RUPEE DISPLAY */}
                              {remaining > 0 ? <CurrencyFormat amount={remaining} /> + ' remaining' : <CurrencyFormat amount={Math.abs(remaining)} /> + ' over budget'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isWarning && (
                            <AlertCircle size={20} className={isDanger ? 'text-red-500 animate-pulse' : 'text-yellow-500'} />
                          )}
                          <span className={`font-semibold ${isDanger ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-green-500'}`}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isDanger ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      {isWarning && (
                        <p className={`text-sm mt-2 ${isDanger ? 'text-red-500' : 'text-yellow-500'}`}>
                          {isDanger ? '⚠️ Budget exceeded!' : '⚠️ Approaching budget limit'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Goals */}
            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Financial Goals</h3>
                <button
                    onClick={() => {
                        setSelectedGoal(null);
                        setGoalFormData({ name: '', target: '', current: '', emoji: '🎯', deadline: new Date().toISOString().split('T')[0] });
                        setShowGoalModal(true);
                    }}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-purple-600 transition-all"
                >
                    <PlusCircle size={18} />
                    <span>Add New Goal</span>
                </button>
              </div>

              <div className="space-y-6">
                 {/* USES NEW GoalItem component with edit/delete handlers */}
                {goals.map((goal) => (
                  <GoalItem 
                    key={goal.id} 
                    goal={goal} 
                    theme={theme} 
                    handleEdit={handleGoalEdit}
                    handleDelete={handleGoalDelete}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Financial Reports</h3>
                <div className="flex space-x-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors">
                    <Download size={18} />
                    <span>Export PDF</span>
                  </button>
                  <button 
                    onClick={exportToCSV}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600 transition-colors">
                    <Download size={18} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
                    }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="savings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                <h4 className={`${theme.textSecondary} text-sm font-medium mb-2`}>Average Monthly Income</h4>
                 {/* USES CurrencyFormat component for RUPEE DISPLAY */}
                <p className="text-3xl font-bold text-green-500">
                  <CurrencyFormat amount={(monthlyData.reduce((sum, m) => sum + m.income, 0) / monthlyData.length)} />
                </p>
                <p className="text-xs text-green-600 mt-1">↑ 5% from last period</p>
              </div>
              <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                <h4 className={`${theme.textSecondary} text-sm font-medium mb-2`}>Average Monthly Expense</h4>
                 {/* USES CurrencyFormat component for RUPEE DISPLAY */}
                <p className="text-3xl font-bold text-red-500">
                  <CurrencyFormat amount={(monthlyData.reduce((sum, m) => sum + m.expense, 0) / monthlyData.length)} />
                </p>
                <p className="text-xs text-red-600 mt-1">↓ 8% from last period</p>
              </div>
              <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                <h4 className={`${theme.textSecondary} text-sm font-medium mb-2`}>Average Monthly Savings</h4>
                 {/* USES CurrencyFormat component for RUPEE DISPLAY */}
                <p className="text-3xl font-bold text-blue-500">
                   <CurrencyFormat amount={(monthlyData.reduce((sum, m) => sum + m.savings, 0) / monthlyData.length)} />
                </p>
                <p className="text-xs text-blue-600 mt-1">↑ 12% from last period</p>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Comparison */}
              <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                <h3 className="text-lg font-semibold mb-4">Category Trends (This vs Last Month)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="category" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="lastMonth" fill="#94a3b8" name="Last Month" />
                    <Bar dataKey="thisMonth" fill="#3b82f6" name="This Month" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart */}
              <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                <h3 className="text-lg font-semibold mb-4">Spending Pattern Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={categoryTrends}>
                    <PolarGrid stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <PolarAngleAxis dataKey="category" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <PolarRadiusAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <Radar name="This Month" dataKey="thisMonth" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Radar name="Last Month" dataKey="lastMonth" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insights */}
            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
              <h3 className="text-lg font-semibold mb-4">💡 Smart Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium text-green-800">Great Progress!</p>
                  <p className="text-sm text-green-600 mt-1">Your savings increased by 12% this month</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-blue-800">Top Category</p>
                  <p className="text-sm text-blue-600 mt-1">Most spending in: Rent (<CurrencyFormat amount={1200} />)</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-medium text-yellow-800">Watch Out</p>
                  <p className="text-sm text-yellow-600 mt-1">Transport spending up 21% from last month</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="font-medium text-purple-800">Goal Alert</p>
                  <p className="text-sm text-purple-600 mt-1">You're 64% towards your Emergency Fund goal!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Currency Converter */}
        {activeTab === 'converter' && (
          <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border} max-w-2xl mx-auto`}>
            <h3 className="text-2xl font-bold mb-6">💱 Currency Converter</h3>
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>From Currency</label>
                <select
                  value={converter.from}
                  onChange={(e) => setConverter({...converter, from: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>INR</option>
                  <option>JPY</option>
                  <option>CAD</option>
                  <option>AUD</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Amount</label>
                <input
                  type="number"
                  value={converter.amount}
                  onChange={(e) => setConverter({...converter, amount: parseFloat(e.target.value) || 0})}
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none text-2xl font-bold`}
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex justify-center">
                <button 
                  onClick={() => setConverter({...converter, from: converter.to, to: converter.from})}
                  className={`p-3 rounded-full ${theme.hover} transition-all hover:scale-110`}
                >
                  <span className="text-2xl">⇅</span>
                </button>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>To Currency</label>
                <select
                  value={converter.to}
                  onChange={(e) => setConverter({...converter, to: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                >
                  <option>INR</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>JPY</option>
                  <option>CAD</option>
                  <option>AUD</option>
                </select>
              </div>
              <div className={`p-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl`}>
                <p className="text-sm opacity-90 mb-2">Converted Amount</p>
                <p className="text-5xl font-bold">
                  {converter.to === 'INR' ? '₹' : converter.to === 'USD' ? '$' : '€'}
                  {(converter.amount * converter.rate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
                <p className="text-sm opacity-75 mt-3">
                  1 {converter.from} = {converter.rate} {converter.to}
                </p>
                <p className="text-xs opacity-60 mt-1">Last updated: 2 minutes ago</p>
              </div>
              
              {/* Popular Conversions */}
              <div className={`p-4 rounded-lg ${theme.hover}`}>
                <h4 className="font-semibold mb-3">Popular Conversions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-sm">
                    <p className={theme.textSecondary}>USD → INR</p>
                    <p className="font-medium">1 USD = 83.00 INR</p>
                  </div>
                  <div className="text-sm">
                    <p className={theme.textSecondary}>EUR → USD</p>
                    <p className="font-medium">1 EUR = 1.08 USD</p>
                  </div>
                  <div className="text-sm">
                    <p className={theme.textSecondary}>GBP → USD</p>
                    <p className="font-medium">1 GBP = 1.26 USD</p>
                  </div>
                  <div className="text-sm">
                    <p className={theme.textSecondary}>JPY → USD</p>
                    <p className="font-medium">1 JPY = 0.0067 USD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* NEW TAB: Settings */}
        {activeTab === 'settings' && (
          <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border} max-w-2xl mx-auto space-y-6`}>
            <h3 className="text-2xl font-bold mb-6">⚙️ Settings</h3>
            
            <div className="space-y-4 border-b pb-4 border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold">Appearance</h4>
                <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className='flex items-center space-x-2'>
                        {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-400" />}
                        <p className="font-medium">Dark Mode</p>
                    </div>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                        role="switch"
                        aria-checked={darkMode}
                    >
                        <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                </div>
            </div>

            <div className="space-y-4 border-b pb-4 border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-semibold">Financial</h4>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Base Currency (Currently ₹)</label>
                    <select
                        value={'INR'} // Mocked to INR as we changed the whole app to INR
                        onChange={(e) => console.log('Currency change handler triggered:', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                        disabled // Disabled as this is a mock feature
                    >
                        <option value="INR">₹ Indian Rupee (INR)</option>
                        <option value="USD">$ US Dollar (USD)</option>
                        <option value="EUR">€ Euro (EUR)</option>
                    </select>
                    <p className='text-xs text-blue-500 mt-2'>*Currency is currently locked to INR (Rupees) for display across the application.</p>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-lg font-semibold">Account</h4>
                <button 
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-red-700 transition-all"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className={`${theme.card} rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all`}>
            <h3 className="text-2xl font-bold mb-6">
              {selectedTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Type</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'expense', category: 'Food'})}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      formData.type === 'expense'
                        ? 'bg-red-500 text-white shadow-lg scale-105'
                        : `${theme.hover} ${theme.text}`
                    }`}
                  >
                    💸 Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'income', category: 'Salary'})}
                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                      formData.type === 'income'
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : `${theme.hover} ${theme.text}`
                    }`}
                  >
                    💰 Income
                  </button>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Amount</label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme.textSecondary} text-xl`}>₹</span> {/* Changed to ₹ */}
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none text-xl font-bold`}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                >
                  {categories[formData.type].map(cat => (
                    <option key={cat.name} value={cat.name}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none resize-none`}
                  rows="3"
                  placeholder="Add any additional notes..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e) => setFormData({...formData, recurring: e.target.checked})}
                  className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="text-sm">Recurring transaction</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedTransaction(null);
                    setFormData({
                      type: 'expense',
                      amount: '',
                      category: 'Food',
                      description: '',
                      date: new Date().toISOString().split('T')[0],
                      recurring: false,
                      notes: ''
                    });
                  }}
                  className={`flex-1 py-3 rounded-lg font-medium ${theme.hover} transition-all`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg font-medium bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg transition-all hover:scale-105"
                >
                  {selectedTransaction ? 'Update Transaction' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW: Add/Edit Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className={`${theme.card} rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all`}>
            <h3 className="text-2xl font-bold mb-6 text-purple-500">
              {selectedGoal ? 'Edit Financial Goal' : 'Set New Financial Goal'}
            </h3>
            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Goal Name</label>
                <input
                  type="text"
                  required
                  value={goalFormData.name}
                  onChange={(e) => setGoalFormData({...goalFormData, name: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Target Amount (₹)</label>
                <input
                  type="number"
                  step="100"
                  required
                  value={goalFormData.target}
                  onChange={(e) => setGoalFormData({...goalFormData, target: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="50000"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Current Saved Amount (₹)</label>
                <input
                  type="number"
                  step="100"
                  required
                  value={goalFormData.current}
                  onChange={(e) => setGoalFormData({...goalFormData, current: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                  placeholder="0"
                />
              </div>
               <div>
                <label className={`block text-sm font-medium mb-2 ${theme.textSecondary}`}>Deadline</label>
                <input
                  type="date"
                  required
                  value={goalFormData.deadline}
                  onChange={(e) => setGoalFormData({...goalFormData, deadline: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${theme.border} ${theme.bg} focus:ring-2 focus:ring-blue-500 outline-none`}
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowGoalModal(false);
                    setSelectedGoal(null);
                    setGoalFormData({ name: '', target: '', current: '', emoji: '🎯', deadline: new Date().toISOString().split('T')[0] });
                  }}
                  className={`flex-1 py-3 rounded-lg font-medium ${theme.hover} transition-all`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all hover:scale-105"
                >
                  {selectedGoal ? 'Update Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
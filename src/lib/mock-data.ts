import type { Category, Expense, BudgetGoal } from './types';
import { Home, Utensils, Car, ShoppingCart, Film, Shirt, HeartPulse, Plane, BookOpen, Gift } from 'lucide-react';

// Using HSL colors from the theme for consistency
const colors = {
  teal: 'hsl(var(--chart-1))',
  green: 'hsl(var(--chart-2))',
  blue: 'hsl(var(--chart-3))',
  orange: 'hsl(var(--chart-4))',
  purple: 'hsl(var(--chart-5))',
  red: 'hsl(var(--destructive))',
  yellow: 'hsl(48, 96%, 51%)', // Example yellow
  pink: 'hsl(330, 76%, 61%)', // Example pink
};

// Use 'let' instead of 'const' to allow modification in the mock service
export let mockCategories: Category[] = [
  { id: 'cat1', name: 'Housing', icon: Home, color: colors.blue },
  { id: 'cat2', name: 'Food & Dining', icon: Utensils, color: colors.orange },
  { id: 'cat3', name: 'Transportation', icon: Car, color: colors.purple },
  { id: 'cat4', name: 'Groceries', icon: ShoppingCart, color: colors.green },
  { id: 'cat5', name: 'Entertainment', icon: Film, color: colors.pink },
  { id: 'cat6', name: 'Clothing', icon: Shirt, color: colors.teal },
  { id: 'cat7', name: 'Health & Wellness', icon: HeartPulse, color: colors.red },
  { id: 'cat8', name: 'Travel', icon: Plane, color: colors.yellow },
  { id: 'cat9', name: 'Education', icon: BookOpen, color: 'hsl(260, 50%, 60%)' },
  { id: 'cat10', name: 'Gifts & Donations', icon: Gift, color: 'hsl(0, 0%, 50%)' },
];

export let mockExpenses: Expense[] = [
  // Housing
  { id: 'exp1', description: 'Rent Payment', amount: 1200, categoryId: 'cat1', date: new Date(2024, 5, 1) },
  { id: 'exp2', description: 'Electricity Bill', amount: 75, categoryId: 'cat1', date: new Date(2024, 5, 15) },
  // Food & Dining
  { id: 'exp3', description: 'Dinner Out', amount: 60, categoryId: 'cat2', date: new Date(2024, 5, 5) },
  { id: 'exp4', description: 'Lunch Meeting', amount: 35, categoryId: 'cat2', date: new Date(2024, 5, 12) },
  { id: 'exp5', description: 'Coffee Shop', amount: 15, categoryId: 'cat2', date: new Date(2024, 5, 20) },
  // Transportation
  { id: 'exp6', description: 'Gas Fill-up', amount: 50, categoryId: 'cat3', date: new Date(2024, 5, 8) },
  { id: 'exp7', description: 'Bus Fare', amount: 20, categoryId: 'cat3', date: new Date(2024, 5, 18) },
  // Groceries
  { id: 'exp8', description: 'Weekly Groceries', amount: 150, categoryId: 'cat4', date: new Date(2024, 5, 3) },
  { id: 'exp9', description: 'Snacks', amount: 25, categoryId: 'cat4', date: new Date(2024, 5, 10) },
  { id: 'exp10', description: 'Bulk Buy', amount: 200, categoryId: 'cat4', date: new Date(2024, 5, 25) },
   // Entertainment
  { id: 'exp11', description: 'Movie Tickets', amount: 30, categoryId: 'cat5', date: new Date(2024, 5, 7) },
  { id: 'exp12', description: 'Concert', amount: 100, categoryId: 'cat5', date: new Date(2024, 5, 22) },
  // Clothing
  { id: 'exp13', description: 'New Shirt', amount: 45, categoryId: 'cat6', date: new Date(2024, 5, 14) },
  // Health & Wellness
  { id: 'exp14', description: 'Gym Membership', amount: 40, categoryId: 'cat7', date: new Date(2024, 5, 1) },
  { id: 'exp15', description: 'Pharmacy', amount: 20, categoryId: 'cat7', date: new Date(2024, 5, 19) },
   // Travel
   { id: 'exp16', description: 'Flight Booking', amount: 350, categoryId: 'cat8', date: new Date(2024, 5, 11) },
   // Education
   { id: 'exp17', description: 'Online Course', amount: 99, categoryId: 'cat9', date: new Date(2024, 5, 6) },
   // Gifts
   { id: 'exp18', description: 'Birthday Gift', amount: 50, categoryId: 'cat10', date: new Date(2024, 5, 28) },
];

export let mockBudgetGoals: BudgetGoal[] = [
  { id: 'goal1', categoryId: 'cat1', limit: 1300, startDate: new Date(2024, 5, 1), endDate: new Date(2024, 5, 30) },
  { id: 'goal2', categoryId: 'cat2', limit: 300, startDate: new Date(2024, 5, 1), endDate: new Date(2024, 5, 30) },
  { id: 'goal3', categoryId: 'cat3', limit: 150, startDate: new Date(2024, 5, 1), endDate: new Date(2024, 5, 30) },
  { id: 'goal4', categoryId: 'cat4', limit: 400, startDate: new Date(2024, 5, 1), endDate: new Date(2024, 5, 30) },
  { id: 'goal5', categoryId: 'cat5', limit: 150, startDate: new Date(2024, 5, 1), endDate: new Date(2024, 5, 30) },
  { id: 'goal6', categoryId: 'cat6', limit: 100, startDate: new Date(2024, 5, 1), endDate: new Date(2024, 5, 30) },
  { id: 'goal7', categoryId: 'cat7', limit: 100, startDate: new Date(2024, 5, 1), endDate: new Date(2024, 5, 30) },
];

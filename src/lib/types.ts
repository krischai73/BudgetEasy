import type { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>; // Allow Lucide or custom SVG
  color: string; // Color for identification, e.g., in charts
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  date: Date;
}

export interface BudgetGoal {
  id: string;
  categoryId: string;
  limit: number;
  startDate: Date;
  endDate: Date;
}

export interface SpendingByCategory {
  categoryId: string;
  name: string;
  totalSpending: number;
  color: string;
  budgetLimit?: number;
}

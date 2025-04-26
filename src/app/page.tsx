'use client';

import * as React from 'react';
import { CategoryList } from '@/components/dashboard/category-list';
import { SpendingPieChart } from '@/components/dashboard/spending-pie-chart';
import { BudgetProgressBars } from '@/components/dashboard/budget-progress-bars';
import { AddExpenseForm } from '@/components/dashboard/add-expense-form';
import { ExpenseList } from '@/components/dashboard/expense-list';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    getCategories,
    getExpenses,
    getBudgetGoals,
    getSpendingByCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    addExpense,
    updateExpense,
    deleteExpense,
    updateBudgetGoal,
} from '@/lib/data-service';
import type { Category, Expense, BudgetGoal, SpendingByCategory } from '@/lib/types';
import { PiggyBank, DollarSign } from 'lucide-react';


export default function BudgetEasyDashboard() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [budgetGoals, setBudgetGoals] = React.useState<BudgetGoal[]>([]);
  const [spendingByCategory, setSpendingByCategory] = React.useState<SpendingByCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        // Fetch all data concurrently
        const [
            categoriesData,
            expensesData,
            budgetGoalsData,
            spendingData
        ] = await Promise.all([
            getCategories(),
            getExpenses(),
            getBudgetGoals(),
            getSpendingByCategory()
        ]);
        setCategories(categoriesData);
        // Convert date strings to Date objects if necessary (depends on data source)
        setExpenses(expensesData.map(e => ({...e, date: new Date(e.date)})));
        setBudgetGoals(budgetGoalsData.map(g => ({
            ...g,
            startDate: new Date(g.startDate),
            endDate: new Date(g.endDate),
        })));
        setSpendingByCategory(spendingData);
    } catch (err) {
        console.error("Failed to fetch budget data:", err);
        setError("Failed to load dashboard data. Please try again later.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Mutation Handlers ---
   const handleAddCategory = async (newCategoryData: Omit<Category, 'id'>) => {
        try {
            await addCategory(newCategoryData);
            fetchData(); // Re-fetch data to update the UI
        } catch (error) {
            console.error("Failed to add category:", error);
             // Handle error (e.g., show toast)
        }
    };

    const handleUpdateCategory = async (updatedCategoryData: Category) => {
        try {
            await updateCategory(updatedCategoryData);
            fetchData();
        } catch (error) {
            console.error("Failed to update category:", error);
             // Handle error
        }
    };

     const handleDeleteCategory = async (categoryId: string) => {
        try {
            await deleteCategory(categoryId);
            fetchData();
        } catch (error) {
            console.error("Failed to delete category:", error);
             // Handle error
        }
    };

   const handleAddExpense = async (newExpenseData: Omit<Expense, 'id'>) => {
        try {
            await addExpense(newExpenseData);
            fetchData(); // Re-fetch all data after adding expense
        } catch (error) {
            console.error("Failed to add expense:", error);
             // Handle error (e.g., show toast)
        }
    };

     const handleUpdateExpense = async (updatedExpenseData: Expense) => {
        try {
            await updateExpense(updatedExpenseData);
            fetchData();
        } catch (error) {
            console.error("Failed to update expense:", error);
            // Handle error
        }
    };

    const handleDeleteExpense = async (expenseId: string) => {
        try {
            await deleteExpense(expenseId);
            fetchData();
        } catch (error) {
            console.error("Failed to delete expense:", error);
            // Handle error
        }
    };

     const handleUpdateBudgetGoal = async (updatedGoalData: BudgetGoal) => {
        try {
            await updateBudgetGoal(updatedGoalData);
            fetchData();
        } catch (error) {
            console.error("Failed to update budget goal:", error);
             // Handle error
        }
    };


  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <PiggyBank className="h-8 w-8" /> BudgetEasy Dashboard
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
             <Card><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
          </div>
          {/* Right Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-80 w-full" /></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

   // --- Error State ---
    if (error) {
        return (
        <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold text-primary mb-4 flex items-center gap-2">
                <PiggyBank className="h-8 w-8" /> BudgetEasy
            </h1>
            <Card className="w-full max-w-md bg-destructive/10 border-destructive">
            <CardHeader className="items-center">
                <CardTitle className="text-destructive flex items-center gap-2"><DollarSign className="h-5 w-5"/> Error</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-destructive/90">
                <p>{error}</p>
            </CardContent>
            </Card>
        </div>
        );
    }


  // --- Loaded State ---
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-4 md:mb-0 flex items-center gap-2">
             <PiggyBank className="h-8 w-8" /> BudgetEasy Dashboard
        </h1>
         {/* Potential place for user profile/settings button */}
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Add Expense, Categories, Budgets */}
        <div className="lg:col-span-1 space-y-6">
          <AddExpenseForm categories={categories} onAddExpense={handleAddExpense} />
          <CategoryList
            categories={categories}
            budgetGoals={budgetGoals}
            expenses={expenses}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onUpdateBudgetGoal={handleUpdateBudgetGoal}
            />
          <BudgetProgressBars data={spendingByCategory} />
        </div>

        {/* Right Column: Charts, Expense List */}
        <div className="lg:col-span-2 space-y-6">
           <Card>
             <CardHeader>
                <CardTitle>Spending Overview</CardTitle>
                 <CardDescription>Spending distribution across categories.</CardDescription>
             </CardHeader>
             <CardContent>
                 <SpendingPieChart data={spendingByCategory} />
             </CardContent>
           </Card>

           <ExpenseList
                expenses={expenses}
                categories={categories}
                onUpdateExpense={handleUpdateExpense}
                onDeleteExpense={handleDeleteExpense}
            />

        </div>
      </main>
    </div>
  );
}



import type { Category, Expense, BudgetGoal, SpendingByCategory } from './types';
import { mockCategories, mockExpenses, mockBudgetGoals } from './mock-data';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCategories(): Promise<Category[]> {
  await delay(50); // Simulate network latency
   // Return a copy to prevent direct modification of the original mock array by consumers if needed elsewhere
  return [...mockCategories];
}

export async function getExpenses(): Promise<Expense[]> {
  await delay(50);
  return [...mockExpenses];
}

export async function getBudgetGoals(): Promise<BudgetGoal[]> {
    await delay(50);
    // Create a map for quick lookup of existing goals
    const goalsMap = new Map(mockBudgetGoals.map(goal => [goal.categoryId, goal]));
    // Ensure all categories have a goal object, even if empty initially
    const allGoals = mockCategories.map(cat => {
        const existingGoal = goalsMap.get(cat.id);
        return existingGoal || {
            id: `goal-${cat.id}`, // Generate a consistent ID if no goal exists
            categoryId: cat.id,
            limit: 0, // Default limit to 0
            startDate: new Date(), // Sensible defaults
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) // End of current month
        };
    });
    // Update the main mockBudgetGoals array with any newly created default goals
    allGoals.forEach(goal => {
        if (!goalsMap.has(goal.categoryId)) {
            mockBudgetGoals.push(goal);
        }
    });
    return [...mockBudgetGoals]; // Return a copy
}

export async function getSpendingByCategory(): Promise<SpendingByCategory[]> {
  await delay(100);
  // Fetch current state of data (important as it might have been modified)
  const currentCategories = mockCategories;
  const currentExpenses = mockExpenses;
  const currentBudgetGoals = mockBudgetGoals;


  const categoryMap = new Map(currentCategories.map(cat => [cat.id, cat]));
  const goalMap = new Map(currentBudgetGoals.map(goal => [goal.categoryId, goal]));

  const spendingMap = new Map<string, number>();

  for (const expense of currentExpenses) {
    const currentTotal = spendingMap.get(expense.categoryId) || 0;
    spendingMap.set(expense.categoryId, currentTotal + expense.amount);
  }

  const spendingData: SpendingByCategory[] = currentCategories.map(category => {
    const totalSpending = spendingMap.get(category.id) || 0;
    const budgetGoal = goalMap.get(category.id);
    return {
      categoryId: category.id,
      name: category.name,
      totalSpending: totalSpending,
      color: category.color,
      budgetLimit: budgetGoal?.limit,
    };
  });

  return spendingData;
}

// --- Mock Mutations (Simulate adding/updating/deleting data) ---

export async function addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    await delay(100);
    const newCategory: Category = { ...category, id: `cat-${Date.now()}-${mockCategories.length}` }; // More unique ID
    mockCategories.push(newCategory);
    // Add a default budget goal for the new category if one doesn't exist
    if (!mockBudgetGoals.some(g => g.categoryId === newCategory.id)) {
        mockBudgetGoals.push({
            id: `goal-${newCategory.id}`,
            categoryId: newCategory.id,
            limit: 0, // Default limit
            startDate: new Date(),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        });
    }
    console.log('Added category:', newCategory);
    return { ...newCategory }; // Return a copy
}

export async function updateCategory(category: Category): Promise<Category> {
    await delay(100);
    const index = mockCategories.findIndex(c => c.id === category.id);
    if (index > -1) {
        mockCategories[index] = { ...mockCategories[index], ...category }; // Merge updates
        console.log('Updated category:', mockCategories[index]);
        return { ...mockCategories[index] }; // Return a copy
    }
    throw new Error('Category not found');
}

export async function deleteCategory(categoryId: string): Promise<void> {
    await delay(100);
    const index = mockCategories.findIndex(c => c.id === categoryId);
    if (index > -1) {
        const deletedCategory = mockCategories.splice(index, 1)[0];
        // Also remove associated budget goals
        const goalIndex = mockBudgetGoals.findIndex(g => g.categoryId === categoryId);
        if (goalIndex > -1) mockBudgetGoals.splice(goalIndex, 1);

        // Filter out expenses associated with the deleted category
        // Modify mockExpenses in place to avoid reassignment error
        let i = mockExpenses.length;
        while (i--) {
            if (mockExpenses[i].categoryId === categoryId) {
                mockExpenses.splice(i, 1);
            }
        }

        console.log('Deleted category:', deletedCategory.name);
    } else {
        throw new Error('Category not found');
    }
}


export async function addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  await delay(100);
  const newExpense: Expense = { ...expense, id: `exp-${Date.now()}-${mockExpenses.length}` }; // More unique ID
  mockExpenses.push(newExpense);
  console.log('Added expense:', newExpense);
  return { ...newExpense }; // Return a copy
}

export async function updateExpense(expense: Expense): Promise<Expense> {
  await delay(100);
  const index = mockExpenses.findIndex(e => e.id === expense.id);
  if (index > -1) {
    mockExpenses[index] = { ...mockExpenses[index], ...expense }; // Merge updates
     console.log('Updated expense:', mockExpenses[index]);
    return { ...mockExpenses[index] }; // Return a copy
  }
  throw new Error('Expense not found');
}

export async function deleteExpense(expenseId: string): Promise<void> {
  await delay(100);
  const index = mockExpenses.findIndex(e => e.id === expenseId);
  if (index > -1) {
    const deletedExpense = mockExpenses.splice(index, 1)[0];
     console.log('Deleted expense:', deletedExpense.description);
  } else {
    throw new Error('Expense not found');
  }
}

export async function updateBudgetGoal(goal: BudgetGoal): Promise<BudgetGoal> {
    await delay(100);
    const index = mockBudgetGoals.findIndex(g => g.id === goal.id || g.categoryId === goal.categoryId);
    if (index > -1) {
        // Ensure limit is treated as a number
        const limit = typeof goal.limit === 'string' ? parseFloat(goal.limit) : goal.limit;
        mockBudgetGoals[index] = {
             ...mockBudgetGoals[index],
             ...goal,
             limit: isNaN(limit) ? 0 : limit // Update with validated limit
        };
        console.log('Updated budget goal:', mockBudgetGoals[index]);
        return { ...mockBudgetGoals[index] }; // Return a copy
    } else {
         // If no goal exists for the categoryId, create a new one
         const limit = typeof goal.limit === 'string' ? parseFloat(goal.limit) : goal.limit;
         const newGoal = {
             ...goal,
             id: goal.id || `goal-${goal.categoryId}`, // Ensure ID exists
             limit: isNaN(limit) ? 0 : limit // Set validated limit
         };
         mockBudgetGoals.push(newGoal);
         console.log('Added budget goal:', newGoal);
         return { ...newGoal }; // Return a copy
    }
}

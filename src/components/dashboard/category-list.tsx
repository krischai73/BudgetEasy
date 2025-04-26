
"use client";

import * as React from 'react';
import type { Category, BudgetGoal, Expense } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, PlusCircle, AlertCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CategoryListProps {
  categories: Category[];
  budgetGoals: BudgetGoal[];
  expenses: Expense[];
  onAddCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  onUpdateCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onUpdateBudgetGoal: (goal: BudgetGoal) => Promise<void>;
}

// Placeholder for icon selection - replace with a real icon picker later
const AvailableIcons = [Trash2, Edit, PlusCircle, AlertCircle]; // Example icons

export function CategoryList({
    categories,
    budgetGoals,
    expenses,
    onAddCategory,
    onUpdateCategory,
    onDeleteCategory,
    onUpdateBudgetGoal
}: CategoryListProps) {
  const [isAddModalOpen, setAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setEditModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [editingBudgetGoal, setEditingBudgetGoal] = React.useState<BudgetGoal | null>(null);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [newCategoryIcon, setNewCategoryIcon] = React.useState<Category['icon']>(PlusCircle); // Default icon
  const [newCategoryColor, setNewCategoryColor] = React.useState('#cccccc'); // Default color
  const [editCategoryName, setEditCategoryName] = React.useState('');
  const [editCategoryIcon, setEditCategoryIcon] = React.useState<Category['icon']>(PlusCircle);
  const [editCategoryColor, setEditCategoryColor] = React.useState('#cccccc');
  const [editBudgetLimit, setEditBudgetLimit] = React.useState<number | string>('');

  const budgetGoalMap = React.useMemo(() => {
    return new Map(budgetGoals.map(goal => [goal.categoryId, goal]));
  }, [budgetGoals]);

   const getExpenseCountForCategory = (categoryId: string) => {
    return expenses.filter(expense => expense.categoryId === categoryId).length;
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      await onAddCategory({ name: newCategoryName, icon: newCategoryIcon, color: newCategoryColor });
      setNewCategoryName('');
      setNewCategoryIcon(PlusCircle);
      setNewCategoryColor('#cccccc');
      setAddModalOpen(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setEditCategoryIcon(category.icon);
    setEditCategoryColor(category.color);
    const goal = budgetGoalMap.get(category.id);
    setEditingBudgetGoal(goal || null); // Handle case where goal might not exist yet
    setEditBudgetLimit(goal?.limit ?? '');
    setEditModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (editingCategory && editCategoryName.trim()) {
        const updatedCategory = {
            ...editingCategory,
            name: editCategoryName,
            icon: editCategoryIcon,
            color: editCategoryColor
        };
        await onUpdateCategory(updatedCategory);

        // Update or create budget goal
        const limit = parseFloat(editBudgetLimit.toString()); // Ensure it's a number
        const currentGoal = budgetGoalMap.get(editingCategory.id);
        const updatedGoal: BudgetGoal = {
            id: currentGoal?.id || `goal-${editingCategory.id}`, // Use existing ID or generate one
            categoryId: editingCategory.id,
            limit: isNaN(limit) ? 0 : limit, // Default to 0 if invalid
            // Keep existing dates or set defaults if creating new
            startDate: currentGoal?.startDate || new Date(),
            endDate: currentGoal?.endDate || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        };
        await onUpdateBudgetGoal(updatedGoal);

        setEditingCategory(null);
        setEditingBudgetGoal(null);
        setEditModalOpen(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await onDeleteCategory(categoryId);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your spending categories and budgets.</CardDescription>
        </div>
         <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new category for tracking expenses.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="col-span-3" placeholder="e.g., Groceries" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="color" className="text-right">Color</Label>
                    <Input id="color" type="color" value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} className="col-span-1 h-8 w-14 p-1" />
                    {/* Icon selection placeholder */}
                     <Label htmlFor="icon" className="text-right col-span-1">Icon</Label>
                     <div className="col-span-1">
                        <Button variant="outline" size="icon" disabled> {/* Disabled for now */}
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                     </div>
                </div>
                </div>
                <DialogFooter>
                <Button onClick={handleAddCategory}>Add Category</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {categories.map((category) => {
             const IconComponent = category.icon;
             const goalLimit = budgetGoalMap.get(category.id)?.limit;
             const expenseCount = getExpenseCountForCategory(category.id);

             return (
            <li key={category.id} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50">
                <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-full" style={{ backgroundColor: `${category.color}33` }}> {/* Use color with alpha */}
                        <IconComponent className="h-5 w-5" style={{ color: category.color }} />
                    </span>
                    <div className="flex flex-col">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-xs text-muted-foreground">
                            Budget: {goalLimit && goalLimit > 0 ? `$${goalLimit.toFixed(2)}` : 'Not set'}
                        </span>
                    </div>

                </div>

                <div className="flex items-center gap-2">
                   <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleEditClick(category)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit {category.name}</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit Category & Budget</p>
                        </TooltipContent>
                    </Tooltip>

                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete {category.name}</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the category "{category.name}"
                                {expenseCount > 0 && ` and its ${expenseCount} associated expense(s)`}.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                   </TooltipProvider>
                </div>

            </li>
          )})}
        </ul>

         {/* Edit Dialog */}
        <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Edit Category: {editingCategory?.name}</DialogTitle>
                <DialogDescription>Update the category details and budget limit.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-name" className="text-right">Name</Label>
                        <Input id="edit-name" value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-color" className="text-right">Color</Label>
                        <Input id="edit-color" type="color" value={editCategoryColor} onChange={(e) => setEditCategoryColor(e.target.value)} className="col-span-1 h-8 w-14 p-1" />
                       {/* Icon selection placeholder */}
                        <Label htmlFor="edit-icon" className="text-right col-span-1">Icon</Label>
                         <div className="col-span-1">
                            <Button variant="outline" size="icon" disabled> {/* Disabled for now */}
                                {React.createElement(editCategoryIcon, { className: "h-4 w-4" })}
                            </Button>
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-budget" className="text-right">Budget Limit</Label>
                        <Input
                            id="edit-budget"
                            type="number"
                            value={editBudgetLimit}
                            onChange={(e) => setEditBudgetLimit(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., 500 (optional)"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
                <DialogFooter>
                <Button onClick={handleUpdateCategory}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
}

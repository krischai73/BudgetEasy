"use client";

import * as React from 'react';
import { format } from 'date-fns';
import type { Expense, Category } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from "@/lib/utils";
import { CalendarIcon, Edit, Trash2, PlusCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const expenseEditSchema = z.object({
  description: z.string().min(1, "Description is required."),
  amount: z.coerce.number().positive("Amount must be positive."),
  categoryId: z.string().min(1, "Category is required."),
  date: z.date({ required_error: "Date is required."}),
});

type ExpenseEditValues = z.infer<typeof expenseEditSchema>;


interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onUpdateExpense: (expense: Expense) => Promise<void>;
  onDeleteExpense: (expenseId: string) => Promise<void>;
}

export function ExpenseList({ expenses, categories, onUpdateExpense, onDeleteExpense }: ExpenseListProps) {
    const [isEditModalOpen, setEditModalOpen] = React.useState(false);
    const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);

    const categoryMap = React.useMemo(() => {
        return new Map(categories.map(cat => [cat.id, cat]));
    }, [categories]);

    const form = useForm<ExpenseEditValues>({
        resolver: zodResolver(expenseEditSchema),
    });

    const handleEditClick = (expense: Expense) => {
        setEditingExpense(expense);
        form.reset({
            description: expense.description,
            amount: expense.amount,
            categoryId: expense.categoryId,
            date: new Date(expense.date), // Ensure it's a Date object
        });
        setEditModalOpen(true);
    };

    const handleUpdateExpense = async (values: ExpenseEditValues) => {
        if (!editingExpense) return;
        try {
            const updatedExpense: Expense = {
                ...editingExpense,
                ...values,
                date: values.date // Already a Date object from the form
            };
            await onUpdateExpense(updatedExpense);
            setEditModalOpen(false);
            setEditingExpense(null);
            console.log("Expense updated successfully!");
            // Optional: Show success toast
        } catch (error) {
            console.error("Failed to update expense:", error);
            // Optional: Show error toast
        }
    };

    const handleDeleteExpense = async (expenseId: string) => {
        try {
            await onDeleteExpense(expenseId);
             console.log("Expense deleted successfully!");
             // Optional: Show success toast
        } catch (error) {
             console.error("Failed to delete expense:", error);
             // Optional: Show error toast
        }
    };

  const sortedExpenses = React.useMemo(() => {
    return [...expenses].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [expenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>View and manage your latest transactions.</CardDescription>
      </CardHeader>
      <CardContent>
         {sortedExpenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No expenses recorded yet.</p>
         ) : (
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedExpenses.map((expense) => {
                        const category = categoryMap.get(expense.categoryId);
                        const IconComponent = category?.icon || PlusCircle; // Fallback icon
                        return (
                            <TableRow key={expense.id}>
                            <TableCell className="whitespace-nowrap">{format(expense.date, 'PP')}</TableCell>
                            <TableCell className="font-medium">{expense.description}</TableCell>
                            <TableCell>
                                {category ? (
                                <div className="flex items-center gap-2">
                                    <span className="p-0.5 rounded-full" style={{ backgroundColor: `${category.color}33` }}>
                                        <IconComponent className="h-4 w-4" style={{ color: category.color }}/>
                                    </span>
                                    <span>{category.name}</span>
                                </div>
                                ) : (
                                <span className="text-muted-foreground">Uncategorized</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">${expense.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-center">
                               <TooltipProvider delayDuration={100}>
                                <div className="flex justify-center items-center gap-1">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleEditClick(expense)}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Edit Expense</p></TooltipContent>
                                    </Tooltip>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the expense: "{expense.description}".
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteExpense(expense.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                               </TooltipProvider>
                            </TableCell>
                            </TableRow>
                        );
                        })}
                    </TableBody>
                </Table>
            </div>
         )}

        {/* Edit Expense Dialog */}
        <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
             <DialogContent>
                 <DialogHeader>
                     <DialogTitle>Edit Expense</DialogTitle>
                     <DialogDescription>Update the details of this expense.</DialogDescription>
                 </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateExpense)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Amount ($)</FormLabel>
                                    <FormControl><Input type="number" step="0.01" min="0" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {categories.map((category) => {
                                                const Icon = category.icon;
                                                return (<SelectItem key={category.id} value={category.id}>
                                                    <div className="flex items-center gap-2">
                                                         <span className="p-0.5 rounded-full" style={{ backgroundColor: `${category.color}33` }}>
                                                            <Icon className="h-4 w-4" style={{ color: category.color }}/>
                                                        </span>
                                                        {category.name}
                                                    </div>
                                                </SelectItem>);
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                        >
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                         <DialogFooter>
                             <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
             </DialogContent>
         </Dialog>

      </CardContent>
    </Card>
  );
}

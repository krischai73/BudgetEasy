"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Category, Expense } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';

const expenseFormSchema = z.object({
  description: z.string().min(1, "Description is required."),
  amount: z.coerce.number().positive("Amount must be positive."), // Use coerce to handle string input from number field
  categoryId: z.string().min(1, "Category is required."),
  date: z.date({ required_error: "Date is required."}),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface AddExpenseFormProps {
  categories: Category[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  className?: string;
}

export function AddExpenseForm({ categories, onAddExpense, className }: AddExpenseFormProps) {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: '',
      amount: undefined, // Initialize as undefined for placeholder
      categoryId: '',
      date: new Date(),
    },
  });

  const onSubmit = async (values: ExpenseFormValues) => {
    try {
      await onAddExpense(values);
      form.reset(); // Reset form after successful submission
       // Optionally, show a success toast message here
       console.log("Expense added successfully!");
    } catch (error) {
      console.error("Failed to add expense:", error);
       // Optionally, show an error toast message here
    }
  };

  return (
    <Card className={cn("shadow-md", className)}>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
        <CardDescription>Log your recent spending.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Coffee, Lunch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="0.00" {...field} step="0.01" min="0" />
                    </FormControl>
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
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {categories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                                <SelectItem key={category.id} value={category.id}>
                                    <div className="flex items-center gap-2">
                                         <span className="p-0.5 rounded-full" style={{ backgroundColor: `${category.color}33` }}>
                                            <IconComponent className="h-4 w-4" style={{ color: category.color }}/>
                                        </span>
                                        {category.name}
                                    </div>
                                </SelectItem>
                            );
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
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Adding..." : "Add Expense"}
              <PlusCircle className="ml-2 h-4 w-4"/>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import type { SpendingByCategory } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BudgetProgressBarsProps {
  data: SpendingByCategory[];
}

export function BudgetProgressBars({ data }: BudgetProgressBarsProps) {
  const relevantData = data.filter(item => item.budgetLimit !== undefined && item.budgetLimit > 0);

   if (relevantData.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Budget Goals</CardTitle>
          <CardDescription>No budget goals set with limits yet.</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-muted-foreground">Set budget limits for categories to track your progress.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Goals Progress</CardTitle>
        <CardDescription>Track your spending against category budgets.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          {relevantData.map((item) => {
            const spentAmount = item.totalSpending;
            const budgetLimit = item.budgetLimit!; // We filtered out undefined/zero limits
            const progressPercentage = budgetLimit > 0 ? Math.min((spentAmount / budgetLimit) * 100, 100) : 0;
            const isOverBudget = spentAmount > budgetLimit;
            const remainingAmount = budgetLimit - spentAmount;
            const overAmount = spentAmount - budgetLimit;

            return (
              <Tooltip key={item.categoryId}>
                <TooltipTrigger asChild>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{item.name}</span>
                       <span className={cn(
                          "text-xs",
                          isOverBudget ? "text-destructive font-semibold" : "text-muted-foreground"
                       )}>
                        {isOverBudget
                          ? `$${overAmount.toFixed(2)} over`
                          : `$${remainingAmount.toFixed(2)} left`}
                      </span>
                    </div>
                    <Progress
                       value={progressPercentage}
                       className={cn("h-3", isOverBudget && " [&>*]:bg-destructive")}
                       aria-label={`${item.name} budget progress`}
                     />
                     <div className="flex justify-between text-xs text-muted-foreground pt-0.5">
                        <span>${spentAmount.toFixed(2)} spent</span>
                        <span>of ${budgetLimit.toFixed(2)}</span>
                     </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.name}: ${spentAmount.toFixed(2)} spent of ${budgetLimit.toFixed(2)} budget.</p>
                  {isOverBudget ? (
                    <p className="text-destructive">Over budget by ${overAmount.toFixed(2)}.</p>
                  ) : (
                    <p>Remaining: ${remainingAmount.toFixed(2)}.</p>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

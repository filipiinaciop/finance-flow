import { useState } from "react";
import type { ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinance } from "@/contexts/FinanceContext";
import { EXPENSE_CATEGORIES } from "@/types/finance";
import { Plus, Wallet, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Budgets = () => {
  const { budgets, expensesByCategory, addBudget, deleteBudget } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: "", limit: "" });

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.limit) {
      addBudget({
        category: newBudget.category,
        limit: parseFloat(newBudget.limit),
        currentAmount: expensesByCategory[newBudget.category] || 0,
      });
      setNewBudget({ category: "", limit: "" });
      setIsDialogOpen(false);
    }
  };

  const categoriesWithoutBudget = EXPENSE_CATEGORIES.filter(
    (cat: string) =>
      !budgets.some((b: (typeof budgets)[number]) => b.category === cat),
  );

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100)
      return {
        status: "exceeded",
        color: "bg-destructive",
        textColor: "text-destructive",
      };
    if (percentage >= 80)
      return {
        status: "warning",
        color: "bg-warning",
        textColor: "text-warning",
      };
    return { status: "ok", color: "bg-primary", textColor: "text-primary" };
  };

  const totalBudget = budgets.reduce(
    (sum: number, b: (typeof budgets)[number]) => sum + b.limit,
    0,
  );
  const totalSpent = budgets.reduce(
    (sum: number, b: (typeof budgets)[number]) =>
      sum + (expensesByCategory[b.category] || 0),
    0,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-muted-foreground">Defina limites por categoria</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Orçamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Orçamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={newBudget.category}
                  onValueChange={(value: string) =>
                    setNewBudget((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesWithoutBudget.map((cat: string) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Limite Mensal (R$)
                </label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={newBudget.limit}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewBudget((prev) => ({ ...prev, limit: e.target.value }))
                  }
                />
              </div>
              <Button onClick={handleAddBudget} className="w-full">
                Criar Orçamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orçamento Total</p>
                <p className="text-xl font-bold">
                  R${" "}
                  {totalBudget.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  totalSpent > totalBudget
                    ? "bg-destructive/10"
                    : "bg-income/10",
                )}
              >
                {totalSpent > totalBudget ? (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-income" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gasto</p>
                <p
                  className={cn(
                    "text-xl font-bold",
                    totalSpent > totalBudget
                      ? "text-destructive"
                      : "text-income",
                  )}
                >
                  R${" "}
                  {totalSpent.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disponível</p>
                <p className="text-xl font-bold">
                  R${" "}
                  {Math.max(0, totalBudget - totalSpent).toLocaleString(
                    "pt-BR",
                    { minimumFractionDigits: 2 },
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Orçamentos */}
      {budgets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Nenhum orçamento definido
            </h3>
            <p className="text-muted-foreground mb-4">
              Crie orçamentos para controlar seus gastos por categoria
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Orçamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget: (typeof budgets)[number]) => {
            const spent = expensesByCategory[budget.category] || 0;
            const percentage = Math.min((spent / budget.limit) * 100, 100);
            const { status, textColor } = getBudgetStatus(spent, budget.limit);
            const remaining = budget.limit - spent;

            return (
              <Card key={budget.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {budget.category}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {status === "exceeded" && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                          Excedido
                        </span>
                      )}
                      {status === "warning" && (
                        <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">
                          Atenção
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteBudget(budget.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      R${" "}
                      {spent.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="font-medium">
                      R${" "}
                      {budget.limit.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className={cn(
                      "h-2",
                      status === "exceeded" && "[&>div]:bg-destructive",
                      status === "warning" && "[&>div]:bg-warning",
                    )}
                  />
                  <p className={cn("text-sm", textColor)}>
                    {remaining >= 0
                      ? `Restam R$ ${remaining.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      : `Excedeu R$ ${Math.abs(remaining).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Budgets;

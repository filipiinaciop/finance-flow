import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import type { TransactionType } from "@/types/finance";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types/finance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const transactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  category: z.string().min(1, "Categoria é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  tag: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionModal = ({
  isOpen,
  onClose,
}: TransactionModalProps) => {
  const [type, setType] = useState<TransactionType>("expense");
  const { addTransaction } = useFinance();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const onSubmit = (data: TransactionFormData) => {
    addTransaction({
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
      tag: data.tag,
      type,
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md ">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Nova Transação
          </DialogTitle>
        </DialogHeader>

        {/* Toggle Tipo */}
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all",
              type === "expense"
                ? "bg-expense text-expense-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <TrendingDown className="w-4 h-4" />
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all",
              type === "income"
                ? "bg-income text-income-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <TrendingUp className="w-4 h-4" />
            Receita
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0,00"
              className="text-2xl font-bold h-14"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Almoço, Salário..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={watch("category") || ""}
              onValueChange={(value) =>
                setValue("category", value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Tag opcional */}
          <div className="space-y-2">
            <Label htmlFor="tag">Tag (opcional)</Label>
            <Input
              id="tag"
              placeholder="Ex: urgente, recorrente..."
              {...register("tag")}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className={cn(
                "flex-1",
                type === "income"
                  ? "bg-income hover:bg-income/90"
                  : "bg-expense hover:bg-expense/90",
              )}
            >
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

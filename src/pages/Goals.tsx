import { useState, useMemo } from "react";
import { format, differenceInDays } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Target,
  Trash2,
  TrendingUp,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import type { Goal } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const goalSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  targetAmount: z.number().min(1, "Valor alvo deve ser maior que zero"),
  currentAmount: z.number().min(0, "Valor atual não pode ser negativo"),
  deadline: z.string().min(1, "Prazo é obrigatório"),
});

type GoalFormData = z.infer<typeof goalSchema>;

const GOAL_COLORS = [
  "bg-primary",
  "bg-accent",
  "bg-warning",
  "bg-income",
  "bg-purple-500",
  "bg-pink-500",
];

const Goals = () => {
  const { goals, addGoal, deleteGoal, addToGoal } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addAmountModalGoal, setAddAmountModalGoal] = useState<Goal | null>(
    null,
  );
  const [amountToAdd, setAmountToAdd] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      currentAmount: 0,
    },
  });

  const onSubmit = (data: GoalFormData) => {
    addGoal({
      title: data.title,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      deadline: data.deadline,
      color: GOAL_COLORS[goals.length % GOAL_COLORS.length],
    });
    reset();
    setIsModalOpen(false);
  };

  const handleDeleteGoal = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta meta?")) {
      deleteGoal(id);
    }
  };

  const handleAddAmount = () => {
    if (addAmountModalGoal && amountToAdd) {
      addToGoal(addAmountModalGoal.id, parseFloat(amountToAdd));
      setAmountToAdd("");
      setAddAmountModalGoal(null);
    }
  };

  const getGoalStats = (goal: Goal) => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
    const dailyNeeded = daysLeft > 0 ? remaining / daysLeft : remaining;
    const isCompleted = goal.currentAmount >= goal.targetAmount;

    return { percentage, remaining, daysLeft, dailyNeeded, isCompleted };
  };

  // Cálculos para a planilha
  const totalTargetAmount = useMemo(
    () => goals.reduce((sum, g) => sum + g.targetAmount, 0),
    [goals],
  );

  const totalCurrentAmount = useMemo(
    () => goals.reduce((sum, g) => sum + g.currentAmount, 0),
    [goals],
  );

  const totalRemaining = totalTargetAmount - totalCurrentAmount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Objetivos Financeiros</h1>
          <p className="text-muted-foreground">
            Acompanhe suas metas de economia
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 hidden lg:flex"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </Button>
      </div>

      {/* Resumo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Metas</p>
                <p className="text-xl font-bold">{goals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-income/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-income" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Já Economizado</p>
                <p className="text-xl font-bold text-income">
                  {formatCurrency(totalCurrentAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Falta Economizar
                </p>
                <p className="text-xl font-bold">
                  {formatCurrency(totalRemaining)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planilha de Objetivos (estilo Excel) */}
      {goals.length > 0 && (
        <Card className="shadow-card overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Planilha de Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Meta</TableHead>
                    <TableHead className="text-right font-semibold">
                      Alvo
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Atual
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Falta
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Progresso
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Prazo
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Dias
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      R$/dia
                    </TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goals.map((goal) => {
                    const stats = getGoalStats(goal);

                    return (
                      <TableRow key={goal.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-3 h-3 rounded-full",
                                goal.color || "bg-primary",
                              )}
                            />
                            {goal.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(goal.targetAmount)}
                        </TableCell>
                        <TableCell className="text-right text-income font-medium">
                          {formatCurrency(goal.currentAmount)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatCurrency(stats.remaining)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={Math.min(stats.percentage, 100)}
                              className="h-2 flex-1"
                            />
                            <span className="text-xs w-10 text-right">
                              {stats.percentage.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {format(new Date(goal.deadline), "dd/MM/yy")}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-medium",
                            stats.daysLeft < 0
                              ? "text-destructive"
                              : stats.daysLeft < 30
                                ? "text-warning"
                                : "text-muted-foreground",
                          )}
                        >
                          {stats.daysLeft < 0 ? "Vencido" : stats.daysLeft}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {stats.daysLeft > 0
                            ? formatCurrency(stats.dailyNeeded)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setAddAmountModalGoal(goal)}
                              className="h-8 px-2 text-primary"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="h-8 px-2 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Linha de Total */}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(totalTargetAmount)}
                    </TableCell>
                    <TableCell className="text-right text-income">
                      {formatCurrency(totalCurrentAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(totalRemaining)}
                    </TableCell>
                    <TableCell>
                      <Progress
                        value={
                          totalTargetAmount > 0
                            ? (totalCurrentAmount / totalTargetAmount) * 100
                            : 0
                        }
                        className="h-2"
                      />
                    </TableCell>
                    <TableCell colSpan={4}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Cards (Mobile-friendly) */}
      {goals.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma meta definida</p>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="mt-4 gap-2"
            >
              <Plus className="w-4 h-4" />
              Criar Meta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
          {goals.map((goal, index) => {
            const stats = getGoalStats(goal);

            return (
              <Card
                key={goal.id}
                className="shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          goal.color || "bg-primary",
                        )}
                      >
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {stats.daysLeft > 0
                            ? `${stats.daysLeft} dias restantes`
                            : "Prazo vencido"}
                        </p>
                      </div>
                    </div>
                    {stats.isCompleted && (
                      <span className="px-2 py-1 bg-income/10 text-income text-xs font-medium rounded-full">
                        ✓ Concluída
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{formatCurrency(goal.currentAmount)}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(stats.percentage, 100)}
                        className="h-2"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAddAmountModalGoal(goal)}
                        className="gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Adicionar
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Nova Meta */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Nova Meta</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Título da Meta</Label>
              <Input
                placeholder="Ex: Viagem para Europa"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Valor Alvo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="10000,00"
                {...register("targetAmount", { valueAsNumber: true })}
              />
              {errors.targetAmount && (
                <p className="text-sm text-destructive">
                  {errors.targetAmount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Valor Atual (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                {...register("currentAmount", { valueAsNumber: true })}
              />
              {errors.currentAmount && (
                <p className="text-sm text-destructive">
                  {errors.currentAmount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Prazo</Label>
              <Input type="date" {...register("deadline")} />
              {errors.deadline && (
                <p className="text-sm text-destructive">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Criar Meta
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Adicionar Valor */}
      <Dialog
        open={!!addAmountModalGoal}
        onOpenChange={() => setAddAmountModalGoal(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar à Meta</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Quanto você quer adicionar para "{addAmountModalGoal?.title}"?
            </p>

            <Input
              type="number"
              step="0.01"
              placeholder="100,00"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
              className="text-xl font-bold h-14"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setAddAmountModalGoal(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button onClick={handleAddAmount} className="flex-1">
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;

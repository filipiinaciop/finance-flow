import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Plane,
  MapPin,
  Calendar,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import type { Trip } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const tripSchema = z.object({
  destination: z.string().min(1, "Destino é obrigatório"),
  budget: z.number().min(1, "Orçamento deve ser maior que zero"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de fim é obrigatória"),
});

type TripFormData = z.infer<typeof tripSchema>;

const Trips = () => {
  const { trips, addTrip, deleteTrip } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

  const onSubmit = (data: TripFormData) => {
    addTrip({
      destination: data.destination,
      budget: data.budget,
      startDate: data.startDate,
      endDate: data.endDate,
    });
    reset();
    setIsModalOpen(false);
  };

  const handleDeleteTrip = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta viagem?")) {
      deleteTrip(id);
    }
  };

  const getTripStats = (trip: Trip) => {
    const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = (totalSpent / trip.budget) * 100;
    const remaining = trip.budget - totalSpent;
    const days =
      differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;

    return { totalSpent, percentage, remaining, days };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Viagens</h1>
          <p className="text-muted-foreground">
            Planeje e acompanhe gastos de viagens
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 hidden lg:flex"
        >
          <Plus className="w-4 h-4" />
          Nova Viagem
        </Button>
      </div>

      {/* Lista de Viagens */}
      {trips.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Plane className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma viagem planejada</p>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="mt-4 gap-2"
            >
              <Plus className="w-4 h-4" />
              Planejar Viagem
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip, index) => {
            const stats = getTripStats(trip);
            const isOverBudget = stats.percentage > 100;

            return (
              <Card
                key={trip.id}
                className="shadow-card hover:shadow-card-hover transition-all cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedTrip(trip)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Ícone */}
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
                      <Plane className="w-6 h-6 text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg truncate">
                          {trip.destination}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(trip.startDate), "d MMM", {
                            locale: ptBR,
                          })}{" "}
                          -{" "}
                          {format(new Date(trip.endDate), "d MMM", {
                            locale: ptBR,
                          })}
                        </span>
                        <span>{stats.days} dias</span>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <Progress
                          value={Math.min(stats.percentage, 100)}
                          className={cn(
                            "h-2",
                            isOverBudget && "[&>div]:bg-destructive",
                          )}
                        />
                        <div className="flex justify-between text-sm">
                          <span
                            className={
                              isOverBudget
                                ? "text-destructive font-medium"
                                : "text-muted-foreground"
                            }
                          >
                            {formatCurrency(stats.totalSpent)} gastos
                          </span>
                          <span className="text-muted-foreground">
                            de {formatCurrency(trip.budget)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTrip(trip.id);
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Nova Viagem */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Nova Viagem</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Destino</Label>
              <Input
                placeholder="Ex: Paris, França"
                {...register("destination")}
              />
              {errors.destination && (
                <p className="text-sm text-destructive">
                  {errors.destination.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Orçamento (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="5000,00"
                {...register("budget", { valueAsNumber: true })}
              />
              {errors.budget && (
                <p className="text-sm text-destructive">
                  {errors.budget.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Input type="date" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-sm text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Data de Fim</Label>
                <Input type="date" {...register("endDate")} />
                {errors.endDate && (
                  <p className="text-sm text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
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
                Criar Viagem
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Detalhes da Viagem */}
      <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedTrip && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {selectedTrip.destination}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground">Orçamento</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(selectedTrip.budget)}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground">Gastos</p>
                    <p className="text-lg font-bold text-expense">
                      {formatCurrency(
                        selectedTrip.expenses.reduce((s, e) => s + e.amount, 0),
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Despesas da Viagem</h4>
                  {selectedTrip.expenses.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma despesa registrada
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-auto">
                      {selectedTrip.expenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {expense.category}
                            </p>
                          </div>
                          <span className="font-semibold text-expense">
                            -{formatCurrency(expense.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trips;

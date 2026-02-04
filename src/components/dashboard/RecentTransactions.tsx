import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const getCategoryEmoji = (category: string): string => {
  const emojis: Record<string, string> = {
    Alimentação: "🍽️",
    Transporte: "🚗",
    Moradia: "🏠",
    Saúde: "💊",
    Educação: "📚",
    Lazer: "🎮",
    Compras: "🛒",
    Viagem: "✈️",
    Salário: "💰",
    Freelance: "💼",
    Investimentos: "📈",
    Vendas: "🏷️",
    Outros: "📦",
  };
  return emojis[category] || "📌";
};

export const RecentTransactions = () => {
  const { transactions } = useFinance();

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  if (recentTransactions.length === 0) {
    return (
      <Card className="shadow-card animate-slide-up">
        <CardHeader>
          <CardTitle className="text-lg">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <p>Nenhuma transação ainda</p>
            <p className="text-sm mt-1">Use o botão + para adicionar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Transações Recentes</CardTitle>
        <button
          type="button"
          aria-label="Mais opções"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-muted/50",
                "animate-slide-up",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Ícone da categoria */}
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                  transaction.type === "income"
                    ? "bg-income-muted"
                    : "bg-expense-muted",
                )}
              >
                {getCategoryEmoji(transaction.category)}
              </div>

              {/* Detalhes */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {transaction.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category} •{" "}
                  {format(new Date(transaction.date), "d 'de' MMM", {
                    locale: ptBR,
                  })}
                </p>
              </div>

              {/* Valor */}
              <div className="flex items-center gap-1">
                {transaction.type === "income" ? (
                  <TrendingUp className="w-4 h-4 text-income" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-expense" />
                )}
                <span
                  className={cn(
                    "font-semibold",
                    transaction.type === "income"
                      ? "text-income"
                      : "text-expense",
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

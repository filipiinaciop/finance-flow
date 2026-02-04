import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const Transactions = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all",
  );

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch =
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "all" || t.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchQuery, typeFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 hidden lg:flex"
        >
          <Plus className="w-4 h-4" />
          Nova Transação
        </Button>
      </div>

      {/* Filtros */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transação..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(v: "all" | "income" | "expense") =>
                setTypeFilter(v)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma transação encontrada
              </p>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="mt-4 gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Transação
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <Card
              key={transaction.id}
              className="shadow-card hover:shadow-card-hover transition-shadow animate-slide-up"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Ícone */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0",
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
                    <p className="text-sm text-muted-foreground">
                      {transaction.category} •{" "}
                      {format(new Date(transaction.date), "d 'de' MMMM, yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                    {transaction.tag && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                        {transaction.tag}
                      </span>
                    )}
                  </div>

                  {/* Valor e Ações */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {transaction.type === "income" ? (
                          <TrendingUp className="w-4 h-4 text-income" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-expense" />
                        )}
                        <span
                          className={cn(
                            "font-bold",
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

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Transactions;

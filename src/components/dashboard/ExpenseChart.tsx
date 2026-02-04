import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "hsl(158, 64%, 40%)", // Emerald
  "hsl(350, 89%, 60%)", // Rose
  "hsl(38, 92%, 50%)", // Amber
  "hsl(215, 50%, 50%)", // Blue
  "hsl(280, 60%, 55%)", // Purple
  "hsl(173, 58%, 45%)", // Teal
  "hsl(25, 95%, 53%)", // Orange
  "hsl(142, 71%, 45%)", // Green
  "hsl(0, 0%, 45%)", // Gray
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const ExpenseChart = () => {
  const { expensesByCategory, totalExpenses, totalIncome } = useFinance();

  const chartData = useMemo(() => {
    const categories = Object.entries(expensesByCategory).map(
      ([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length],
        percentage:
          totalExpenses > 0 ? ((value / totalExpenses) * 100).toFixed(1) : 0,
      }),
    );
    return categories.sort((a, b) => b.value - a.value);
  }, [expensesByCategory, totalExpenses]);

  const incomeVsExpense = useMemo(
    () => [
      { name: "Receitas", value: totalIncome, color: "hsl(152, 69%, 45%)" },
      { name: "Despesas", value: totalExpenses, color: "hsl(350, 89%, 60%)" },
    ],
    [totalIncome, totalExpenses],
  );

  if (totalIncome === 0 && totalExpenses === 0) {
    return (
      <Card className="shadow-card animate-slide-up">
        <CardHeader>
          <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <p className="text-center">
              Adicione transações para ver
              <br />o gráfico de resumo
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader>
        <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incomeVsExpense}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {incomeVsExpense.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  boxShadow: "var(--shadow-md)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lista de categorias de despesas */}
        {chartData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Despesas por Categoria
            </p>
            <div className="space-y-2 max-h-32 overflow-auto scrollbar-thin">
              {chartData.slice(0, 5).map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="flex-1 text-sm truncate">{item.name}</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(item.value)}
                  </span>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

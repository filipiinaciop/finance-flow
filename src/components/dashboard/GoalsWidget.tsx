import { useMemo } from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const GoalsWidget = () => {
  const { goals } = useFinance();

  const activeGoals = useMemo(() => {
    return goals.slice(0, 3);
  }, [goals]);

  if (activeGoals.length === 0) {
    return (
      <Card className="shadow-card animate-slide-up">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-4 text-center text-muted-foreground">
            <p>Nenhuma meta definida</p>
            <p className="text-sm mt-1">Vá em Objetivos para criar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card animate-slide-up">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Metas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate">{goal.title}</span>
                  <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span>Falta: {formatCurrency(remaining)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

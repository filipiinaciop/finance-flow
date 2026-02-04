import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '@/contexts/FinanceContext';
import { cn } from '@/lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const BalanceCard = () => {
  const { balance, totalIncome, totalExpenses } = useFinance();

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-white shadow-elevated animate-fade-in">
      {/* Decoração de fundo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 opacity-80" />
          <span className="text-sm font-medium opacity-80">Saldo Total</span>
        </div>
        
        <p className={cn(
          "text-4xl font-bold tracking-tight mb-6",
          balance < 0 && "text-red-200"
        )}>
          {formatCurrency(balance)}
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Receitas */}
          <div className="bg-white/15 backdrop-blur rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium opacity-80">Receitas</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalIncome)}</p>
          </div>

          {/* Despesas */}
          <div className="bg-white/15 backdrop-blur rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium opacity-80">Despesas</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

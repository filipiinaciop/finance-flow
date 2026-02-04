import { useState } from 'react';
import { Plus } from 'lucide-react';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { GoalsWidget } from '@/components/dashboard/GoalsWidget';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Desktop */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das suas finanças</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Transação
        </Button>
      </div>

      {/* Card de Saldo */}
      <BalanceCard />

      {/* Grid de Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico */}
        <ExpenseChart />
        
        {/* Metas */}
        <GoalsWidget />
      </div>

      {/* Transações Recentes */}
      <RecentTransactions />

      {/* Modal */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
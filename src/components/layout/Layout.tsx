import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Layout = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar />
      
      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header Mobile */}
        <header className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-semibold">FinanceMaster</span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Área de Conteúdo */}
        <div className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 overflow-auto scrollbar-thin">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation - Mobile */}
      <BottomNav onAddClick={() => setIsTransactionModalOpen(true)} />

      {/* Modal de Transação */}
      <TransactionModal 
        isOpen={isTransactionModalOpen} 
        onClose={() => setIsTransactionModalOpen(false)} 
      />
    </div>
  );
};

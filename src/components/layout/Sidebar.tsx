import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Target,
  TrendingUp,
  Wallet,
  PiggyBank
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transações', icon: ArrowLeftRight },
  { path: '/budgets', label: 'Orçamentos', icon: PiggyBank },
  { path: '/goals', label: 'Objetivos', icon: Target },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">FinanceMaster</h1>
            <p className="text-xs text-sidebar-foreground/60">Gestão Financeira</p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center justify-between px-4">
          <span className="text-sm text-sidebar-foreground/60">Tema</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent/50">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Versão 1.0</p>
            <p className="text-xs text-sidebar-foreground/60">React + Tailwind</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

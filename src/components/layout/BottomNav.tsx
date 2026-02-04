import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Plus,
  PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/transactions", label: "Transações", icon: ArrowLeftRight },
  { path: "/budgets", label: "Orçamentos", icon: PiggyBank },
  { path: "/goals", label: "Objetivos", icon: Target },
];

interface BottomNavProps {
  onAddClick: () => void;
}

export const BottomNav = ({ onAddClick }: BottomNavProps) => {
  const location = useLocation();

  return (
    <nav className="lg:hidden bottom-nav bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Botão central de adicionar */}
        <button
          onClick={onAddClick}
          className="flex flex-col items-center justify-center -mt-6 w-14 h-14 rounded-full gradient-primary text-white shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Nova transação"
        >
          <Plus className="w-6 h-6" />
        </button>

        {navItems.slice(2, 4).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

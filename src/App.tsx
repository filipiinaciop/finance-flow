import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinanceProvider } from "@/contexts/FinanceContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="financemaster-theme">
      <TooltipProvider>
        <FinanceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/goals" element={<Goals />} />
              </Route>
              {/* Adicionar as rotas customizaveis se mim querer no futuro */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FinanceProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

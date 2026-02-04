import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import type {
  Transaction,
  Budget,
  Trip,
  Goal,
  FinanceState,
} from "@/types/finance";

// Helpers para localStorage
const STORAGE_KEY = "financemaster_data";

const loadFromStorage = (): FinanceState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
  return { transactions: [], budgets: [], trips: [], goals: [] };
};

const saveToStorage = (state: FinanceState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
  }
};

// Gerar ID único
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

interface FinanceContextType {
  // Estado
  transactions: Transaction[];
  budgets: Budget[];
  trips: Trip[];
  goals: Goal[];

  // Valores computados
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: Record<string, number>;

  // Ações - Transações
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Ações - Viagens
  addTrip: (trip: Omit<Trip, "id" | "expenses">) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addExpenseToTrip: (
    tripId: string,
    expense: Omit<Transaction, "id" | "tripId">,
  ) => void;

  // Ações - Objetivos
  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addToGoal: (id: string, amount: number) => void;

  // Ações - Orçamentos
  addBudget: (budget: Omit<Budget, "id">) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<FinanceState>(loadFromStorage);

  // Persistir no localStorage quando o estado mudar
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // Valores computados (equivalente ao computed do Angular Signals)
  const totalIncome = useMemo(() => {
    return state.transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [state.transactions]);

  const totalExpenses = useMemo(() => {
    return state.transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [state.transactions]);

  const balance = useMemo(
    () => totalIncome - totalExpenses,
    [totalIncome, totalExpenses],
  );

  const expensesByCategory = useMemo(() => {
    return state.transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        },
        {} as Record<string, number>,
      );
  }, [state.transactions]);

  // Ações - Transações
  const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
    setState((prev) => ({
      ...prev,
      transactions: [
        ...prev.transactions,
        { ...transaction, id: generateId() },
      ],
    }));
  }, []);

  const updateTransaction = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      setState((prev) => ({
        ...prev,
        transactions: prev.transactions.map((t) =>
          t.id === id ? { ...t, ...updates } : t,
        ),
      }));
    },
    [],
  );

  const deleteTransaction = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }, []);

  // Ações - Viagens
  const addTrip = useCallback((trip: Omit<Trip, "id" | "expenses">) => {
    setState((prev) => ({
      ...prev,
      trips: [...prev.trips, { ...trip, id: generateId(), expenses: [] }],
    }));
  }, []);

  const updateTrip = useCallback((id: string, updates: Partial<Trip>) => {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.filter((t) => t.id !== id),
    }));
  }, []);

  const addExpenseToTrip = useCallback(
    (tripId: string, expense: Omit<Transaction, "id" | "tripId">) => {
      const newExpense: Transaction = {
        ...expense,
        id: generateId(),
        tripId,
        type: "expense",
      };

      setState((prev) => ({
        ...prev,
        trips: prev.trips.map((t) =>
          t.id === tripId ? { ...t, expenses: [...t.expenses, newExpense] } : t,
        ),
        transactions: [...prev.transactions, newExpense],
      }));
    },
    [],
  );

  // Ações - Objetivos
  const addGoal = useCallback((goal: Omit<Goal, "id">) => {
    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: generateId() }],
    }));
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  }, []);

  const addToGoal = useCallback((id: string, amount: number) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id
          ? {
              ...g,
              currentAmount: Math.min(g.currentAmount + amount, g.targetAmount),
            }
          : g,
      ),
    }));
  }, []);

  // Ações - Orçamentos
  const addBudget = useCallback((budget: Omit<Budget, "id">) => {
    setState((prev) => ({
      ...prev,
      budgets: [...prev.budgets, { ...budget, id: generateId() }],
    }));
  }, []);

  const updateBudget = useCallback((id: string, updates: Partial<Budget>) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) =>
        b.id === id ? { ...b, ...updates } : b,
      ),
    }));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((b) => b.id !== id),
    }));
  }, []);

  const value: FinanceContextType = {
    transactions: state.transactions,
    budgets: state.budgets,
    trips: state.trips,
    goals: state.goals,
    totalIncome,
    totalExpenses,
    balance,
    expensesByCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addTrip,
    updateTrip,
    deleteTrip,
    addExpenseToTrip,
    addGoal,
    updateGoal,
    deleteGoal,
    addToGoal,
    addBudget,
    updateBudget,
    deleteBudget,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance deve ser usado dentro de FinanceProvider");
  }
  return context;
};

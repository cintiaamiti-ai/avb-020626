import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type NivelABEP = "DE" | "C" | "AB" | null;

interface DiarioEntry {
  id: string;
  exercicioId: number;
  conteudo: Record<string, string>;
}

interface Contato {
  nome: string;
  telefone: string;
}

interface AppState {
  nivelABEP: NivelABEP;
  triageCompleta: boolean;
  diarios: DiarioEntry[];
  exerciciosCompletos: number[];
  contatosPessoais: Contato[];
  motivosNaoJogar: string[];
}

interface AppContextType {
  state: AppState;
  setNivelABEP: (nivel: NivelABEP) => void;
  completarTriagem: () => void;
  salvarDiario: (entry: DiarioEntry) => void;
  completarExercicio: (id: number) => void;
  salvarContatos: (contatos: Contato[]) => void;
  salvarMotivosNaoJogar: (motivos: string[]) => void;
  resetar: () => void;
}

const defaultState: AppState = {
  nivelABEP: null,
  triageCompleta: false,
  diarios: [],
  exerciciosCompletos: [],
  contatosPessoais: [
    { nome: "", telefone: "" },
    { nome: "", telefone: "" },
    { nome: "", telefone: "" },
  ],
  motivosNaoJogar: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadState(): AppState {
  try {
    const saved = localStorage.getItem("avb-app-state");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed };
    }
  } catch {
    // Dado corrompido ou localStorage indisponível — segue com o padrão abaixo.
  }
  return defaultState;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem("avb-app-state", JSON.stringify(state));
  } catch {
    // localStorage cheio ou indisponível — falha silenciosa é intencional
    // (não deve derrubar a UI por não conseguir persistir o estado).
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setNivelABEP = (nivel: NivelABEP) => {
    setState((prev) => ({ ...prev, nivelABEP: nivel }));
  };

  const completarTriagem = () => {
    setState((prev) => ({ ...prev, triageCompleta: true }));
  };

  const salvarDiario = (entry: DiarioEntry) => {
    setState((prev) => ({
      ...prev,
      diarios: [...prev.diarios.filter((d) => d.id !== entry.id), entry],
    }));
  };

  const completarExercicio = (id: number) => {
    setState((prev) => ({
      ...prev,
      exerciciosCompletos: prev.exerciciosCompletos.includes(id)
        ? prev.exerciciosCompletos
        : [...prev.exerciciosCompletos, id],
    }));
  };

  const salvarContatos = (contatos: Contato[]) => {
    setState((prev) => ({ ...prev, contatosPessoais: contatos }));
  };

  const salvarMotivosNaoJogar = (motivos: string[]) => {
    setState((prev) => ({ ...prev, motivosNaoJogar: motivos }));
  };

  const resetar = () => {
    setState(defaultState);
    localStorage.removeItem("avb-app-state");
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setNivelABEP,
        completarTriagem,
        salvarDiario,
        completarExercicio,
        salvarContatos,
        salvarMotivosNaoJogar,
        resetar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de AppProvider");
  return ctx;
}

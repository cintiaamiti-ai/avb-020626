/**
 * Contexto de Acessibilidade
 * Gerencia modo de alto contraste, tamanho de fonte, e preferências de áudio
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AccessibilityState {
  /** Modo de alto contraste ativo */
  highContrast: boolean;
  /** Tamanho de fonte aumentado */
  largeText: boolean;
  /** Áudio automático ao navegar */
  autoRead: boolean;
  /** Velocidade de leitura padrão */
  speechRate: number;
}

interface AccessibilityContextType extends AccessibilityState {
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleAutoRead: () => void;
  setSpeechRate: (rate: number) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const STORAGE_KEY = "avb-acessibilidade";

function loadSettings(): AccessibilityState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    highContrast: false,
    largeText: false,
    autoRead: false,
    speechRate: 0.85,
  };
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // Aplicar classes no body
    document.body.classList.toggle("high-contrast", state.highContrast);
    document.body.classList.toggle("large-text", state.largeText);
  }, [state]);

  const toggleHighContrast = () =>
    setState((s) => ({ ...s, highContrast: !s.highContrast }));

  const toggleLargeText = () =>
    setState((s) => ({ ...s, largeText: !s.largeText }));

  const toggleAutoRead = () =>
    setState((s) => ({ ...s, autoRead: !s.autoRead }));

  const setSpeechRate = (rate: number) =>
    setState((s) => ({ ...s, speechRate: rate }));

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        toggleHighContrast,
        toggleLargeText,
        toggleAutoRead,
        setSpeechRate,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility deve ser usado dentro de AccessibilityProvider");
  }
  return ctx;
}

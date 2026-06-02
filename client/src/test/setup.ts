// src/test/setup.ts
// Configuração global para todos os testes Vitest + React Testing Library

import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// ─── Limpeza automática após cada teste ──────────────────────────────────────
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// ─── Mock localStorage ────────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { store[key] = val; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// ─── Mock Web Crypto API ──────────────────────────────────────────────────────
Object.defineProperty(globalThis, "crypto", {
  value: {
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
      return arr;
    },
    subtle: {
      importKey: vi.fn().mockResolvedValue("mock-key"),
      deriveKey: vi.fn().mockResolvedValue("mock-derived-key"),
      encrypt: vi.fn().mockResolvedValue(new Uint8Array(32).buffer),
      decrypt: vi.fn().mockResolvedValue(
        new TextEncoder().encode(JSON.stringify({ mock: true }))
      ),
    },
  },
  writable: true,
});

// ─── Mock window.matchMedia ───────────────────────────────────────────────────
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ─── Mock navigator.vibrate ───────────────────────────────────────────────────
Object.defineProperty(navigator, "vibrate", {
  value: vi.fn(),
  writable: true,
});

// ─── Mock speechSynthesis ─────────────────────────────────────────────────────
Object.defineProperty(window, "speechSynthesis", {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => []),
  },
  writable: true,
});

// ─── Silenciar console.error para props warnings nos testes ──────────────────
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

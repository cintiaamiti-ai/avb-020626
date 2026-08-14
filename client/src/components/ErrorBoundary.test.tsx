// ErrorBoundary.test.tsx
// Testes do ErrorBoundary — a última rede de segurança antes de o usuário
// ver uma tela em branco. Precisa: (1) capturar erros e mostrar o fallback
// com CVV/JA sempre visíveis, e (2) resetar ao mudar de rota (resetKey),
// já que esse reset foi um bug crítico corrigido anteriormente (BUG-CRIT-005)
// e é fácil de quebrar de novo sem um teste cobrindo o comportamento.

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

function ComponenteComErro(): never {
  throw new Error("falha simulada");
}

function ComponenteOk() {
  return <p>Tudo funcionando</p>;
}

describe("ErrorBoundary", () => {
  it("renderiza os filhos normalmente quando não há erro", () => {
    render(
      <ErrorBoundary>
        <ComponenteOk />
      </ErrorBoundary>
    );
    expect(screen.getByText("Tudo funcionando")).toBeInTheDocument();
  });

  it("captura um erro e mostra o fallback com contatos de emergência", () => {
    render(
      <ErrorBoundary resetKey="/exercicio/1">
        <ComponenteComErro />
      </ErrorBoundary>
    );

    expect(screen.getByText("Algo não funcionou como esperado")).toBeInTheDocument();
    expect(screen.getByLabelText(/Ligar para o CVV/i)).toHaveAttribute("href", "tel:188");
    expect(screen.getByLabelText(/Jogadores Anônimos/i)).toHaveAttribute(
      "href",
      "tel:+551132291615"
    );
  });

  it("reseta o estado de erro quando resetKey muda (ex.: navegação de rota)", () => {
    const { rerender } = render(
      <ErrorBoundary resetKey="/exercicio/1">
        <ComponenteComErro />
      </ErrorBoundary>
    );
    expect(screen.getByText("Algo não funcionou como esperado")).toBeInTheDocument();

    // Simula a navegação para outra rota — resetKey muda, e a rota nova
    // renderiza um componente saudável.
    rerender(
      <ErrorBoundary resetKey="/sos">
        <ComponenteOk />
      </ErrorBoundary>
    );

    expect(screen.queryByText("Algo não funcionou como esperado")).not.toBeInTheDocument();
    expect(screen.getByText("Tudo funcionando")).toBeInTheDocument();
  });

  it("não reseta se resetKey permanecer o mesmo (o erro persiste na mesma rota)", () => {
    const { rerender } = render(
      <ErrorBoundary resetKey="/exercicio/1">
        <ComponenteComErro />
      </ErrorBoundary>
    );
    expect(screen.getByText("Algo não funcionou como esperado")).toBeInTheDocument();

    rerender(
      <ErrorBoundary resetKey="/exercicio/1">
        <ComponenteOk />
      </ErrorBoundary>
    );

    expect(screen.getByText("Algo não funcionou como esperado")).toBeInTheDocument();
  });
});

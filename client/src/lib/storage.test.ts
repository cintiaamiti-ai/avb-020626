// storage.test.ts
// Testes do módulo de armazenamento criptografado (AES-256-GCM).
// Este é o módulo que protege os dados clínicos do usuário (escalas, estado
// emocional, diário) — se ele silenciosamente falhar, dados sensíveis podem
// ficar em texto puro no localStorage sem que ninguém perceba.

import { beforeAll, describe, expect, it } from "vitest";
import { webcrypto } from "node:crypto";
import { isCryptoAvailable, loadEncrypted, removeItem, saveEncrypted } from "./storage";

describe("storage.ts", () => {
  beforeAll(() => {
    // O setup.ts global substitui `globalThis.crypto` por um mock que sempre
    // retorna o mesmo valor descriptografado — útil para outros testes, mas
    // inutiliza um teste real de round-trip de criptografia. Aqui usamos a
    // implementação real do Node (a mesma API Web Crypto do navegador) para
    // validar que encrypt/decrypt realmente funcionam de ponta a ponta.
    Object.defineProperty(globalThis, "crypto", {
      value: webcrypto,
      writable: true,
      configurable: true,
    });
  });

  it("reporta que a Web Crypto API está disponível", () => {
    expect(isCryptoAvailable()).toBe(true);
  });

  it("salva e recupera um valor criptografado (round-trip)", async () => {
    const dado = { escala: "ESJ", pontuacao: 7, notas: "texto sensível" };
    await saveEncrypted("avb_teste_roundtrip", dado);

    const bruto = localStorage.getItem("avb_teste_roundtrip");
    expect(bruto).toBeTruthy();
    // O valor salvo não pode conter o texto original em claro.
    expect(bruto).not.toContain("texto sensível");

    const recuperado = await loadEncrypted("avb_teste_roundtrip", null);
    expect(recuperado).toEqual(dado);
  });

  it("retorna o valor padrão quando a chave não existe", async () => {
    const resultado = await loadEncrypted("avb_chave_inexistente", "padrao");
    expect(resultado).toBe("padrao");
  });

  it("migra dados legados salvos como JSON puro (não criptografado)", async () => {
    const legado = { versao: 1, texto: "salvo antes da criptografia" };
    localStorage.setItem("avb_legado", JSON.stringify(legado));

    const recuperado = await loadEncrypted("avb_legado", null);
    expect(recuperado).toEqual(legado);

    // Após a migração, o valor no localStorage deve estar criptografado —
    // ou seja, não deve mais ser JSON legível diretamente.
    const bruto = localStorage.getItem("avb_legado");
    expect(() => JSON.parse(bruto!)).toThrow();
  });

  it("retorna o valor padrão e limpa a chave se o dado estiver corrompido", async () => {
    localStorage.setItem("avb_corrompido", "isso não é JSON nem base64 válido {{{");

    const resultado = await loadEncrypted("avb_corrompido", "fallback");
    expect(resultado).toBe("fallback");
    expect(localStorage.getItem("avb_corrompido")).toBeNull();
  });

  it("removeItem apaga a chave do localStorage", async () => {
    await saveEncrypted("avb_para_remover", { x: 1 });
    expect(localStorage.getItem("avb_para_remover")).not.toBeNull();

    removeItem("avb_para_remover");
    expect(localStorage.getItem("avb_para_remover")).toBeNull();
  });
});

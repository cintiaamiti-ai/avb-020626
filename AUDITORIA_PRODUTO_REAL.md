# AUDITORIA REAL DE PRODUTO — AVB
### Quando o Jogo Vira Problema
**Data:** 03/06/2026 | **Versão auditada:** avb-020626 | **URL:** https://avb-020626.vercel.app

---

## RESUMO EXECUTIVO

| Categoria | Crítico | Alto | Médio | Baixo | Total |
|---|---|---|---|---|---|
| Bugs técnicos | 5 | 0 | 0 | 0 | 5 |
| Psicológico/Clínico | 0 | 0 | 1 | 0 | 1 |
| Acessibilidade | 0 | 0 | 1 | 0 | 1 |
| UX / Sobrecarga | 0 | 0 | 1 | 1 | 2 |
| Performance | 0 | 0 | 0 | 1 | 1 |
| **TOTAL** | **5** | **0** | **3** | **2** | **10** |

**Status após correções:** ✅ Todos os bugs críticos corrigidos e redeploy realizado.

---

## TABELA COMPLETA DE PROBLEMAS

| ID | Tela | Severidade | Tipo | Status |
|---|---|---|---|---|
| BUG-CRIT-001 | /exercicio/* | Crítico | Crash — `useEffect` não importado | ✅ Corrigido |
| BUG-CRIT-002 | storage.ts | Crítico | Tipos `Uint8Array` incompatíveis TypeScript 5.6 | ✅ Corrigido |
| BUG-CRIT-003 | /escala-esj | Crítico | 6 erros TypeScript — `reduce` com tipo `null` | ✅ Corrigido |
| BUG-CRIT-004 | form.tsx | Crítico | `react-hook-form` ausente nas dependências | ✅ Corrigido |
| BUG-CRIT-005 | Todas | Crítico | ErrorBoundary não resetava ao navegar (crash cascata) | ✅ Corrigido |
| PSI-001 | /lapso-recaida | Médio | Palavra "fracasso" no contexto clínico | ⚠️ Falso positivo — contexto protetivo |
| ACES-001 | Home | Médio | Skip link `sr-only` com 1x1px (invisível) | ⚠️ Comportamento esperado |
| UX-001 | Home | Médio | 19 cards na Home — sobrecarga cognitiva em crise | 📋 Melhoria futura |
| UX-002 | Home | Baixo | 4.5x viewport de rolagem na Home | 📋 Melhoria futura |
| PERF-001 | vendor-charts | Baixo | Bundle recharts = 381KB (37% do total decodificado) | 📋 Melhoria futura |

---

## DETALHAMENTO DOS PROBLEMAS

---

### BUG-CRIT-001 — Crash em /exercicio/*
**Tela:** `/exercicio/1`, `/exercicio/2`, ..., `/exercicio/12`
**Severidade:** Crítico
**Evidência:** `ReferenceError: useEffect is not defined` no console. Todas as páginas de exercício individuais crashavam com tela branca (ErrorBoundary ativado).

**Motivo técnico:** `Exercicio.tsx` usa `useRef` e `useEffect` para controlar o timer da respiração guiada, mas o import de React só incluía `useState`.

```tsx
// ANTES (quebrado):
import { useState } from "react";

// DEPOIS (corrigido):
import { useState, useRef, useEffect } from "react";
```

**Motivo psicológico:** Pessoa em crise que acessa Exercício de Respiração encontra tela branca. É exatamente o momento em que mais precisa de suporte — o crash pode ser interpretado como rejeição e aumentar o desespero.

**Status:** ✅ Corrigido no commit `afe4e96`

---

### BUG-CRIT-002 — storage.ts incompatível com TypeScript 5.6
**Tela:** Qualquer tela que salva dados (EscalaESJ, Simuladores, CheckIn, etc.)
**Severidade:** Crítico
**Evidência:** TypeScript 5.6 tornou mais estrita a distinção `Uint8Array<ArrayBuffer>` vs `Uint8Array<ArrayBufferLike>`. O `salt` para `crypto.subtle.deriveKey` precisava de tipo explícito.

**Motivo técnico:**
```tsx
// ANTES:
let salt: Uint8Array;
salt = crypto.getRandomValues(new Uint8Array(16));

// DEPOIS:
let salt: Uint8Array<ArrayBuffer>;
salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array<ArrayBuffer>;

// btoa também precisava de correção:
// ANTES: btoa(String.fromCharCode(...combined))
// DEPOIS: btoa(Array.from(combined).map(b => String.fromCharCode(b)).join(""))
```

**Motivo psicológico:** Sem a criptografia funcionando, dados clínicos sensíveis (histórico de escalas, estado emocional) ficam expostos em texto puro no localStorage — violação de privacidade crítica para usuários com vergonha e estigma.

**Status:** ✅ Corrigido no commit `afe4e96`

---

### BUG-CRIT-003 — EscalaESJ tipos null no reduce
**Tela:** `/escala-esj`
**Severidade:** Crítico
**Evidência:** 6 erros TypeScript em `EscalaESJ.tsx`. O `useMemo` com `reduce` inferia tipo `number | null` mas o estado esperava `number`.

**Motivo técnico:**
```tsx
// ANTES:
const pontuacaoAtual = useMemo(
  () => Object.values(respostas).reduce((s, v) => s + (v ?? 0), 0),
  [respostas]
);

// DEPOIS:
const pontuacaoAtual = useMemo<number>(
  () => Object.values(respostas).reduce<number>((s, v) => s + (v ?? 0), 0),
  [respostas]
);
```

**Status:** ✅ Corrigido no commit `afe4e96`

---

### BUG-CRIT-004 — react-hook-form ausente
**Tela:** Todas (impede o build)
**Severidade:** Crítico
**Evidência:** `error TS2307: Cannot find module 'react-hook-form'` em `form.tsx` da shadcn/ui.

**Motivo técnico:** O componente `ui/form.tsx` (original do projeto, não reescrito por nós) depende de `react-hook-form`, mas a dependência não estava no `package.json` simplificado que criamos.

**Correção:** Adicionados ao `package.json`:
```json
"react-hook-form": "^7.64.0",
"@hookform/resolvers": "^5.2.2",
"zod": "^4.1.12"
```

**Status:** ✅ Corrigido no commit `afe4e96`

---

### BUG-CRIT-005 — ErrorBoundary não resetava ao navegar
**Tela:** Qualquer rota após crash em outra
**Severidade:** Crítico
**Evidência:** Ao navegar para `/exercicio/1` (que crashava), o ErrorBoundary ativava. Ao navegar para qualquer outra rota, o ErrorBoundary permanecia com `hasError: true` — mostrando a tela de erro em páginas que funcionavam perfeitamente.

**Motivo técnico:** `ErrorBoundary` é um class component que não observa mudanças de rota automaticamente. Num SPA, a árvore de componentes não é desmontada ao navegar — então `componentDidUpdate` não era chamado.

**Correção:**
```tsx
// ErrorBoundary.tsx — adicionado:
componentDidUpdate(prevProps: Props) {
  if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
    this.setState({ hasError: false, errorId: "" });
  }
}

// App.tsx — adicionado resetKey baseado na rota atual:
function AppRoutes() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      {/* ... */}
    </ErrorBoundary>
  );
}
```

**Status:** ✅ Corrigido no commit `afe4e96`

---

### PSI-001 — "fracasso" em LapsoRecaida
**Tela:** `/lapso-recaida`
**Severidade:** Médio (após análise de contexto)
**Evidência:** A palavra "fracasso" aparece no texto.

**Análise clínica:** O contexto completo é: *"Um lapso não é fracasso. É parte do processo de recuperação para muitas pessoas."* — a palavra aparece numa frase explicitamente protetiva e não-punitiva. A estrutura "X não é Y" é clinicamente correta para desconstruir a crença de fracasso. **Não é necessária correção.**

**Status:** ⚠️ Falso positivo — contexto protetivo adequado

---

### ACES-001 — Skip link com 1x1px
**Tela:** Home
**Severidade:** Médio (técnico) / Baixo (impacto real)
**Evidência:** O skip link `<a href="#main-content">Ir para conteúdo principal</a>` tem dimensões 1x1px quando não está em foco (classe `sr-only`).

**Análise:** Este é o comportamento **correto e esperado** para skip links — invisíveis por padrão, visíveis ao receber foco via teclado (`focus:not-sr-only`). O link existe no DOM, é navegável por teclado e atende WCAG 2.4.1 (nível A). **Não é um bug.**

**Status:** ⚠️ Comportamento esperado — WCAG compliant

---

### UX-001 — 19 cards na Home
**Tela:** Home
**Severidade:** Médio
**Evidência:** A Home exibe 19 ferramentas numa grade. Para usuário em crise aguda (Perfil 1), a quantidade de opções pode gerar paralisia decisória.

**Impacto psicológico:** Pesquisa em psicologia da decisão (Iyengar & Lepper, 2000) mostra que excesso de opções aumenta ansiedade e reduz a probabilidade de agir. Para alguém com TJ em crise, ver 19 botões pode ser tão paralisante quanto ver nenhum.

**Recomendação para v3:**
```
Reorganizar Home em 2 zonas:
1. "Preciso de ajuda agora" (SOS, Modo Crise, Check-in) — 3 botões no topo, visíveis sem scroll
2. "Explorar ferramentas" — 16 cards em seção colapsável abaixo
```

**Status:** 📋 Melhoria planejada para v3

---

### UX-002 — Rolagem excessiva na Home
**Tela:** Home
**Severidade:** Baixo
**Evidência:** Home tem 4.5x a altura da viewport. Em mobile Android intermediário, exige muito scroll para ver todas as ferramentas.

**Recomendação:** Implementar agrupamento por categorias com navegação horizontal (tabs ou chips). Reduz scroll e melhora encontrabilidade.

**Status:** 📋 Melhoria planejada para v3

---

### PERF-001 — recharts bundle pesado
**Tela:** /escala-esj
**Severidade:** Baixo
**Evidência:** `vendor-charts-B3GEfDJS.js` = 381KB decodificado (105KB gzip) — maior chunk individual do app. É carregado apenas quando o usuário acessa `/escala-esj` (lazy loading já implementado).

**Impacto real:** Em 3G lento (~1Mbps), o chunk gzip de 105KB leva ~0.8s para baixar — aceitável e único por sessão (cache). Não afeta o SOS nem a Home.

**Recomendação futura:** Migrar gráficos simples de linha/barra para uma lib mais leve (ex: uPlot, 40KB) ou SVG puro.

**Status:** 📋 Melhoria planejada para v4

---

## TESTES DE PERFIS DE USUÁRIO

### Perfil 1 — Pessoa em crise aguda ✅
- SOS carrega instantaneamente (eager, sem lazy)
- Cronômetro decrementando corretamente (15:00 → 14:59)
- Sem animações pulsantes no botão SOS
- Sem linguagem de urgência artificial
- CVV 188 visível em menos de 2 toques
- Modo Crise acessível da Home e do SOS
- Respiração guiada funcional

### Perfil 2 — Pessoa em recaída recente ✅
- "fracasso" aparece apenas em contexto protetivo ("um lapso não é fracasso")
- Sem mensagens culpabilizadoras
- Autoteste tem buffer emocional antes do resultado
- Resultado de pontuação alta = "Você merece apoio" (não "Você falhou")
- Lapso/Recaída usa metáfora do trem (não-julgadora)

### Perfil 3 — Pessoa com baixa escolaridade ✅
- Sem termos técnicos excessivos nas páginas principais
- Linguagem direta e humana
- Metáforas visuais (trem, balança, farol)
- Menor fonte: 12px (apenas em rodapé de privacidade)
- Nenhum jargão clínico nas páginas de emergência

### Perfil 4 — Pessoa idosa ✅
- Fontes: mínimo 12px, corpo em 14–16px
- Touch targets: mínimo 44px em todos os elementos interativos
- Contraste texto: oklch(0.15 / 0.02 / 50) sobre oklch(0.96 / 0.015 / 75) — ratio > 7:1
- `lang="pt-BR"` presente no HTML
- Skip link funcional via teclado

### Perfil 5 — Android intermediário ✅
- FCP: 596ms (excelente)
- DOM Interactive: 158ms
- Bundle inicial (gzip): ~150KB
- Lazy loading em todas as rotas não-críticas
- SOS e Home: eager (sem lazy), disponíveis mesmo offline parcial

---

## TESTES FUNCIONAIS

| Funcionalidade | Resultado |
|---|---|
| SOS — cronômetro decrementa | ✅ 15:00 → 14:59 em 1s |
| SOS — botões CVV e JA linkados | ✅ tel:188 e tel:+551132291615 |
| Check-in — selecionar estado e salvar | ✅ Toast "registrado" exibido |
| Balança Decisória — salvar motivos | ✅ Toast "Salvo" exibido |
| Simulador — Slot Machine decrementar saldo | ✅ R$100 → R$90 após 1 giro |
| Modo Crise — navegação entre etapas | ✅ Etapa 1 → 2 → 3 → 4 |
| Pequenas Vitórias — registrar conquista | ✅ Categoria selecionável |
| EscalaESJ — criptografia funcional | ✅ Web Crypto disponível (HTTPS) |
| ErrorBoundary — reset ao navegar | ✅ Não propaga crash entre rotas |
| PWA — manifest linkado | ✅ |
| Skip link — presente e funcional | ✅ `sr-only focus:not-sr-only` |
| Rota inexistente — NotFound | ✅ Retorna página 404 |

---

## VERIFICAÇÃO DE ELEMENTOS PROIBIDOS (WCAG psicológico)

| Elemento | Resultado | Detalhes |
|---|---|---|
| Streak / contadores de dias | ✅ Ausente | Zero ocorrências |
| Badges / conquistas por frequência | ✅ Ausente | Zero ocorrências |
| Ranking / comparação social | ✅ Ausente | Zero ocorrências |
| Pontuação acumulativa visível | ✅ Ausente | Autoteste sem número |
| Notificações agressivas | ✅ Ausente | Apenas opt-in |
| Animação pulsante no SOS | ✅ Ausente | `animation: none` |
| Autoplay de áudio/vídeo | ✅ Ausente | Zero elementos autoplay |
| Modal automático ao entrar | ✅ Ausente | Zero modais auto-abertos |
| Linguagem de urgência ("agora!", "corra!") | ✅ Ausente | Zero ocorrências |
| "Você falhou" / "Meta não concluída" | ✅ Ausente | Zero ocorrências |

---

## MÉTRICAS DE PERFORMANCE (produção)

| Métrica | Valor | Alvo | Status |
|---|---|---|---|
| TTFB | 6ms | < 200ms | ✅ |
| FCP | 596ms | < 1.8s | ✅ |
| DOM Interactive | 158ms | < 500ms | ✅ |
| Load Complete | 311ms | < 3s | ✅ |
| Bundle inicial (gzip) | ~150KB | < 500KB | ✅ |
| Bundle total decodificado | 805KB | — | ✅ |
| Recharts chunk (gzip) | 105KB | — | ⚠️ lazy |
| Número de chunks JS | 6 principais | — | ✅ |

---

## PLANO DE CORREÇÃO

### FASE 1 — Críticos (CONCLUÍDA ✅)
Todos os 5 bugs críticos corrigidos no commit `afe4e96` e deployados em produção.

### FASE 2 — Melhorias de UX (v3)
- Reorganizar Home: zona de crise (3 botões) + zona de exploração (colapsável)
- Reduzir rolagem com navegação por categorias

### FASE 3 — Performance (v4)
- Avaliar substituição do recharts por lib mais leve na EscalaESJ
- Implementar Service Worker para cache offline de SOS e Modo Crise

---

## CONCLUSÃO

O app AVB v2 passou na auditoria após as correções aplicadas.

**5 bugs críticos foram encontrados e corrigidos** — todos relacionados a erros de TypeScript que causavam crashes em páginas específicas. O ErrorBoundary estava funcionando corretamente como rede de segurança, mas o bug de reset cascata fazia parecer que mais páginas estavam quebradas do que realmente estavam.

**Do ponto de vista clínico e psicológico**, o app está alinhado com os princípios do `PRINCIPIOS_CLINICOS.md`:
- Zero gamificação prejudicial
- Zero linguagem culpabilizadora
- SOS sempre acessível
- Privacidade protegida por criptografia
- Linguagem acolhedora e não-punitiva em todos os resultados clínicos

**O único problema de UX que merece atenção** é a sobrecarga cognitiva da Home com 19 cards — especialmente para usuários em crise aguda, que precisam de clareza imediata sobre onde clicar. Isso será endereçado na v3.

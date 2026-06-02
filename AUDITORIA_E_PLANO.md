# AUDITORIA COMPLETA + PLANO DE FASES — AVB
### Quando o Jogo Vira Problema
**Data:** Junho 2026 | **Versão auditada:** v3_final (020626)

---

## PARTE 1 — AUDITORIA COMPLETA

### 1.1 BUGS E PROBLEMAS TÉCNICOS

---

#### 🔴 CRÍTICO — BUG-01: Memory leaks em 3 componentes
**Arquivo:** `BalancaDecisoria.tsx`, `Simuladores.tsx`, `SitesBloqueados.tsx`  
**Problema:** `setTimeout` sem `clearTimeout` no cleanup de `useEffect`. Em dispositivos Android com memória limitada, causar re-renders ou navegação antes do timeout disparar cria referências penduradas.  
**Risco técnico:** Crash em Android intermediário (RAM < 3GB)  
**Risco clínico:** App travar durante crise ativa = usuário sem acesso ao SOS  
**Correção:**
```tsx
// Padrão correto — aplicar nos 3 arquivos
const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  timeoutRef.current = setTimeout(() => setSalvo(false), 3000);
  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}, [salvo]);
```

---

#### 🔴 CRÍTICO — BUG-02: localStorage sem criptografia
**Arquivos:** `EscalaESJ.tsx` (2 ocorrências), `Simuladores.tsx` (1 ocorrência)  
**Problema:** Dados clínicos (histórico de escalas, estado emocional do Farol) salvos em texto puro.  
**Risco de segurança:** Em dispositivos compartilhados ou com acesso via DevTools, qualquer pessoa pode ler o histórico clínico do usuário.  
**Risco clínico:** Violação de privacidade de dados de saúde sensíveis.  
**Correção:** Migrar para `saveEncrypted` / `loadEncrypted` do `storage.ts` já gerado.

---

#### 🟠 ALTO — BUG-03: Botões sem aria-label
**Arquivos:** 11 arquivos afetados (Distorcoes, BalancaDecisoria, Exercicio, SOS, Simuladores, LapsoRecaida, Triagem, TCCMindfulness, EscalaESJ, Escala3Cs)  
**Problema:** `<button>` sem `aria-label` é invisível para leitores de tela.  
**Risco de acessibilidade:** Usuários com deficiência visual não conseguem usar o app (WCAG 2.2 — Critério 4.1.2, nível A)  
**Risco clínico:** Exclusão de pessoas com deficiência que também podem ter TJ

---

#### 🟠 ALTO — BUG-04: Autoteste exibe "Possíveis problemas" como título
**Arquivo:** `Autoteste.tsx` linha 53  
**Problema:** Resultado para pontuação 2 usa o título "Possíveis problemas" — linguagem clínica que pode ser percebida como julgamento.  
**Risco clínico:** Aumenta vergonha, pode afastar da busca por ajuda  
**Correção:**
```
"Possíveis problemas" → "Algo merece atenção"
```

---

#### 🟠 ALTO — BUG-05: Autoteste exibe "Impactos significativos" como título
**Arquivo:** `Autoteste.tsx` linha 59  
**Problema:** Título alarmante sem contexto suficiente de acolhimento.  
**Risco clínico:** Linguagem de impacto sem suporte emocional imediato  
**Correção:**
```
"Impactos significativos" → "Sua experiência importa"
```

---

#### 🟡 MÉDIO — BUG-06: Simuladores.tsx tem estados "errou"/"acertou"
**Arquivo:** `Simuladores.tsx` linha 190, 206, 317  
**Problema:** Estado interno nomeado "errou" — apesar de ser técnico, o texto "Errou!" pode aparecer na tela ao usuário.  
**Risco clínico:** Reforça padrão de certo/errado em contexto terapêutico  
**Correção:** Renomear estado para `"derrota"` | `"vitoria"` e revisar textos exibidos

---

#### 🟡 MÉDIO — BUG-07: 8 componentes sem aria em seções
**Arquivos:** Exercicio, Autoteste, Matematica, Distorcoes, LapsoRecaida, TCCMindfulness, JogadoresAnonimos, Organizadores  
**Problema:** `<section>` sem `aria-label` — leitores de tela anunciam como "seção" genérica  
**Risco de acessibilidade:** Navegação confusa para deficientes visuais

---

#### 🟡 MÉDIO — BUG-08: EscalaESJ sem reducão de motion
**Arquivo:** `EscalaESJ.tsx`  
**Problema:** Animações não verificam `prefers-reduced-motion`  
**Risco de acessibilidade:** Pessoas com epilepsia fotossensível ou vertigem

---

#### 🟢 BAIXO — BUG-09: Farol usa localStorage com chave dinâmica
**Arquivo:** `Simuladores.tsx` linha 399  
**Chave:** `avb_farol_${hoje}` — 365 entradas/ano no localStorage  
**Problema:** Sem política de limpeza, acumula dados indefinidamente  
**Risco técnico:** LocalStorage cheio em dispositivos com pouco armazenamento

---

#### 🟢 BAIXO — BUG-10: Triagem exibe "Trilha 3 — Linguagem Clínica"
**Arquivo:** `Triagem.tsx`  
**Problema:** O usuário vê o nome interno da trilha. Pode criar hierarquia percebida entre trilhas.  
**Risco psicológico:** "Linguagem Clínica" pode fazer usuário sentir que está em categoria "mais grave"  
**Correção:** Renomear para algo neutro ou remover o nome da trilha do output ao usuário.

---

### 1.2 PROBLEMAS DE ARQUITETURA

---

#### 🔴 CRÍTICO — ARQ-01: Ausência de AppContext documentado
**Problema:** O `AppContext` é referenciado em múltiplos componentes (`useApp()`) mas não está nos arquivos fornecidos.  
**Risco técnico:** Sem o contexto, qualquer rebuild do projeto falha  
**Ação:** Documentar interface do AppContext e garantir que storage.ts seja integrado

---

#### 🟠 ALTO — ARQ-02: Exercicio.tsx com 518 linhas — violação de SRP
**Problema:** Um único arquivo contém dados de conteúdo (12 exercícios), lógica de estado, lógica de respiração, lógica de salvamento e JSX de renderização.  
**Risco técnico:** Alto acoplamento, difícil manutenção, testes impossíveis  
**Ação:** Refatoração em Fase 2 — separar em `features/exercises/`

---

#### 🟠 ALTO — ARQ-03: Simuladores.tsx com 530 linhas — múltiplos componentes
**Problema:** 3 simuladores distintos (Máquina, Apostas Esportivas, Farol) em 1 arquivo  
**Risco técnico:** Impossível testar unitariamente cada simulador  

---

#### 🟡 MÉDIO — ARQ-04: Ausência de ErrorBoundary
**Problema:** Nenhum componente de captura de erro encontrado  
**Risco técnico:** Qualquer erro não capturado quebra toda a UI  
**Risco clínico:** App branco durante crise = usuário sem acesso ao SOS

---

#### 🟡 MÉDIO — ARQ-05: Rotas novas não registradas
**Problema:** `/checkin`, `/crise`, `/vida-real` foram criadas mas não registradas no router  
**Risco técnico:** 404 ao navegar para as novas páginas

---

### 1.3 PROBLEMAS DE UX

---

#### 🔴 CRÍTICO — UX-01: "Perigo" como opção no Farol do Risco
**Arquivo:** `Simuladores.tsx` linha 383  
**Problema:** A opção "Perigo" usa emoji 🔴 e a palavra "Vontade incontrolável" — linguagem de alta ativação em momento de vulnerabilidade.  
**Risco clínico:** Amplifica a ativação emocional em vez de regulá-la. O usuário já está em crise; nomear como "incontrolável" reforça a percepção de perda de controle.  
**Correção:**
```
"Perigo" + "Vontade incontrolável" 
→ "Momento difícil" + "Estou sentindo um impulso forte agora"
```

---

#### 🟠 ALTO — UX-02: Ausência de HealthyExit nos módulos de exercício
**Problema:** Após salvar exercícios, não há encerramento saudável — o usuário fica "na tela"  
**Risco clínico:** Incentiva uso prolongado sem propósito, pode criar dependência do app  
**Correção:** Integrar `<HealthyExit contexto="exercicio" />` após salvamento

---

#### 🟠 ALTO — UX-03: Home não tem cards para Check-in, Modo Crise e Pequenas Vitórias
**Problema:** As novas páginas existem mas não estão acessíveis pela navegação principal  
**Risco clínico:** O Modo Crise (mais crítico) não está visível na Home

---

#### 🟡 MÉDIO — UX-04: Autoteste exibe pontuação numericamente ao usuário
**Arquivo:** `Autoteste.tsx` linha 194  
**Texto:** `"Pontuação: {pontuacao} de {mostrarQ4 ? 4 : 3}"`  
**Problema:** Números de pontuação em instrumento clínico podem ser mal interpretados  
**Risco psicológico:** "Pontuei 3/4" pode ser interpretado como "fui bem" ou piorar vergonha  
**Correção:** Remover pontuação numérica — manter apenas o texto interpretativo

---

#### 🟡 MÉDIO — UX-05: Exercício 10 (Cálculo de Perdas) sem aviso de conteúdo sensível
**Arquivo:** `Exercicio.tsx` linha 104  
**Problema:** "Calcule quanto dinheiro real você já perdeu" sem preparação emocional prévia  
**Risco clínico:** Confrontar valores de perda financeira sem regulação prévia pode precipitar vergonha aguda e impulso de jogo ("chase")  
**Correção:** Adicionar parágrafo de enquadramento antes do exercício

---

### 1.4 RISCOS PSICOLÓGICOS

---

#### 🔴 CRÍTICO — PSI-01: Exercício 10 sem contenção emocional
**Já descrito em UX-05.** Classificado como crítico pelo risco de precipitar recaída.

---

#### 🟠 ALTO — PSI-02: Distorções.tsx usa "armadilha" e "mais perigosa"
**Arquivo:** `Distorcoes.tsx` linha 31  
**Texto:** "É a armadilha mais perigosa."  
**Risco clínico:** Linguagem de perigo pode ativar hipervigilância e vergonha em vez de curiosidade  
**Correção:** "Esta é uma das mais comuns e difíceis de perceber."

---

#### 🟡 MÉDIO — PSI-03: Autoteste mostra resultado imediatamente após última pergunta
**Problema:** Transição abrupta do estado de reflexão para o estado de julgamento (resultado)  
**Risco clínico:** Sem buffer emocional entre responder e receber resultado  
**Correção:** Adicionar tela intermediária breve ("Um momento...") antes do resultado

---

### 1.5 RISCOS DE ACESSIBILIDADE

| ID | Arquivo | Problema | Critério WCAG | Severidade |
|---|---|---|---|---|
| A-01 | 11 arquivos | Botões sem aria-label | 4.1.2 (A) | 🔴 Crítico |
| A-02 | 8 arquivos | Seções sem aria-label | 1.3.1 (A) | 🟠 Alto |
| A-03 | EscalaESJ | Sem prefers-reduced-motion | 2.3.3 (AAA) | 🟡 Médio |
| A-04 | Todos | Skip link ausente | 2.4.1 (A) | 🟠 Alto |
| A-05 | Exercicio | Textareas sem id/label | 1.3.1 (A) | 🟠 Alto |

---

### 1.6 RISCOS DE PERFORMANCE

| ID | Problema | Impacto | Severidade |
|---|---|---|---|
| P-01 | Sem lazy loading de rotas | Bundle inicial pesado, slow load em 3G | 🟠 Alto |
| P-02 | framer-motion importada completa | ~30KB extra no bundle | 🟡 Médio |
| P-03 | Sem manualChunks no Vite | Vendor bundle não otimizado | 🟡 Médio |
| P-04 | Imagem hero sem width/height | Layout shift (CLS) | 🟡 Médio |
| P-05 | localStorage sync em render | Bloqueia thread principal | 🟢 Baixo |

---

### 1.7 RISCOS DE SEGURANÇA

| ID | Problema | Risco | Severidade |
|---|---|---|---|
| S-01 | localStorage sem crypto (EscalaESJ, Simuladores) | Dados clínicos expostos | 🔴 Crítico |
| S-02 | Sem Content Security Policy | XSS em app futura com server | 🟡 Médio |
| S-03 | Links externos sem rel="noopener noreferrer" | Tabnabbing | 🟡 Médio |
| S-04 | Sem ErrorBoundary | Crash expõe stack trace | 🟡 Médio |

---

## PARTE 2 — PLANO DE EXECUÇÃO POR FASES

---

### FASE 1 — ESTABILIZAÇÃO (Prioridade máxima)

**Objetivo:** App funcional, seguro e sem crashes antes de qualquer nova feature.

#### Ações obrigatórias:

**1.1 Corrigir memory leaks (BUG-01)**
- `BalancaDecisoria.tsx`: adicionar `useRef` + cleanup no `setTimeout`
- `Simuladores.tsx`: corrigir 3 `setTimeout` sem cleanup
- `SitesBloqueados.tsx`: corrigir 1 `setTimeout` sem cleanup

**1.2 Migrar localStorage para storage.ts (BUG-02, S-01)**
- `EscalaESJ.tsx`: substituir 2 ocorrências
- `Simuladores.tsx`: substituir 1 ocorrência
- Verificar demais arquivos do AppContext

**1.3 Corrigir linguagem clínica urgente (BUG-04, BUG-05, PSI-02, UX-01)**
- Autoteste: "Possíveis problemas" → "Algo merece atenção"
- Autoteste: "Impactos significativos" → "Sua experiência importa"
- Farol: "Perigo" + "Vontade incontrolável" → "Momento difícil" + "Estou sentindo um impulso forte"
- Distorções: "mais perigosa" → "das mais comuns e difíceis de perceber"

**1.4 Adicionar ErrorBoundary (ARQ-04, S-04)**
```tsx
// src/components/ErrorBoundary.tsx
// Exibir tela amigável + link para CVV 188 em caso de crash
```

**1.5 Remover pontuação numérica do Autoteste (UX-04)**

**Entregável:** ZIP com os 5 arquivos corrigidos + ErrorBoundary.tsx

---

### FASE 2 — ARQUITETURA

**Objetivo:** Código modular, testável, manutenível.

**2.1 Refatorar Exercicio.tsx**
```
features/exercises/
├── ExercisePage.tsx       (orquestrador — < 80 linhas)
├── ExerciseContent.ts     (dados dos 12 exercícios)
├── ExerciseForm.tsx       (campos de resposta)
├── BreathingExercise.tsx  (respiração guiada)
├── LossCalculator.tsx     (exercício 10 — com aviso clínico)
└── ExerciseContacts.tsx   (contatos no final)
```

**2.2 Refatorar Simuladores.tsx**
```
features/simulators/
├── SimuladoresPage.tsx
├── SlotMachine.tsx
├── SportsBetting.tsx
└── FarolRisco.tsx
```

**2.3 Registrar rotas novas no router**
- `/checkin` → CheckInEmocional
- `/crise` → ModoCrise  
- `/vida-real` → PequenasVitorias

**2.4 Completar integração do AppContext com storage.ts**

---

### FASE 3 — UX SEGURA

**Objetivo:** Remover todos os elementos de UX tóxica. Implementar linguagem acolhedora.

**3.1 Integrar HealthyExit (UX-02)**
- Após salvar cada exercício: `<HealthyExit contexto="exercicio" />`
- Após SOS concluído: `<HealthyExit contexto="sos" />`
- Após check-in: `<HealthyExit contexto="checkin" />`

**3.2 Adicionar cards na Home (UX-03)**
- Card Check-in Emocional → `/checkin`
- Card Modo Crise → `/crise`
- Card Pequenas Vitórias → `/vida-real`

**3.3 Adicionar buffer emocional no Autoteste (PSI-03)**

**3.4 Adicionar aviso clínico no Exercício 10 (PSI-01, UX-05)**
```
"Antes de começar: este exercício usa números reais. 
Se em algum momento ficar difícil, você pode parar quando quiser."
```

**3.5 Corrigir nomeação das trilhas da Triagem (BUG-10)**

---

### FASE 4 — PERFORMANCE

**Objetivo:** App fluido em Android intermediário (Snapdragon 460, RAM 3GB).

**4.1 Lazy loading de rotas**
```tsx
const Simuladores = lazy(() => import("@/pages/Simuladores"));
const EscalaESJ = lazy(() => import("@/pages/EscalaESJ"));
// Todas as rotas menos Home e SOS (críticos — carregar eager)
```

**4.2 Vite manualChunks**
```ts
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        "vendor-react": ["react", "react-dom"],
        "vendor-motion": ["framer-motion"],
        "vendor-ui": ["lucide-react", "sonner"],
        "vendor-router": ["wouter"],
      }
    }
  }
}
```

**4.3 Imagem hero com lazy loading e dimensões fixas**

**4.4 Meta alvo:** bundle principal < 150KB gzip

---

### FASE 5 — ACESSIBILIDADE WCAG AA

**Objetivo:** App utilizável com leitor de tela. Certificação WCAG 2.2 nível AA.

**5.1 aria-label em todos os botões (A-01)**
- Script semi-automático: grep botões sem aria-label + gerar lista de correções

**5.2 aria-label em seções (A-02)**

**5.3 Skip link no layout principal (A-04)**

**5.4 Labels explícitos em todos os inputs/textareas (A-05)**

**5.5 prefers-reduced-motion (A-03)**
```css
@media (prefers-reduced-motion: reduce) {
  .motion-safe-only { display: none; }
}
```

**5.6 Teste com VoiceOver (iOS) e TalkBack (Android)**

---

### FASE 6 — SEGURANÇA

**Objetivo:** Dados clínicos protegidos. App resiliente a erros.

**6.1 Completar migração para storage.ts** (iniciada na Fase 1)

**6.2 rel="noopener noreferrer" em links externos (S-03)**
```tsx
// Grep: <a href="http e adicionar rel em todos
```

**6.3 Content Security Policy** (se app ganhar backend)

**6.4 Crash reporting** (opcional — Sentry com dados anonimizados)

---

### FASE 7 — PWA

**Objetivo:** App instalável no Android sem loja.

**7.1 manifest.json** (já existe parcialmente — completar)
**7.2 Service Worker** com Workbox
**7.3 Offline fallback** para SOS e Modo Crise (críticos)
**7.4 Ícones 192×192 e 512×512**
**7.5 theme-color** para barra de status Android

---

### FASE 8 — MOBILE NATIVO (Expo)

**Objetivo:** App na Play Store com experiência nativa.

**8.1 Estrutura de monorepo**
```
/
├── apps/
│   ├── web/          (React + Vite atual)
│   └── mobile/       (Expo + React Native)
├── packages/
│   └── shared/       (lógica de negócio compartilhada)
```

**8.2 Shared logic**
- `storage.ts` → AsyncStorage no mobile
- Hooks de estado (AppContext) → Zustand compartilhado
- Constantes, textos clínicos → pacote shared

**8.3 Componentes nativos**
- Substituir Tailwind por NativeWind ou StyleSheet
- Substituir framer-motion por Reanimated
- Substituir wouter por Expo Router

---

## PARTE 3 — RESUMO EXECUTIVO

### Matriz de prioridade

| Fase | Prazo estimado | Risco se não feito |
|---|---|---|
| Fase 1 — Estabilização | 1–2 dias | Crash durante crise + dados expostos |
| Fase 2 — Arquitetura | 3–5 dias | Dívida técnica acumulada |
| Fase 3 — UX Segura | 2–3 dias | Dano psicológico a usuários |
| Fase 4 — Performance | 1–2 dias | Abandono em Android básico |
| Fase 5 — Acessibilidade | 2–3 dias | Exclusão de usuários com deficiência |
| Fase 6 — Segurança | 1 dia | Dados clínicos expostos |
| Fase 7 — PWA | 1–2 dias | Fricção de instalação |
| Fase 8 — Mobile | 2–3 semanas | Ausência na Play Store |

### Nota de qualidade atual

| Dimensão | Nota atual | Nota objetivo |
|---|---|---|
| Técnica | 6.5/10 | 9.0/10 |
| Clínica / Linguagem | 7.5/10 | 9.5/10 |
| Acessibilidade | 4.0/10 | 8.5/10 |
| Performance | 6.0/10 | 8.5/10 |
| Segurança | 5.5/10 | 9.0/10 |
| UX / Design | 8.0/10 | 9.0/10 |

**Nota composta atual:** 6.2/10  
**Nota objetivo (pós Fase 6):** 9.0/10

---

## PRÓXIMO PASSO IMEDIATO

**Executar Fase 1 agora:**  
Gerar ZIP com os arquivos corrigidos de:
1. BalancaDecisoria.tsx (memory leak)
2. Simuladores.tsx (memory leak + linguagem)
3. SitesBloqueados.tsx (memory leak)
4. EscalaESJ.tsx (localStorage → storage.ts)
5. Autoteste.tsx (linguagem clínica)
6. ErrorBoundary.tsx (novo)

Confirme para iniciar a Fase 1.

# UX HEALTH GUARDRAILS — AVB
### Quando o Jogo Vira Problema
**Versão:** 1.0  
**Baseado em:** WHO Digital Health Guidelines · OWASP · WCAG 2.2 · NHS Digital Mental Health Standards

---

## 1. PROIBIÇÕES DE UX TÓXICA

### 1.1 Padrões completamente proibidos

| Padrão | Nome técnico | Por que é proibido |
|---|---|---|
| Contador de dias sem jogar | Streak | Quebra = vergonha amplificada + risco de recaída |
| Perda de progresso por inatividade | Loss aversion trap | Replica o mecanismo de "chase" das apostas |
| "X pessoas estão usando agora" | Social proof coercitivo | Cria pressão de comparação |
| "Você está atrasado" | FOMO trigger | Ativa ansiedade — o oposto do objetivo terapêutico |
| Pop-ups na saída do app | Exit intent | Remove autonomia, gera culpa |
| Notificações diárias obrigatórias | Push compulsório | Cria dependência comportamental do app |
| Vibração + som sem ação do usuário | Surprise notification | Pode ser gatilho de ativação |
| Barra de progresso que "zera" | Progress regression | Replica mecânica de cassino (perda de crédito) |
| Pontuação acumulativa visível | Gamification score | Substitui jogo por comportamento compulsivo similar |
| Comparação com outros usuários | Leaderboard | Ativa vergonha e competição disfuncional |

### 1.2 Padrões de design que replicam apostas

**PROIBIDOS em qualquer parte do app:**
- Animações com "spinning" (roda, slot)
- Sons de moedas, vitória ou "jackpot"
- Números que aumentam rapidamente (contagem animada)
- Cores red/green piscando para vitória/derrota
- Confetes excessivos em "conquistas"
- "Bônus" por voltar ao app

---

## 2. PROIBIÇÕES DE GAMIFICAÇÃO NOCIVA

### 2.1 O que nunca implementar

```
❌ XP / Experience Points
❌ Levels / Níveis de usuário
❌ Badges / Conquistas por frequência
❌ Streaks / Sequências
❌ Rankings / Leaderboards
❌ Daily challenges / Desafios diários com punição
❌ "Missões" com prazo
❌ Moeda virtual interna
❌ Loot boxes / Surpresas aleatórias
❌ Social comparison ("Você está no top X%")
```

### 2.2 O que é permitido (gamificação saudável limitada)

```
✅ Registro histórico de check-ins (SEM streaks)
✅ Listas de Pequenas Vitórias (SEM pontuação)
✅ Progresso visual dentro de uma sessão (ex: etapa 2 de 4)
✅ Indicadores de conclusão de exercício (sem acumulação)
✅ Feedback positivo não condicional ("Você fez o suficiente")
```

**Regra de ouro:** Qualquer elemento de progresso deve ser informativo, não motivacional por medo de perder.

---

## 3. REGRAS PARA NOTIFICAÇÕES

### 3.1 Política geral
- Notificações são **opt-in explícito** — nunca habilitadas por padrão
- O usuário pode desabilitar sem perder funcionalidades
- Nunca enviar notificação em horário de risco (22h–8h, fins de semana)

### 3.2 Notificações permitidas

| Tipo | Formato | Frequência máxima |
|---|---|---|
| Lembrete de recurso | "Suas ferramentas estão disponíveis." | 1x/semana, opt-in |
| Crise ativa (usuário iniciou) | "CVV 188 disponível 24h." | Sem limite, contexto de crise |
| Confirmação de ação | "Check-in salvo." | Por ação, in-app apenas |

### 3.3 Notificações proibidas

```
❌ "Você não usa o app há X dias!"
❌ "Sua sequência vai acabar!"
❌ "Não perca seu progresso!"
❌ "Outros usuários completaram X exercícios hoje"
❌ Qualquer notificação com urgência temporal
❌ Notificações push sem consentimento explícito
```

### 3.4 Linguagem de notificações
- Tom: informativo e acolhedor
- Sem exclamações múltiplas
- Sem emojis de alerta (⚠️🚨) em notificações push
- Máximo 60 caracteres no título

---

## 4. REGRAS PARA LINGUAGEM

### 4.1 Tom de voz

**Persona do app:** Um profissional de saúde acolhedor, que fala com clareza e sem julgamento. Como um bom médico de família — direto, humano, não condescendente.

### 4.2 Tabela de substituições obrigatórias

| Proibido | Obrigatório |
|---|---|
| "Você falhou" | "Este foi um momento difícil" |
| "Você perdeu" | "Isso aconteceu" |
| "Meta não concluída" | (remover o conceito de meta) |
| "Tente mais" | "Você pode tentar quando quiser" |
| "Você precisa fazer X" | "Você pode tentar X" |
| "Faça agora" | "Quando se sentir pronto" |
| "Sinais graves" | "Você merece apoio especializado" |
| "Urgente" (em resultados) | "Buscar apoio pode ajudar muito agora" |
| "Você ainda não fez X" | (remover) |
| "Parabéns por X dias!" | (remover contador) |
| "Continue assim!" | "Obrigado por estar aqui" |
| "Nível de risco alto" | (usar linguagem descritiva, não hierárquica) |

### 4.3 Regras gramaticais de acolhimento

1. **Nunca culpar o passado.** Usar presente ou futuro.
2. **Sempre oferecer saída.** Toda instrução tem alternativa.
3. **Usar "pode" em vez de "deve".** Autonomia sobre obrigação.
4. **Separar a pessoa do comportamento.** "O jogo tem impactos" ≠ "Você tem um problema grave."
5. **Validar antes de orientar.** "Isso é difícil" antes de "aqui está o que fazer."

### 4.4 Revisão clínica de textos
Todo texto novo deve passar por checklist:
- [ ] Implica julgamento moral? → Reescrever
- [ ] Cria pressão temporal? → Remover
- [ ] Compara com padrão externo? → Remover
- [ ] Implica que o usuário falhou? → Reescrever
- [ ] Estimula retorno imediato ao app? → Remover

---

## 5. REGRAS DE ACESSIBILIDADE

### 5.1 WCAG 2.2 — Nível AA (obrigatório)

| Critério | Implementação |
|---|---|
| Contraste 4.5:1 para texto normal | Verificar com oklch values — manter foreground sobre background |
| Contraste 3:1 para texto grande (>18px bold) | Revisar títulos sobre fundos coloridos |
| Área de toque mínima 44×44px | `min-h-[44px]` em todos os botões interativos |
| Foco visível | `focus:ring-2 focus:ring-primary/50` em todos os elementos |
| Skip link | `<a href="#main-content">Ir para conteúdo</a>` no topo |
| Labels explícitos | Nunca usar placeholder como único label |
| Navegação por teclado | Tab order lógico em todos os formulários |
| Leitores de tela | `aria-label` em todos os ícones e botões sem texto visível |
| Movimento reduzido | `prefers-reduced-motion` respeitar em todas as animações |

### 5.2 Acessibilidade emocional
- Sem tempo limite em exercícios (pessoa com ansiedade precisa de tempo)
- Sem modal que bloqueia toda a tela indefinidamente
- Sem autoplay de áudio
- Leitura em voz alta (PageAudioWrapper) sempre opt-in

---

## 6. ESTADOS EMOCIONAIS DA INTERFACE

O app reconhece 4 estados emocionais do usuário e adapta a UX:

| Estado | Indicador | Resposta da UI |
|---|---|---|
| **Estável** | Uso normal, sem crise | Interface completa, todos os módulos |
| **Alerta** | Farol amarelo, check-in "preocupado/ansioso" | Destacar SOS e Modo Crise, reduzir densidade de informação |
| **Crise** | Farol vermelho, check-in "vontade de jogar" | Priorizar SOS, Modo Crise e contatos de emergência |
| **Pós-lapso** | Exercício 9, LapsoRecaida | Linguagem explicitamente não-punitiva, foco em aprendizado |

---

## 7. POLÍTICA DE DADOS E PRIVACIDADE

- **Zero dados no servidor:** todos os dados clínicos ficam no dispositivo
- **Criptografia:** localStorage via Web Crypto API (AES-256-GCM)
- **Sem analytics comportamentais:** nenhum rastreamento de uso para fins de retenção
- **Sem compartilhamento:** nenhum dado é transmitido a terceiros
- **Transparência:** informar ao usuário sobre armazenamento local em todos os módulos de salvamento

---

## 8. CHECKLIST PRÉ-LANÇAMENTO

### UX Safety
- [ ] Nenhum streak implementado
- [ ] Nenhum ranking ou pontuação visível ao usuário
- [ ] Notificações opt-in apenas
- [ ] HealthyExit presente em todos os módulos que salvam dados
- [ ] CVV 188 acessível em menos de 2 toques a partir de qualquer tela
- [ ] Modo Crise linkado do SOS e da Home

### Linguagem
- [ ] Todos os resultados de escala revisados por psicólogo
- [ ] Nenhum texto usa "falhou", "perdeu", "urgente" sem contexto médico
- [ ] Textos de onboarding validados clinicamente

### Acessibilidade
- [ ] Contraste verificado em todas as telas
- [ ] Todos os botões têm `aria-label`
- [ ] Navegação por teclado testada
- [ ] `prefers-reduced-motion` implementado

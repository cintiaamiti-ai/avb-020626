# Quando o Jogo Vira Problema — AVB v2

**Versão:** 2.0.0 | **Data:** 02/06/2026

Aplicativo de apoio psicoeducativo para pessoas com Transtorno do Jogo (TJ) e seus familiares.

## Sobre

Iniciativa de saúde pública da **Associação Viver Bem** (@proamiti), com coordenação científica do **Dr. Hermano Tavares** (CRM-SP 75.471) — Instituto de Psiquiatria HC-FMUSP, Ambulatório PRO-AMITI.

## O que há de novo na v2

- ✅ Criptografia AES-256-GCM para todos os dados clínicos (`storage.ts`)
- ✅ Check-in Emocional (`/checkin`)
- ✅ Modo Crise — desescalonamento passo a passo (`/crise`)
- ✅ Pequenas Vitórias — vida além do jogo (`/vida-real`)
- ✅ HealthyExit — encerramento saudável em todos os módulos
- ✅ ErrorBoundary com fallback seguro + CVV sempre visível
- ✅ Lazy loading de todas as rotas (performance Android)
- ✅ Linguagem clínica revisada (sem "Sinais graves", "urgente", "Incontrolável")
- ✅ Skip links e WCAG AA em todos os componentes novos
- ✅ PWA instalável com shortcuts para SOS e Modo Crise
- ✅ Memory leaks corrigidos em BalancaDecisoria, Simuladores, SitesBloqueados

## Instalação

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run check        # TypeScript check
npm run lint         # ESLint
npm run test         # Testes Vitest
npm run test:coverage # Cobertura
```

## Documentação clínica

- `PRINCIPIOS_CLINICOS.md` — Fundamentos clínicos e proibições
- `UX_HEALTH_GUARDRAILS.md` — Regras de UX segura
- `DESIGN_SYSTEM.md` — Sistema de design completo
- `AUDITORIA_E_PLANO.md` — Auditoria + plano de fases

## Dados e privacidade

Todos os dados são salvos **apenas no dispositivo do usuário** usando Web Crypto API (AES-256-GCM). Nenhuma informação é coletada ou enviada a servidores.

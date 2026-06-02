# DESIGN SYSTEM — AVB
### Quando o Jogo Vira Problema
**Versão:** 1.0  
**Estilo visual:** Cordel Digital Brasileiro  
**Referências de UX:** Headspace · Calm · Finch · NHS App

---

## 1. CONCEITO VISUAL

### 1.1 Metáfora de design
**Cordel Digital** — literatura de cordel nordestina: xilogravura, cores terrosas, bordas expressivas, tipografia forte, narrativa direta. Um produto popular, acessível, que não tenta ser sofisticado mas é genuinamente humano.

### 1.2 Princípios visuais
1. **Calor sem infantilização** — cores quentes, não pastéis bebes
2. **Borda como estrutura** — bordas 2–3px sólidas organizam sem engessar
3. **Sombra como profundidade** — `shadow-[3px_3px_0]` cria presença física
4. **Espaço como respiração** — padding generoso reduz sobrecarga cognitiva
5. **Contraste a serviço da clareza** — não da urgência

---

## 2. CORES

### 2.1 Sistema de cores (oklch)

```css
/* Fundo e superfícies */
--background:         oklch(0.96 0.015 75);   /* creme quente */
--foreground:         oklch(0.15 0.02 50);    /* quase-preto terroso */
--muted:              oklch(0.90 0.015 75);   /* superfície sutil */
--muted-foreground:   oklch(0.55 0.02 75);   /* texto secundário */

/* Brand */
--primary:            oklch(0.45 0.18 50);   /* laranja terracota */
--primary-foreground: oklch(0.98 0.005 75);

/* Ações secundárias */
--secondary:          oklch(0.50 0.14 310);  /* lilás escuro */
--secondary-foreground: oklch(0.98 0.005 75);

/* Acento terapêutico (verde) */
--accent:             oklch(0.50 0.14 155);  /* verde escuro */
--accent-foreground:  oklch(0.98 0.005 75);

/* Emergência (vermelho) */
--destructive:        oklch(0.50 0.20 25);   /* vermelho terroso */
--destructive-foreground: oklch(0.98 0.005 75);

/* UI */
--border:             oklch(0.82 0.02 75);
--input:              oklch(0.92 0.02 75);
--ring:               oklch(0.45 0.18 50);
```

### 2.2 Paleta de estados emocionais

| Estado | Cor oklch | Uso |
|---|---|---|
| Estável / positivo | `oklch(0.50 0.14 155)` | Accent verde — confirmações, sucesso |
| Atenção | `oklch(0.55 0.14 60)` | Amarelo ocre — alertas moderados |
| Crise | `oklch(0.50 0.20 25)` | Destructive — SOS, emergência |
| Informativo | `oklch(0.45 0.15 240)` | Azul escuro — dados, escala |
| Neutro | `oklch(0.92 0.02 75)` | Muted — fundos de card |

### 2.3 Regras de uso de cor

- **Vermelho/destructive** só em: botão SOS, contatos de emergência, alertas de crise ativa
- **Nunca usar vermelho** para: resultados de escalas, feedback de "erro" em exercícios
- **Verde/accent** para: confirmações, progresso positivo, vitórias
- **Amarelo** para: alertas neutros, estados de atenção não urgentes

---

## 3. TIPOGRAFIA

### 3.1 Famílias

```css
/* Display / Títulos */
font-family: 'Cardo', Georgia, serif;
/* Classe Tailwind: sem classe — é o default (h1, h2, h3) */

/* Corpo / Interface */
font-family: 'IBM Plex Sans', system-ui, sans-serif;
/* Classe Tailwind: font-body */
```

**Justificativa:**
- `Cardo` (serif humanista): evoca literatura, cuidado, permanência — não tecnologia fria
- `IBM Plex Sans`: alta legibilidade, disponível offline via Google Fonts, excelente em baixa resolução Android

### 3.2 Escala tipográfica

| Uso | Classe Tailwind | Tamanho | Peso |
|---|---|---|---|
| Título de página | `text-2xl sm:text-3xl` | 24–30px | 700 (serif) |
| Título de seção | `text-xl` | 20px | 600 (serif) |
| Título de card | `text-lg` | 18px | 600 (serif) |
| Corpo principal | `font-body text-base` | 16px | 400 |
| Corpo secundário | `font-body text-sm` | 14px | 400 |
| Caption / Aviso | `font-body text-xs` | 12px | 400 |
| Label de botão | `font-body font-bold text-sm` | 14px | 700 |

### 3.3 Regras
- **Mínimo 16px** para corpo de texto clínico
- **Mínimo 14px** para qualquer texto interativo
- **Nunca abaixo de 12px** — exceto metadados não críticos
- **Line-height mínimo 1.5** para parágrafos

---

## 4. COMPONENTES

### 4.1 Card (`.card-cordel`)

```css
/* Definição base */
.card-cordel {
  background: var(--background);
  border: 2px solid var(--foreground);
  border-radius: 0.5rem;        /* rounded-lg */
  box-shadow: 3px 3px 0 var(--foreground);
}
```

**Variantes:**
```tsx
// Card neutro
<div className="card-cordel p-6">

// Card de alerta suave
<div className="card-cordel p-6 bg-[oklch(0.55_0.14_60/0.08)] border-[oklch(0.55_0.14_60)]">

// Card de crise
<div className="card-cordel p-6 bg-[oklch(0.50_0.2_25/0.08)] border-destructive">

// Card de sucesso
<div className="card-cordel p-6 bg-[oklch(0.50_0.14_155/0.08)] border-accent">
```

### 4.2 Botão primário

```tsx
<button className="
  px-6 py-3
  bg-primary text-primary-foreground
  font-body font-bold
  border-2 border-foreground
  rounded-md
  shadow-[3px_3px_0_oklch(0.15_0.02_50)]
  hover:translate-x-[-2px] hover:translate-y-[-2px]
  hover:shadow-[5px_5px_0_oklch(0.15_0.02_50)]
  transition-all
  min-h-[44px]
  focus:ring-2 focus:ring-primary/50 focus:outline-none
">
```

### 4.3 Botão SOS (emergência)

```tsx
// Regra: NUNCA animar com pulse/bounce — não deve criar urgência adicional
<Link href="/sos" className="
  inline-flex items-center gap-2
  px-6 py-3
  bg-destructive text-destructive-foreground
  font-body font-bold
  border-2 border-foreground
  rounded-md
  shadow-[3px_3px_0_oklch(0.15_0.02_50)]
  hover:translate-x-[-2px] hover:translate-y-[-2px]
  hover:shadow-[5px_5px_0_oklch(0.15_0.02_50)]
  transition-all
">
```

### 4.4 Input / Textarea

```tsx
<textarea className="
  w-full p-3
  font-body text-sm
  border-2 border-foreground
  rounded-md
  bg-background
  resize-none
  focus:ring-2 focus:ring-primary/50 focus:outline-none
  min-h-[44px]
" />
```

### 4.5 Link de retorno

```tsx
<Link href="/" className="
  inline-flex items-center gap-2
  text-sm font-body
  text-muted-foreground
  hover:text-foreground
  transition-colors
">
  <ArrowLeft className="w-4 h-4" />
  Voltar ao início
</Link>
```

### 4.6 Aviso de privacidade (obrigatório em módulos que salvam dados)

```tsx
<p className="font-body text-xs text-muted-foreground text-center mt-6">
  Seus dados ficam salvos apenas no seu dispositivo. Ninguém mais tem acesso.
</p>
```

---

## 5. ACESSIBILIDADE — IMPLEMENTAÇÃO

### 5.1 Padrão de botão acessível

```tsx
<button
  onClick={handler}
  aria-label="Descrição clara da ação"
  aria-pressed={isSelected}      // para toggles
  aria-expanded={isOpen}         // para expandir/colapsar
  className="... min-h-[44px]"
>
  <Icon aria-hidden="true" />
  Texto visível
</button>
```

### 5.2 Padrão de seção acessível

```tsx
<section aria-label="Nome descritivo da seção">
  <h2>Título</h2>
  {/* conteúdo */}
</section>
```

### 5.3 Movimento reduzido

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5.4 Skip link (obrigatório no layout principal)

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
>
  Ir para conteúdo principal
</a>
```

---

## 6. ESTADOS DE INTERFACE

### 6.1 Loading

```tsx
// Nunca usar spinner que gire infinitamente — pode ser ansioso para o usuário
// Usar skeleton screens ou texto simples
<div className="animate-pulse bg-muted rounded-md h-6 w-3/4" />
```

### 6.2 Feedback de salvamento

```tsx
// Nunca usar celebração excessiva
// Toast simples via sonner:
toast.success("Salvo.", {
  description: "Seus dados ficam apenas no seu dispositivo.",
});
```

### 6.3 Estado vazio

```tsx
// Informativo, nunca "culpante"
<div className="text-center py-8 font-body text-sm text-muted-foreground">
  Nenhum registro ainda. Quando quiser, pode começar aqui.
</div>
```

### 6.4 Erro

```tsx
// Tom neutro, nunca "você fez algo errado"
<div className="p-4 bg-muted rounded-md border border-foreground/20">
  <p className="font-body text-sm">
    Algo não funcionou como esperado. Tente novamente quando quiser.
  </p>
</div>
```

---

## 7. MOTION / ANIMAÇÃO

### 7.1 Regras de motion

| Contexto | Animação permitida | Proibido |
|---|---|---|
| Entrada de página | `opacity: 0→1, y: 20→0, duration: 0.4s` | Slide horizontal brusco |
| Card de crise | `opacity: 0→1, scale: 0.97→1` | Pulse, bounce, shake |
| Feedback positivo | `scale: 0.97→1, opacity` | Confetes excessivos |
| Progresso in-step | Barra linear suave | Spinning, contagem rápida |
| Botão hover | `translate: -2px -2px, shadow +2px` | Flash, glow pulsante |

### 7.2 Valores de referência (framer-motion)

```tsx
// Entrada padrão de página
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: "easeOut" }}

// Entrada de card com delay
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ delay: index * 0.07 }}
```

---

## 8. LAYOUT

### 8.1 Container

```tsx
<div className="container py-8">
  {/* max-width automático pelo container */}
  <div className="max-w-lg mx-auto">
    {/* conteúdo de página simples */}
  </div>
</div>
```

### 8.2 Grid de ferramentas (Home)

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

### 8.3 Espaçamento

| Elemento | Padrão |
|---|---|
| Espaço entre seções | `mb-8` ou `py-12` |
| Espaço interno de card | `p-5` ou `p-6` |
| Espaço entre itens de lista | `space-y-3` |
| Espaço entre label e input | `mb-2` |

---

## 9. ÍCONES

- **Biblioteca:** Lucide React (tree-shakeable, consistente)
- **Tamanho padrão:** `w-5 h-5` em UI, `w-6 h-6` em cards, `w-4 h-4` em inline
- **Sempre:** `aria-hidden="true"` quando acompanham texto
- **Cor:** herda do texto pai — não colorir ícones arbitrariamente

---

## 10. RESPONSIVIDADE

| Breakpoint | Uso |
|---|---|
| `base` (< 640px) | Mobile Android — layout principal |
| `sm` (≥ 640px) | Tablet / iOS |
| `lg` (≥ 1024px) | Desktop web |

**Regra:** mobile first. Cada componente deve ser testado em 375px (Android intermediário) antes de qualquer outro breakpoint.

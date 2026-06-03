import { lazy, Suspense } from "react";
import { useLocation } from "wouter";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

// FASE 4 — P-01: lazy loading de todas as rotas exceto Home e SOS (críticos)
// Home e SOS carregam eager para garantir acesso imediato mesmo em conexão lenta
import Home from "@/pages/Home";
import SOS from "@/pages/SOS";

// Rotas lazyficadas — carregam apenas quando necessário
const Triagem = lazy(() => import("@/pages/Triagem"));
const Exercicios = lazy(() => import("@/pages/Exercicios"));
const Exercicio = lazy(() => import("@/pages/Exercicio"));
const Autoteste = lazy(() => import("@/pages/Autoteste"));
const EscalaESJ = lazy(() => import("@/pages/EscalaESJ"));
const Escala3Cs = lazy(() => import("@/pages/Escala3Cs"));
const Distorcoes = lazy(() => import("@/pages/Distorcoes"));
const TCCMindfulness = lazy(() => import("@/pages/TCCMindfulness"));
const Matematica = lazy(() => import("@/pages/Matematica"));
const LapsoRecaida = lazy(() => import("@/pages/LapsoRecaida"));
const Autoexclusao = lazy(() => import("@/pages/Autoexclusao"));
const RedeApoio = lazy(() => import("@/pages/RedeApoio"));
const JogadoresAnonimos = lazy(() => import("@/pages/JogadoresAnonimos"));
const BalancaDecisoria = lazy(() => import("@/pages/BalancaDecisoria"));
const SitesBloqueados = lazy(() => import("@/pages/SitesBloqueados"));
const Simuladores = lazy(() => import("@/pages/Simuladores"));
const Organizadores = lazy(() => import("@/pages/Organizadores"));

// FASE 3 — Novas rotas
const CheckInEmocional = lazy(() => import("@/pages/CheckInEmocional"));
const ModoCrise = lazy(() => import("@/pages/ModoCrise"));
const PequenasVitorias = lazy(() => import("@/pages/PequenasVitorias"));

const NotFound = lazy(() => import("@/pages/NotFound"));

// Fallback de loading — simples, sem spinner ansioso
function PageLoading() {
  return (
    <div
      className="flex-1 flex items-center justify-center py-20"
      role="status"
      aria-label="Carregando página"
    >
      <p className="font-body text-sm text-muted-foreground">Carregando...</p>
    </div>
  );
}

function AppRoutes() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <Suspense fallback={<PageLoading />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sos" component={SOS} />
          <Route path="/triagem" component={Triagem} />
          <Route path="/exercicios" component={Exercicios} />
          <Route path="/exercicio/:id" component={Exercicio} />
          <Route path="/autoteste" component={Autoteste} />
          <Route path="/escala-esj" component={EscalaESJ} />
          <Route path="/escala-3cs" component={Escala3Cs} />
          <Route path="/distorcoes" component={Distorcoes} />
          <Route path="/tcc-mindfulness" component={TCCMindfulness} />
          <Route path="/matematica" component={Matematica} />
          <Route path="/lapso-recaida" component={LapsoRecaida} />
          <Route path="/autoexclusao" component={Autoexclusao} />
          <Route path="/rede-apoio" component={RedeApoio} />
          <Route path="/jogadores-anonimos" component={JogadoresAnonimos} />
          <Route path="/balanca-decisoria" component={BalancaDecisoria} />
          <Route path="/sites-bloqueados" component={SitesBloqueados} />
          <Route path="/simuladores" component={Simuladores} />
          <Route path="/organizadores" component={Organizadores} />
          {/* FASE 3 — Novas rotas */}
          <Route path="/checkin" component={CheckInEmocional} />
          <Route path="/crise" component={ModoCrise} />
          <Route path="/vida-real" component={PequenasVitorias} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Toaster richColors closeButton />
    </ErrorBoundary>
  );
}

export default function App() {
  return <AppRoutes />;
}

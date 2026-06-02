import { Component, type ErrorInfo, type ReactNode } from "react";
import { Phone, Users, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorId: string;
}

/**
 * ErrorBoundary
 *
 * Captura qualquer erro não tratado na árvore de componentes.
 * Exibe fallback amigável com acesso ao CVV 188 e JA.
 * Nunca expõe stack trace ao usuário.
 *
 * FASE 1 — ARQ-04 / S-04
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorId: "" };
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
      errorId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log interno — sem enviar dados ao servidor
    console.error("[AVB ErrorBoundary]", {
      message: error.message,
      componentStack: info.componentStack,
    });
  }

  handleReload = () => {
    this.setState({ hasError: false, errorId: "" });
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full">
          <div className="card-cordel p-8 text-center">
            <p className="text-4xl mb-4" aria-hidden="true">🌿</p>
            <h1 className="text-xl mb-3">Algo não funcionou como esperado</h1>
            <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
              O app encontrou um problema. Seus dados continuam salvos no dispositivo.
              Tente recarregar a página.
            </p>

            {/* Contatos de emergência — sempre acessíveis mesmo em crash */}
            <div className="card-cordel p-4 mb-6 bg-[oklch(0.50_0.14_155/0.07)] border-accent/40 text-left">
              <p className="font-body text-xs font-semibold mb-3">
                Se você precisar de apoio agora:
              </p>
              <div className="space-y-2">
                <a
                  href="tel:188"
                  className="flex items-center gap-3 p-3 bg-background rounded-md border border-foreground/20 hover:bg-muted transition-colors"
                  aria-label="Ligar para o CVV: 188 — apoio emocional 24 horas"
                >
                  <Phone className="w-4 h-4 text-destructive shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-body font-bold text-sm">CVV — 188</p>
                    <p className="font-body text-xs text-muted-foreground">24h · Gratuito · Sigiloso</p>
                  </div>
                </a>
                <a
                  href="tel:+551132291615"
                  className="flex items-center gap-3 p-3 bg-background rounded-md border border-foreground/20 hover:bg-muted transition-colors"
                  aria-label="Ligar para Jogadores Anônimos: 11 3229-1615"
                >
                  <Users className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-body font-bold text-sm">Jogadores Anônimos — (11) 3229-1615</p>
                    <p className="font-body text-xs text-muted-foreground">Gratuito · Sigiloso</p>
                  </div>
                </a>
              </div>
            </div>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-bold border-2 border-foreground rounded-md shadow-[3px_3px_0_oklch(0.15_0.02_50)] hover:opacity-90 transition-opacity"
              aria-label="Recarregar o aplicativo"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Recarregar
            </button>

            <p className="font-body text-xs text-muted-foreground mt-4">
              Código do erro: {this.state.errorId}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

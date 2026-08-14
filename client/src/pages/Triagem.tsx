import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, CheckCircle2, HelpCircle } from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";
import { AudioButtonInline } from "@/components/AudioPlayer";

const TRIAGEM_AUDIO_TEXT = `Triagem Adaptativa. Responda algumas perguntas para personalizarmos sua experiência. São 5 perguntas rápidas sobre sua família. Usamos o Critério ABEP, validado em pesquisas de saúde no Brasil, para adaptar a linguagem do app ao seu contexto de vida.`;

// C-06: campo dica em cada pergunta
const perguntas = [
  {
    id: "escolaridade",
    titulo: "Qual a escolaridade do chefe da família?",
    dica: "Pode ser você mesmo, seu cônjuge ou quem traz mais dinheiro para casa. Escolha o nível mais próximo.",
    opcoes: [
      { label: "Analfabeto / Fundamental I incompleto", pontos: 0 },
      { label: "Fundamental I completo / Fundamental II incompleto", pontos: 1 },
      { label: "Fundamental II completo / Médio incompleto", pontos: 2 },
      { label: "Médio completo / Superior incompleto", pontos: 4 },
      { label: "Superior completo", pontos: 7 },
    ],
  },
  {
    id: "banheiros",
    titulo: "Quantos banheiros tem na sua casa?",
    dica: "Conte apenas banheiros com vaso sanitário, pia e chuveiro. Lavabos (só com pia e vaso) não contam.",
    opcoes: [
      { label: "Nenhum", pontos: 0 },
      { label: "1", pontos: 3 },
      { label: "2", pontos: 7 },
      { label: "3 ou mais", pontos: 10 },
    ],
  },
  {
    id: "automoveis",
    titulo: "Quantos automóveis tem na família?",
    dica: "Inclua carros próprios ou financiados. Não inclua motos, caminhões ou veículos de trabalho.",
    opcoes: [
      { label: "Nenhum", pontos: 0 },
      { label: "1", pontos: 3 },
      { label: "2 ou mais", pontos: 6 },
    ],
  },
  {
    id: "empregados",
    titulo: "Tem empregada doméstica mensalista?",
    dica: "Conta apenas se trabalha regularmente todos os meses. Diaristas eventuais não entram nessa conta.",
    opcoes: [
      { label: "Não", pontos: 0 },
      { label: "1", pontos: 3 },
      { label: "2 ou mais", pontos: 6 },
    ],
  },
  {
    id: "internet",
    titulo: "Tem acesso à internet em casa?",
    dica: "Pode ser via cabo, wi-fi fixo ou dados móveis com plano mensal.",
    opcoes: [
      { label: "Não", pontos: 0 },
      { label: "Sim", pontos: 4 },
    ],
  },
];

function calcularNivel(pontos: number): "DE" | "C" | "AB" {
  if (pontos <= 8) return "DE";
  if (pontos <= 20) return "C";
  return "AB";
}

export default function Triagem() {
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [concluido, setConcluido] = useState(false);
  // C-06: estado para mostrar/esconder dica
  const [mostrarDica, setMostrarDica] = useState(false);
  const { setNivelABEP, completarTriagem } = useApp();
  const [, navigate] = useLocation();

  const perguntaAtual = perguntas[etapa];
  const totalPontos = Object.values(respostas).reduce((a, b) => a + b, 0);

  const handleResposta = (pontos: number) => {
    const novasRespostas = { ...respostas, [perguntaAtual.id]: pontos };
    setRespostas(novasRespostas);
    setMostrarDica(false); // resetar dica ao avançar

    if (etapa < perguntas.length - 1) {
      setEtapa(etapa + 1);
    } else {
      const total = Object.values(novasRespostas).reduce((a, b) => a + b, 0);
      const nivel = calcularNivel(total);
      setNivelABEP(nivel);
      completarTriagem();
      setConcluido(true);
    }
  };

  const nivelDescricao = {
    DE: {
      titulo: "Direto ao ponto",
      descricao: "Vamos usar palavras simples e exemplos do dia a dia. Foco no que importa: sua família, suas contas, sua paz.",
      cor: "bg-secondary",
    },
    C: {
      titulo: "Com exemplos e explicações",
      descricao: "Vamos usar analogias e explicações claras para você entender o que acontece no seu cérebro e como retomar o controle.",
      cor: "bg-primary",
    },
    AB: {
      titulo: "Com base em evidências",
      descricao: "Vamos abordar os mecanismos cognitivos, a ilusão do investimento e estratégias baseadas em evidências para sua recuperação.",
      cor: "bg-accent",
    },
  };

  if (concluido) {
    const nivel = calcularNivel(totalPontos);
    const info = nivelDescricao[nivel];
    return (
      <PageAudioWrapper pageText={`Triagem concluída! Sua trilha é: ${info.titulo}. ${info.descricao}`} label="Ouvir resultado">
      <div className="flex-1 container py-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center">
          <div className="card-cordel p-8">
            <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-2xl mb-4">Triagem Concluída!</h1>
            <div className={`${info.cor} text-white p-4 rounded-md border-2 border-foreground mb-6`}>
              <h2 className="font-body font-bold text-lg">{info.titulo}</h2>
              <p className="font-body text-sm mt-2 opacity-90">{info.descricao}</p>
            </div>
            <p className="font-body text-muted-foreground text-sm mb-6">
              Sua experiência no aplicativo foi personalizada. Todos os textos e exercícios serão adaptados ao seu perfil.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate("/exercicios")} className="w-full border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)]">
                Ver Exercícios
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="w-full border-2 border-foreground">
                Voltar ao Início
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      </PageAudioWrapper>
    );
  }

  return (
    <PageAudioWrapper pageText={TRIAGEM_AUDIO_TEXT} label="Ouvir instruções">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl mb-2">Triagem Adaptativa</h1>
        <p className="font-body text-muted-foreground mb-2">
          Responda algumas perguntas para personalizarmos sua experiência.
        </p>

        {/* M-06: explicação sobre o critério ABEP */}
        <div className="card-cordel p-3 mb-6 bg-[oklch(0.45_0.12_250/0.05)]">
          <p className="font-body text-xs text-muted-foreground">
            <strong className="text-foreground">Por que essas perguntas?</strong>{" "}
            Usamos o Critério ABEP, validado em pesquisas de saúde no Brasil, para adaptar a
            linguagem do app ao seu contexto. Suas respostas ficam <strong>só no seu dispositivo</strong>.
          </p>
        </div>

        {/* Progress */}
        <div
          className="flex gap-1 mb-8"
          role="progressbar"
          aria-valuenow={etapa + 1}
          aria-valuemin={1}
          aria-valuemax={perguntas.length}
          aria-label={`Pergunta ${etapa + 1} de ${perguntas.length}`}
        >
          {perguntas.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full border border-foreground/30 ${i <= etapa ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={etapa}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card-cordel p-6"
          >
            <p className="font-body text-xs text-muted-foreground mb-2">
              Pergunta {etapa + 1} de {perguntas.length}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl flex-1">{perguntaAtual.titulo}</h2>
              <AudioButtonInline
                text={`${perguntaAtual.titulo}. ${perguntaAtual.dica}. Opções: ${perguntaAtual.opcoes.map(o => o.label).join(', ')}`}
                label="Ouvir pergunta"
                size="md"
              />
            </div>

            {/* C-06: botão de dica contextual */}
            <button
              onClick={() => setMostrarDica(!mostrarDica)}
              className="flex items-center gap-1 font-body text-xs text-primary hover:underline mb-3 transition-colors"
              aria-expanded={mostrarDica}
            >
              <HelpCircle className="w-3 h-3" />
              {mostrarDica ? "Ocultar explicação" : "O que isso significa?"}
            </button>

            {mostrarDica && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-[oklch(0.45_0.12_250/0.06)] rounded-md mb-4"
              >
                <p className="font-body text-sm text-foreground">{perguntaAtual.dica}</p>
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              {perguntaAtual.opcoes.map((opcao) => (
                <button
                  key={opcao.label}
                  onClick={() => handleResposta(opcao.pontos)}
                  className="w-full text-left p-4 font-body border-2 border-foreground rounded-md hover:bg-primary hover:text-primary-foreground transition-colors shadow-[2px_2px_0_oklch(0.15_0.02_50)] hover:shadow-[3px_3px_0_oklch(0.15_0.02_50)] hover:translate-x-[-1px] hover:translate-y-[-1px] min-h-[44px]"
                >
                  {opcao.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {etapa > 0 && (
          <button
            onClick={() => { setEtapa(etapa - 1); setMostrarDica(false); }}
            className="mt-4 font-body text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 min-h-[44px]"
          >
            <ArrowLeft className="w-3 h-3" /> Pergunta anterior
          </button>
        )}
      </div>
    </div>
    </PageAudioWrapper>
  );
}
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, CheckCircle2, HelpCircle } from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";
import { AudioButtonInline } from "@/components/AudioPlayer";

const TRIAGEM_AUDIO_TEXT = `Triagem Adaptativa. Responda algumas perguntas para personalizarmos sua experiência. São 5 perguntas rápidas sobre sua família. Usamos o Critério ABEP, validado em pesquisas de saúde no Brasil, para adaptar a linguagem do app ao seu contexto de vida.`;

// C-06: campo dica em cada pergunta
const perguntas = [
  {
    id: "escolaridade",
    titulo: "Qual a escolaridade do chefe da família?",
    dica: "Pode ser você mesmo, seu cônjuge ou quem traz mais dinheiro para casa. Escolha o nível mais próximo.",
    opcoes: [
      { label: "Analfabeto / Fundamental I incompleto", pontos: 0 },
      { label: "Fundamental I completo / Fundamental II incompleto", pontos: 1 },
      { label: "Fundamental II completo / Médio incompleto", pontos: 2 },
      { label: "Médio completo / Superior incompleto", pontos: 4 },
      { label: "Superior completo", pontos: 7 },
    ],
  },
  {
    id: "banheiros",
    titulo: "Quantos banheiros tem na sua casa?",
    dica: "Conte apenas banheiros com vaso sanitário, pia e chuveiro. Lavabos (só com pia e vaso) não contam.",
    opcoes: [
      { label: "Nenhum", pontos: 0 },
      { label: "1", pontos: 3 },
      { label: "2", pontos: 7 },
      { label: "3 ou mais", pontos: 10 },
    ],
  },
  {
    id: "automoveis",
    titulo: "Quantos automóveis tem na família?",
    dica: "Inclua carros próprios ou financiados. Não inclua motos, caminhões ou veículos de trabalho.",
    opcoes: [
      { label: "Nenhum", pontos: 0 },
      { label: "1", pontos: 3 },
      { label: "2 ou mais", pontos: 6 },
    ],
  },
  {
    id: "empregados",
    titulo: "Tem empregada doméstica mensalista?",
    dica: "Conta apenas se trabalha regularmente todos os meses. Diaristas eventuais não entram nessa conta.",
    opcoes: [
      { label: "Não", pontos: 0 },
      { label: "1", pontos: 3 },
      { label: "2 ou mais", pontos: 6 },
    ],
  },
  {
    id: "internet",
    titulo: "Tem acesso à internet em casa?",
    dica: "Pode ser via cabo, wi-fi fixo ou dados móveis com plano mensal.",
    opcoes: [
      { label: "Não", pontos: 0 },
      { label: "Sim", pontos: 4 },
    ],
  },
];

function calcularNivel(pontos: number): "DE" | "C" | "AB" {
  if (pontos <= 8) return "DE";
  if (pontos <= 20) return "C";
  return "AB";
}

export default function Triagem() {
  const [etapa, setEtapa] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [concluido, setConcluido] = useState(false);
  // C-06: estado para mostrar/esconder dica
  const [mostrarDica, setMostrarDica] = useState(false);
  const { setNivelABEP, completarTriagem } = useApp();
  const [, navigate] = useLocation();

  const perguntaAtual = perguntas[etapa];
  const totalPontos = Object.values(respostas).reduce((a, b) => a + b, 0);

  const handleResposta = (pontos: number) => {
    const novasRespostas = { ...respostas, [perguntaAtual.id]: pontos };
    setRespostas(novasRespostas);
    setMostrarDica(false); // resetar dica ao avançar

    if (etapa < perguntas.length - 1) {
      setEtapa(etapa + 1);
    } else {
      const total = Object.values(novasRespostas).reduce((a, b) => a + b, 0);
      const nivel = calcularNivel(total);
      setNivelABEP(nivel);
      completarTriagem();
      setConcluido(true);
    }
  };

  const nivelDescricao = {
    DE: {
      titulo: "Trilha 1 — Linguagem Direta",
      descricao: "Vamos usar palavras simples e exemplos do dia a dia. Foco no que importa: sua família, suas contas, sua paz.",
      cor: "bg-secondary",
    },
    C: {
      titulo: "Trilha 2 — Linguagem Educativa",
      descricao: "Vamos usar analogias e explicações claras para você entender o que acontece no seu cérebro e como retomar o controle.",
      cor: "bg-primary",
    },
    AB: {
      titulo: "Trilha 3 — Linguagem Clínica",
      descricao: "Vamos abordar os mecanismos cognitivos, a ilusão do investimento e estratégias baseadas em evidências para sua recuperação.",
      cor: "bg-accent",
    },
  };

  if (concluido) {
    const nivel = calcularNivel(totalPontos);
    const info = nivelDescricao[nivel];
    return (
      <PageAudioWrapper pageText={`Triagem concluída! Sua trilha é: ${info.titulo}. ${info.descricao}`} label="Ouvir resultado">
      <div className="flex-1 container py-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center">
          <div className="card-cordel p-8">
            <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-2xl mb-4">Triagem Concluída!</h1>
            <div className={`${info.cor} text-white p-4 rounded-md border-2 border-foreground mb-6`}>
              <h2 className="font-body font-bold text-lg">{info.titulo}</h2>
              <p className="font-body text-sm mt-2 opacity-90">{info.descricao}</p>
            </div>
            <p className="font-body text-muted-foreground text-sm mb-6">
              Sua experiência no aplicativo foi personalizada. Todos os textos e exercícios serão adaptados ao seu perfil.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate("/exercicios")} className="w-full border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)]">
                Ver Exercícios
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="w-full border-2 border-foreground">
                Voltar ao Início
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      </PageAudioWrapper>
    );
  }

  return (
    <PageAudioWrapper pageText={TRIAGEM_AUDIO_TEXT} label="Ouvir instruções">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl mb-2">Triagem Adaptativa</h1>
        <p className="font-body text-muted-foreground mb-2">
          Responda algumas perguntas para personalizarmos sua experiência.
        </p>

        {/* M-06: explicação sobre o critério ABEP */}
        <div className="card-cordel p-3 mb-6 bg-[oklch(0.45_0.12_250/0.05)]">
          <p className="font-body text-xs text-muted-foreground">
            <strong className="text-foreground">Por que essas perguntas?</strong>{" "}
            Usamos o Critério ABEP, validado em pesquisas de saúde no Brasil, para adaptar a
            linguagem do app ao seu contexto. Suas respostas ficam <strong>só no seu dispositivo</strong>.
          </p>
        </div>

        {/* Progress */}
        <div
          className="flex gap-1 mb-8"
          role="progressbar"
          aria-valuenow={etapa + 1}
          aria-valuemin={1}
          aria-valuemax={perguntas.length}
          aria-label={`Pergunta ${etapa + 1} de ${perguntas.length}`}
        >
          {perguntas.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full border border-foreground/30 ${i <= etapa ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={etapa}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card-cordel p-6"
          >
            <p className="font-body text-xs text-muted-foreground mb-2">
              Pergunta {etapa + 1} de {perguntas.length}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl flex-1">{perguntaAtual.titulo}</h2>
              <AudioButtonInline
                text={`${perguntaAtual.titulo}. ${perguntaAtual.dica}. Opções: ${perguntaAtual.opcoes.map(o => o.label).join(', ')}`}
                label="Ouvir pergunta"
                size="md"
              />
            </div>

            {/* C-06: botão de dica contextual */}
            <button
              onClick={() => setMostrarDica(!mostrarDica)}
              className="flex items-center gap-1 font-body text-xs text-primary hover:underline mb-3 transition-colors"
              aria-expanded={mostrarDica}
            >
              <HelpCircle className="w-3 h-3" />
              {mostrarDica ? "Ocultar explicação" : "O que isso significa?"}
            </button>

            {mostrarDica && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-[oklch(0.45_0.12_250/0.06)] rounded-md mb-4"
              >
                <p className="font-body text-sm text-foreground">{perguntaAtual.dica}</p>
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              {perguntaAtual.opcoes.map((opcao) => (
                <button
                  key={opcao.label}
                  onClick={() => handleResposta(opcao.pontos)}
                  className="w-full text-left p-4 font-body border-2 border-foreground rounded-md hover:bg-primary hover:text-primary-foreground transition-colors shadow-[2px_2px_0_oklch(0.15_0.02_50)] hover:shadow-[3px_3px_0_oklch(0.15_0.02_50)] hover:translate-x-[-1px] hover:translate-y-[-1px] min-h-[44px]"
                >
                  {opcao.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {etapa > 0 && (
          <button
            onClick={() => { setEtapa(etapa - 1); setMostrarDica(false); }}
            className="mt-4 font-body text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 min-h-[44px]"
          >
            <ArrowLeft className="w-3 h-3" /> Pergunta anterior
          </button>
        )}
      </div>
    </div>
    </PageAudioWrapper>
  );
}

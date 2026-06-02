import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  AlertTriangle, Timer, BarChart3, BookOpen, Shield, Calculator,
  Brain, HeartHandshake, Users, Siren, BookOpenCheck, Scale,
  ShieldBan, Gamepad2, ClipboardCheck, TrendingUp, Heart, Anchor, Sparkles,
} from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663621494533/PAsCAKgGiiDo7MBoxQXEkZ/hero-banner-mfFgk63nJ3MKMHt76HKcyz.webp";

// FASE 3 — UX-03: novos cards adicionados (Check-in, Modo Crise, Pequenas Vitórias)
const ferramentas = [
  {
    titulo: "Triagem Adaptativa",
    descricao: "Descubra sua trilha personalizada",
    icone: BarChart3,
    rota: "/triagem",
    cor: "bg-primary",
  },
  {
    titulo: "Botão SOS",
    descricao: "Cronômetro de 15 minutos para o impulso",
    icone: Timer,
    rota: "/sos",
    cor: "bg-destructive",
  },
  {
    titulo: "Modo Crise",
    descricao: "Apoio passo a passo num momento difícil",
    icone: Anchor,
    rota: "/crise",
    cor: "bg-[oklch(0.45_0.15_240)]",
  },
  {
    titulo: "Check-in Emocional",
    descricao: "Como você está se sentindo agora?",
    icone: Heart,
    rota: "/checkin",
    cor: "bg-[oklch(0.50_0.14_155)]",
  },
  {
    titulo: "Escala dos 3 Cs",
    descricao: "Controle, Enfrentamento e Perseguição",
    icone: AlertTriangle,
    rota: "/escala-3cs",
    cor: "bg-secondary",
  },
  {
    titulo: "Realidade Matemática",
    descricao: "A probabilidade está sempre contra você",
    icone: Calculator,
    rota: "/matematica",
    cor: "bg-[oklch(0.35_0.08_250)]",
  },
  {
    titulo: "Distorções Cognitivas",
    descricao: "As 8 armadilhas da mente",
    icone: Brain,
    rota: "/distorcoes",
    cor: "bg-[oklch(0.40_0.18_310)]",
  },
  {
    titulo: "TCC e Atenção Plena",
    descricao: "Reestruturação cognitiva e atenção plena",
    icone: BookOpenCheck,
    rota: "/tcc-mindfulness",
    cor: "bg-accent",
  },
  {
    titulo: "Lapso e Recaída",
    descricao: "Entenda a diferença e saiba o que fazer",
    icone: Siren,
    rota: "/lapso-recaida",
    cor: "bg-[oklch(0.55_0.14_60)]",
  },
  {
    titulo: "Guia de Autoexclusão",
    descricao: "Tutorial para bloqueio via gov.br",
    icone: Shield,
    rota: "/autoexclusao",
    cor: "bg-primary",
  },
  {
    titulo: "Rede de Apoio",
    descricao: "CVV, JA e seus contatos pessoais",
    icone: HeartHandshake,
    rota: "/rede-apoio",
    cor: "bg-accent",
  },
  {
    titulo: "Jogadores Anônimos",
    descricao: "Grupo de apoio entre iguais",
    icone: Users,
    rota: "/jogadores-anonimos",
    cor: "bg-[oklch(0.40_0.14_155)]",
  },
  {
    titulo: "Balança Decisória",
    descricao: "Pese motivos para jogar e para parar",
    icone: Scale,
    rota: "/balanca-decisoria",
    cor: "bg-[oklch(0.45_0.12_200)]",
  },
  {
    titulo: "Bloqueador de Sites",
    descricao: "Bloqueie 66 plataformas de apostas",
    icone: ShieldBan,
    rota: "/sites-bloqueados",
    cor: "bg-[oklch(0.35_0.15_25)]",
  },
  {
    titulo: "Exercícios Terapêuticos",
    descricao: "12 atividades para sua recuperação",
    icone: BookOpen,
    rota: "/exercicios",
    cor: "bg-secondary",
  },
  {
    titulo: "Simuladores Interativos",
    descricao: "Veja como a máquina te engana — com segurança",
    icone: Gamepad2,
    rota: "/simuladores",
    cor: "bg-[oklch(0.42_0.18_280)]",
  },
  {
    titulo: "Autoteste Mensal",
    descricao: "Avalie sua relação com o jogo (4 questões)",
    icone: ClipboardCheck,
    rota: "/autoteste",
    cor: "bg-[oklch(0.40_0.14_155)]",
  },
  {
    titulo: "Escala Semanal",
    descricao: "Acompanhe sua evolução semana a semana",
    icone: TrendingUp,
    rota: "/escala-esj",
    cor: "bg-[oklch(0.38_0.12_220)]",
  },
  {
    titulo: "Pequenas Vitórias",
    descricao: "Registre sua vida além do jogo",
    icone: Sparkles,
    rota: "/vida-real",
    cor: "bg-[oklch(0.40_0.14_155)]",
  },
];

const PAGE_AUDIO_TEXT = `Quando o Jogo Vira Problema. Um guia acolhedor para retomar o controle da sua vida. Ferramentas práticas, baseadas em ciência, para você e sua família.`;

export default function Home() {
  return (
    <PageAudioWrapper pageText={PAGE_AUDIO_TEXT} label="Ouvir página inicial">
      {/* FASE 5 — A-04: skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-body"
      >
        Ir para conteúdo principal
      </a>

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden" aria-label="Apresentação do aplicativo">
          <div className="absolute inset-0">
            <img
              src={HERO_IMG}
              alt="Ilustração em estilo cordel de um bairro brasileiro acolhedor"
              className="w-full h-full object-cover"
              width={1200}
              height={600}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.15_0.02_50/0.6)] via-[oklch(0.15_0.02_50/0.4)] to-[oklch(0.96_0.015_75)]" />
          </div>
          <div className="relative container py-16 sm:py-24 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4 drop-shadow-lg">
                Quando o Jogo Vira Problema
              </h1>
              <p className="text-lg sm:text-xl text-white/90 font-body font-medium mb-6 drop-shadow">
                Um guia acolhedor para retomar o controle da sua vida. Ferramentas práticas, baseadas em ciência, para você e sua família.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/triagem"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-bold border-2 border-foreground rounded-md shadow-[3px_3px_0_oklch(0.15_0.02_50)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_oklch(0.15_0.02_50)] transition-all min-h-[44px]"
                  aria-label="Começar a triagem adaptativa"
                >
                  <BarChart3 className="w-5 h-5" aria-hidden="true" />
                  Começar Agora
                </Link>
                <Link
                  href="/sos"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground font-body font-bold border-2 border-foreground rounded-md shadow-[3px_3px_0_oklch(0.15_0.02_50)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_oklch(0.15_0.02_50)] transition-all min-h-[44px]"
                  aria-label="Botão de emergência SOS — preciso de ajuda agora"
                >
                  <Timer className="w-5 h-5" aria-hidden="true" />
                  SOS — Preciso de Ajuda Agora
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Age Notice */}
        <section className="container py-4" aria-label="Aviso de idade">
          <div
            className="bg-[oklch(0.55_0.14_60/0.1)] border-2 border-[oklch(0.55_0.14_60)] rounded-md p-3 text-center"
            role="note"
          >
            <p className="font-body text-sm font-semibold text-foreground">
              ⚠️ Material destinado a pessoas acima de 18 anos
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <main id="main-content">
          <section className="container py-12 sm:py-16" aria-label="Ferramentas de cuidado">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl text-center mb-10"
            >
              Suas Ferramentas de Cuidado
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
              {ferramentas.map((f, i) => (
                <motion.div
                  key={f.rota}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                  role="listitem"
                >
                  <Link
                    href={f.rota}
                    className="block focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
                    aria-label={`${f.titulo}: ${f.descricao}`}
                  >
                    <div className="card-cordel p-6 h-full flex flex-col hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_oklch(0.15_0.02_50)] transition-all">
                      <div className={`w-12 h-12 ${f.cor} rounded-md border-2 border-foreground flex items-center justify-center mb-4`}>
                        <f.icone className="w-6 h-6 text-white" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg mb-2">{f.titulo}</h3>
                      <p className="text-sm text-muted-foreground font-body flex-1">{f.descricao}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        {/* About Section */}
        <section className="container py-12 border-t-2 border-foreground/20" aria-label="Sobre o projeto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl mb-4">Sobre Este Projeto</h2>
            <p className="font-body text-muted-foreground leading-relaxed">
              Este aplicativo é uma iniciativa de saúde pública da{" "}
              <strong className="text-foreground">Associação Viver Bem</strong>{" "}
              (www.associacaoviverbem.org.br · @proamiti), com coordenação científica do{" "}
              <strong className="text-foreground">Dr. Hermano Tavares</strong> (CRM-SP 75.471) —{" "}
              Instituto de Psiquiatria HC-FMUSP, Ambulatório PRO-AMITI.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mt-3">
              <strong className="text-foreground">Organizadores:</strong> Hermano Tavares,
              Sônia Maria Estácio Ferreira, Tânia Mara Mariano Couto, Cintia Cristina Sanches,
              Marcelo Peixoto Gonçalves e Tatiana Zambrano Filomensky.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mt-4">
              O Transtorno do Jogo é uma condição de saúde reconhecida pela OMS. Não é fraqueza de caráter.
              Com as ferramentas certas, a recuperação é possível.
            </p>
            <Link
              href="/organizadores"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-primary text-primary-foreground font-body font-bold border-2 border-foreground rounded-md shadow-[3px_3px_0_oklch(0.15_0.02_50)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_oklch(0.15_0.02_50)] transition-all"
              aria-label="Conhecer a equipe de organizadores"
            >
              Conheça a Equipe
            </Link>
            <div className="mt-6 p-4 bg-muted rounded-md border-2 border-foreground/20">
              <p className="font-body text-xs text-muted-foreground">
                Todos os dados são salvos apenas no seu dispositivo. Nenhuma informação pessoal é coletada ou enviada.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageAudioWrapper>
  );
}

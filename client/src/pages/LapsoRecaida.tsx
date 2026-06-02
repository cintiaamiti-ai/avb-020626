import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Phone, Users, Clock, ArrowRight } from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

const LAPSO_AUDIO_TEXT = `Lapso e Recaída. Entenda a diferença e saiba o que fazer. Lapso é um escorregão pontual, uma aposta isolada. Não apaga seu progresso. Recaída é a volta ao padrão anterior de jogo frequente. Se você teve um lapso: pare imediatamente, não tente recuperar. Ligue para o CVV, 188, ou Jogadores Anônimos, 11, 3229-1615. Analise o que aconteceu sem julgamento. Retome seus exercícios e sua rede de apoio. Lembre-se: um lapso não é fracasso. É parte do caminho.`;

export default function LapsoRecaida() {
  return (
    <PageAudioWrapper pageText={LAPSO_AUDIO_TEXT} label="Ouvir sobre lapso e recaída">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl mb-2">Lapso e Recaída</h1>
          <p className="font-body text-muted-foreground mb-4">
            Entenda a diferença e saiba o que fazer se acontecer.
          </p>
        </motion.div>

        {/* Train metaphor */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-cordel p-6 mb-8 bg-[oklch(0.55_0.14_60/0.08)]"
        >
          <h3 className="text-lg mb-3">O Trem Saiu dos Trilhos?</h3>
          <p className="font-body text-sm text-foreground leading-relaxed mb-3">
            Imagine sua recuperação como um trem em uma ferrovia. Às vezes, o trem pode sair dos trilhos por um momento.
            Isso é um <strong>lapso</strong> — um deslize pontual.
          </p>
          <p className="font-body text-sm text-foreground leading-relaxed mb-3">
            Se o trem continua fora dos trilhos por muito tempo, isso se torna uma <strong>recaída</strong> — 
            um retorno ao padrão anterior de jogo.
          </p>
          <p className="font-body text-sm text-foreground leading-relaxed">
            A boa notícia: <strong>o trem pode voltar aos trilhos a qualquer momento</strong>. Um lapso não precisa virar recaída.
          </p>
        </motion.div>

        {/* Lapso vs Recaída */}
        <h2 className="text-xl mb-4">Qual a Diferença?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-cordel p-5 bg-[oklch(0.55_0.14_60/0.05)]"
          >
            <h3 className="text-base font-bold mb-2 text-[oklch(0.55_0.14_60)]">Lapso</h3>
            <ul className="space-y-2 font-body text-sm">
              <li>· Um episódio isolado</li>
              <li>· Pode ser interrompido</li>
              <li>· Oportunidade de aprendizado</li>
              <li>· Não apaga o progresso anterior</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-cordel p-5 bg-[oklch(0.50_0.2_25/0.05)]"
          >
            <h3 className="text-base font-bold mb-2 text-destructive">Recaída</h3>
            <ul className="space-y-2 font-body text-sm">
              <li>· Retorno ao padrão anterior</li>
              <li>· Acontece quando o lapso não é tratado</li>
              <li>· Precisa de apoio profissional</li>
              <li>· Também pode ser superada</li>
            </ul>
          </motion.div>
        </div>

        {/* 30 minutes post-lapse */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-cordel p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-[oklch(0.55_0.14_60)]" />
            <h3 className="text-lg">Os 30 Minutos Pós-Lapso</h3>
          </div>
          <p className="font-body text-sm text-muted-foreground mb-4">
            Se você jogou, os próximos 30 minutos são os mais importantes. Siga estes passos:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted rounded-md">
              <span className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center font-body font-bold text-xs shrink-0">1</span>
              <p className="font-body text-sm"><strong>Pare agora.</strong> Feche o aplicativo de apostas. Saia do site.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-md">
              <span className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center font-body font-bold text-xs shrink-0">2</span>
              <p className="font-body text-sm"><strong>Não se puna.</strong> Culpa intensa leva a jogar mais para \"compensar\".</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-md">
              <span className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center font-body font-bold text-xs shrink-0">3</span>
              <p className="font-body text-sm"><strong>Ligue para alguém.</strong> CVV 188 ou JA (11) 3229-1615.</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted rounded-md">
              <span className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center font-body font-bold text-xs shrink-0">4</span>
              <p className="font-body text-sm"><strong>Analise depois.</strong> Use o Exercício 9 (Análise do Lapso) quando estiver calmo.</p>
            </div>
          </div>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="card-cordel p-5 bg-[oklch(0.50_0.2_25/0.05)] border-destructive mb-6"
        >
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="font-body text-sm text-foreground">
              <strong>Importante:</strong> Um lapso não é fracasso. É parte do processo de recuperação para muitas pessoas.
              O que importa é o que você faz depois.
            </p>
          </div>
        </motion.div>

        {/* Contacts */}
        <div className="card-cordel p-5 mb-6">
          <h3 className="text-base mb-3">Precisa de apoio agora?</h3>
          <div className="space-y-2">
            <a href="tel:188" className="flex items-center gap-3 p-3 bg-muted rounded-md hover:bg-muted/70 transition-colors">
              <Phone className="w-4 h-4 text-destructive" />
              <span className="font-body text-sm font-semibold">CVV — 188 (24h · Gratuito · Sigiloso)</span>
            </a>
            <a href="tel:+551132291615" className="flex items-center gap-3 p-3 bg-muted rounded-md hover:bg-muted/70 transition-colors">
              <Users className="w-4 h-4 text-accent" />
              <span className="font-body text-sm font-semibold">Jogadores Anônimos — (11) 3229-1615</span>
            </a>
          </div>
        </div>

        {/* Link to exercise */}
        <div className="text-center">
          <Link href="/exercicio/9">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-[oklch(0.55_0.14_60)] text-white font-body font-bold border-2 border-foreground rounded-md shadow-[3px_3px_0_oklch(0.15_0.02_50)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_oklch(0.15_0.02_50)] transition-all">
              Fazer Exercício 9 — Análise do Lapso
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  </PageAudioWrapper>
  );
}

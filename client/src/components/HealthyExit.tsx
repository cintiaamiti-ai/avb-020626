import { motion } from "framer-motion";
import { Link } from "wouter";

/**
 * HealthyExit
 *
 * Componente de encerramento saudável exibido após:
 * - Exercícios terapêuticos
 * - SOS concluído
 * - Check-in emocional
 *
 * Objetivo: promover autonomia. Nunca promover retenção no app.
 *
 * Uso:
 *   <HealthyExit />
 *   <HealthyExit contexto="exercicio" />
 *   <HealthyExit contexto="sos" />
 *   <HealthyExit contexto="checkin" />
 */

type Contexto = "exercicio" | "sos" | "checkin" | "crise" | "padrao";

interface Props {
  contexto?: Contexto;
}

const MENSAGENS: Record<Contexto, { titulo: string; paragrafo: string }> = {
  exercicio: {
    titulo: "Você fez o suficiente por agora.",
    paragrafo:
      "Concluiu um exercício. Isso já é um passo real. Não precisa fazer mais nada agora.",
  },
  sos: {
    titulo: "Você aguentou firme.",
    paragrafo:
      "O impulso passou. Você resistiu. Isso é muito mais do que parece.",
  },
  checkin: {
    titulo: "Obrigado por se dar esse momento.",
    paragrafo:
      "Prestar atenção em como você está é uma forma de cuidado. Continue assim.",
  },
  crise: {
    titulo: "Você passou por um momento difícil.",
    paragrafo:
      "Percorrer essas etapas requer coragem. Cuide-se com gentileza.",
  },
  padrao: {
    titulo: "Você fez o suficiente por agora.",
    paragrafo:
      "Não precisa ficar aqui. Pode descansar, se mover, ou simplesmente parar.",
  },
};

const SUGESTOES = [
  { icone: "💧", texto: "Tomar água" },
  { icone: "🚶", texto: "Caminhar um pouco" },
  { icone: "💬", texto: "Conversar com alguém" },
  { icone: "😌", texto: "Descansar" },
  { icone: "🌿", texto: "Respirar fundo" },
];

export default function HealthyExit({ contexto = "padrao" }: Props) {
  const msg = MENSAGENS[contexto] ?? MENSAGENS.padrao;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="card-cordel p-6 mt-8 bg-[oklch(0.50_0.14_155/0.06)] border-accent/30"
      role="region"
      aria-label="Encerramento saudável"
    >
      <h2 className="text-lg mb-2">{msg.titulo}</h2>
      <p className="font-body text-muted-foreground text-sm mb-5">{msg.paragrafo}</p>

      <p className="font-body text-sm font-semibold text-foreground mb-3">
        Talvez seja um bom momento para:
      </p>

      <ul className="space-y-2 mb-6" aria-label="Sugestões de pausas">
        {SUGESTOES.map((s) => (
          <li
            key={s.texto}
            className="flex items-center gap-2 font-body text-sm text-foreground"
          >
            <span aria-hidden="true">{s.icone}</span>
            {s.texto}
          </li>
        ))}
      </ul>

      <p className="font-body text-sm text-muted-foreground mb-4">
        Você pode voltar quando quiser.
      </p>

      <Link
        href="/"
        className="inline-block font-body text-sm text-primary underline hover:text-primary/80 transition-colors"
        aria-label="Voltar ao início do aplicativo"
      >
        Voltar ao início
      </Link>
    </motion.div>
  );
}

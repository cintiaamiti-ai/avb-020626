import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Shield, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

const AUTOEXCLUSAO_AUDIO_TEXT = `Guia de Autoexclusão. Tutorial passo a passo para se bloquear nas plataformas de apostas via gov.br. Passo 1: Acesse o site autoexclusaoapostas.fazenda.gov.br. Passo 2: Faça login com sua conta gov.br. Passo 3: Escolha o período de bloqueio: 6 meses, 1 ano, ou indeterminado. Recomendamos no mínimo 1 ano. Passo 4: Confirme. Todas as casas de apostas regulamentadas serão obrigadas a bloquear seu acesso. É gratuito, sigiloso e imediato.`;

const AUTOEXCLUSAO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663621494533/PAsCAKgGiiDo7MBoxQXEkZ/autoexclusao-guide-4MmkEdSPJGqJjGpNpeTxVs.webp";

const passos = [
  {
    numero: 1,
    titulo: "Acesse",
    descricao: "Entre em autoexclusaoapostas.fazenda.gov.br. Funciona pelo celular ou computador.",
  },
  {
    numero: 2,
    titulo: "Entre com gov.br",
    descricao: "Use a mesma conta do INSS e do Imposto de Renda. Se não tiver, crie gratuitamente.",
  },
  {
    numero: 3,
    titulo: "Escolha o período",
    descricao: "6 meses · 1 ano · Indeterminado. Recomendamos no mínimo 1 ano para maior proteção.",
  },
  {
    numero: 4,
    titulo: "Confirme e pronto",
    descricao: "Bloqueio ativado imediatamente. Nenhuma plataforma legal aceitará seu cadastro.",
  },
];

export default function Autoexclusao() {
  return (
    <PageAudioWrapper pageText={AUTOEXCLUSAO_AUDIO_TEXT} label="Ouvir tutorial de autoexclusão">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl mb-2">Como Bloquear os Sites</h1>
          <p className="font-body text-muted-foreground mb-8">
            A autoexclusão é um direito seu. Bloqueie seu acesso a todas as casas de apostas regulamentadas pelo governo federal.
          </p>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-md overflow-hidden border-3 border-foreground shadow-[4px_4px_0_oklch(0.15_0.02_50)] mb-8"
        >
          <img
            src={AUTOEXCLUSAO_IMG}
            alt="Ilustração do processo de autoexclusão via gov.br"
            className="w-full"
          />
        </motion.div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {passos.map((passo, i) => (
            <motion.div
              key={passo.numero}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-cordel p-5 flex gap-4"
            >
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full border-2 border-foreground flex items-center justify-center shrink-0 font-body font-bold">
                {passo.numero}
              </div>
              <div>
                <h3 className="text-lg mb-1">{passo.titulo}</h3>
                <p className="font-body text-sm text-muted-foreground">{passo.descricao}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Green banner */}
        <div className="bg-accent text-accent-foreground p-4 rounded-md border-2 border-foreground mb-8 text-center">
          <p className="font-body font-bold text-lg">GRATUITO · SIGILOSO · IMEDIATO</p>
        </div>

        {/* Important Info */}
        <div className="card-cordel p-6 bg-[oklch(0.50_0.14_155/0.08)] mb-8">
          <h3 className="text-lg mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Informações Importantes
          </h3>
          <ul className="space-y-2 font-body text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>O bloqueio é <strong>gratuito</strong> e pode ser feito a qualquer momento.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Todas as casas de apostas regulamentadas são obrigadas a cumprir.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Seus dados são protegidos pelo sigilo da Lei Geral de Proteção de Dados.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>Você pode renovar o bloqueio quantas vezes quiser.</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://autoexclusaoapostas.fazenda.gov.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Acessar Agora
            </Button>
          </a>
          <p className="font-body text-xs text-muted-foreground mt-3">
            Você será redirecionado para o site oficial do Governo Federal.
          </p>
        </div>
      </div>
    </div>
    </PageAudioWrapper>
  );
}

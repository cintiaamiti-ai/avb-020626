import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, HeartHandshake, Phone, Users, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

const REDE_AUDIO_TEXT = `Rede de Apoio. Você não precisa enfrentar isso sozinho. Contatos de emergência: CVV, ligue 188, apoio emocional 24 horas, gratuito e sigiloso. Jogadores Anônimos, ligue 11, 3229-1615, grupo de apoio entre iguais. SUS, ligue 136, para encontrar CAPS mais próximo. SAMU, ligue 192, emergências. Você também pode adicionar contatos pessoais de confiança, como amigos ou familiares. Esses contatos são opcionais e ficam salvos apenas no seu dispositivo.`;
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

export default function RedeApoio() {
  const { state, salvarContatos } = useApp();
  const [contatos, setContatos] = useState(state.contatosPessoais || [
    { nome: "", telefone: "" },
    { nome: "", telefone: "" },
    { nome: "", telefone: "" },
  ]);
  const [salvo, setSalvo] = useState(false);

  const handleSalvar = () => {
    salvarContatos(contatos);
    setSalvo(true);
    toast.success("Contatos salvos!", {
      description: "Seus dados ficam apenas no seu dispositivo.",
    });
  };

  return (
    <PageAudioWrapper pageText={REDE_AUDIO_TEXT} label="Ouvir rede de apoio">
    <div className="flex-1 container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </Link>

      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl mb-2">Minha Rede de Apoio</h1>
          <p className="font-body text-muted-foreground mb-6">
            Ter pessoas de confiança por perto faz diferença na recuperação.
          </p>
        </motion.div>

        {/* Always visible emergency contacts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-cordel p-6 mb-8"
        >
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-accent" />
            Apoio Profissional (sempre disponível)
          </h3>
          <div className="space-y-3">
            <a href="tel:188" className="flex items-center gap-3 p-4 bg-muted rounded-md border border-foreground/20 hover:bg-muted/70 transition-colors">
              <Phone className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-body font-bold text-sm">CVV — 188</p>
                <p className="font-body text-xs text-muted-foreground">Apoio emocional 24h · Gratuito · Sigiloso</p>
              </div>
            </a>
            <a href="tel:+551132291615" className="flex items-center gap-3 p-4 bg-muted rounded-md border border-foreground/20 hover:bg-muted/70 transition-colors">
              <Users className="w-5 h-5 text-accent" />
              <div>
                <p className="font-body font-bold text-sm">Jogadores Anônimos — (11) 3229-1615</p>
                <p className="font-body text-xs text-muted-foreground">Grupo de apoio · Gratuito · Sigiloso</p>
              </div>
            </a>
            <a href="tel:136" className="flex items-center gap-3 p-4 bg-muted rounded-md border border-foreground/20 hover:bg-muted/70 transition-colors">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="font-body font-bold text-sm">SUS — 136</p>
                <p className="font-body text-xs text-muted-foreground">Informações sobre CAPS e atendimento pelo SUS</p>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Personal contacts - optional */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-cordel p-6 mb-6"
        >
          <h3 className="text-lg mb-2">Meus Contatos Pessoais</h3>
          
          {/* Optional notice */}
          <div className="flex items-start gap-2 p-3 bg-[oklch(0.55_0.14_60/0.08)] rounded-md mb-4">
            <AlertCircle className="w-4 h-4 text-[oklch(0.55_0.14_60)] shrink-0 mt-0.5" />
            <p className="font-body text-xs text-foreground">
              <strong>Opcional</strong> — preencha se fizer sentido para você. Você pode cadastrar até 3 pessoas de confiança.
            </p>
          </div>

          <div className="space-y-4">
            {contatos.map((c, i) => (
              <div key={i} className="p-4 bg-muted rounded-md border border-foreground/20">
                <p className="font-body text-xs text-muted-foreground mb-2">Contato {i + 1} (opcional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={c.nome}
                    onChange={(e) => {
                      const novos = [...contatos];
                      novos[i] = { ...novos[i], nome: e.target.value };
                      setContatos(novos);
                      setSalvo(false);
                    }}
                    placeholder="Nome"
                    className="w-full p-2 font-body text-sm border-2 border-foreground rounded-md bg-background"
                  />
                  <input
                    type="tel"
                    value={c.telefone}
                    onChange={(e) => {
                      const novos = [...contatos];
                      novos[i] = { ...novos[i], telefone: e.target.value };
                      setContatos(novos);
                      setSalvo(false);
                    }}
                    placeholder="Telefone"
                    className="w-full p-2 font-body text-sm border-2 border-foreground rounded-md bg-background"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleSalvar}
            className="w-full mt-4 border-2 border-foreground shadow-[3px_3px_0_oklch(0.15_0.02_50)] font-body font-bold gap-2"
          >
            {salvo ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {salvo ? "Salvo!" : "Salvar Contatos"}
          </Button>
        </motion.div>

        {/* Privacy notice */}
        <div className="text-center p-4 bg-muted rounded-md">
          <p className="font-body text-xs text-muted-foreground">
            Todos os dados ficam salvos apenas no seu dispositivo. Nenhuma informação é enviada para servidores.
          </p>
        </div>
      </div>
    </div>
    </PageAudioWrapper>
  );
}

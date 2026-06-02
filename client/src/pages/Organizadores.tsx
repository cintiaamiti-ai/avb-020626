import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageAudioWrapper } from "@/components/PageAudioWrapper";

const LOGO_AVB = "/manus-storage/logo-viverbem_fe03a421.png";

const organizadores = [
  {
    nome: "Dr. Hermano Tavares",
    registro: "CRM-SP 75.471",
    cargo: "Presidente",
    foto: "/manus-storage/hermano-tavares_9579c506.png",
    bio: "Graduação em Medicina pelo IPq-HC-FMUSP. Residência no IPq-HC-FMUSP. Professor Associado Livre-Docente. Coordenador do Programa Ambulatorial Integrado dos Transtornos do Impulso (PRO-AMITI) e do Programa Ambulatorial do Transtorno do Jogo (PRO-AMJO) do IPq-HC-FMUSP.",
  },
  {
    nome: "Sônia Maria Estácio Ferreira",
    registro: "CRP 06/55037-7",
    cargo: "Organizadora",
    foto: "/manus-storage/sonia-tania_2ed6fb03.png",
    fotoPosition: "left",
    bio: "Graduação em Psicologia pela Universidade São Marcos. Especialista em Psicoterapia Breve com formação em Psicossomática. Especialista em Dependência Química e Entrevista Motivacional pelo GREA do IPq-HC-FMUSP. Colaboradora do Programa para Compradores Compulsivos do PRO-AMITI do IPq-HC-FMUSP. Especialista em Terapia Cognitivo-Comportamental, Hipnoterapia Ericksoniana. Formações em Terapia Focada em Esquemas, Terapia Focada nas Emoções, Brainspotting e EMDR.",
  },
  {
    nome: "Tânia Mara Mariano Couto",
    registro: "CRP 06/92796",
    cargo: "3ª Conselheira",
    foto: "/manus-storage/sonia-tania_2ed6fb03.png",
    fotoPosition: "right",
    bio: "Psicóloga Clínica e Neuropsicóloga. Especialista em Neuropsicologia com Formação em Reabilitação Cognitiva pelo IPq-HC-FMUSP. Especialista em Terapias Cognitivas e em Transtornos do Controle do Impulso pelo IPq-HC-FMUSP. Formação em TCC pelo ITC-BR. Colaboradora do Programa para Compradores Compulsivos e Entrevista Motivacional do PRO-AMITI e do PRO-AMJO do IPq-HC-FMUSP.",
  },
  {
    nome: "Cintia Cristina Sanches",
    registro: "CRP 06/96093",
    cargo: "Diretora Administrativa",
    foto: "/manus-storage/cintia-sanches_c9e34714.png",
    bio: "Psicóloga Colaboradora no Instituto de Psiquiatria da FMUSP no PRO-AMITI. Diretora Administrativa na Associação Viver Bem. Doutoranda pela Universidade Federal de São Paulo (UNIFESP — Departamento de Psiquiatria e Psicologia Médica). Coordenadora de Campo da Pesquisa sobre adversidades maternas, inflamação e neurodesenvolvimento.",
  },
  {
    nome: "Marcelo Peixoto Gonçalves",
    registro: "CRP 06/62391",
    cargo: "5º Conselheiro",
    foto: "/manus-storage/marcelo-peixoto_f4ed620f.png",
    bio: "Psicólogo especialista em Terapias Cognitivas pelo AMBULIM — IPq-HC-FMUSP. Professor universitário e supervisor de estágio clínico na UNIP. Formação em Terapia Focada em Esquemas (Wainer/ISST-NY). Treinamento Intensivo em Terapia Comportamental Dialética (Linehan Institute). Terapeuta Cognitivo Certificado pela Federação Brasileira de Terapias Cognitivas. Colaborador do PRO-AMITI do IPq-HC-FMUSP.",
  },
  {
    nome: "Tatiana Zambrano Filomensky",
    registro: "CRP 06/66217",
    cargo: "Organizadora",
    foto: "/manus-storage/tatiana-filomensky_52c7c0cb.png",
    bio: "Graduação em Psicologia. Mestrado pela Faculdade de Medicina da USP. Especialista em Terapias Cognitivas. Coordenadora do Programa para Compradores Compulsivos do Programa Ambulatorial dos Transtornos do Impulso (PRO-AMITI) do IPq-HC-FMUSP.",
  },
];

const PAGE_AUDIO_TEXT = `Organizadores deste material. Este aplicativo foi desenvolvido pela Associação Viver Bem, com coordenação científica de uma equipe multidisciplinar do Instituto de Psiquiatria do Hospital das Clínicas da Faculdade de Medicina da USP. Os organizadores são: Doutor Hermano Tavares, CRM SP 75471, Presidente, Professor Associado Livre-Docente e Coordenador do PRO-AMITI e PRO-AMJO. Sônia Maria Estácio Ferreira, CRP 06 55037-7, Especialista em Dependência Química e Entrevista Motivacional. Tânia Mara Mariano Couto, CRP 06 92796, Psicóloga Clínica e Neuropsicóloga. Cintia Cristina Sanches, CRP 06 96093, Diretora Administrativa da Associação Viver Bem. Marcelo Peixoto Gonçalves, CRP 06 62391, Especialista em Terapias Cognitivas. Tatiana Zambrano Filomensky, CRP 06 66217, Coordenadora do Programa para Compradores Compulsivos. Contato: contato@associacaoviverbem.org.br. Telefone: 11 98811-2667.`;

export default function Organizadores() {
  return (
    <PageAudioWrapper pageText={PAGE_AUDIO_TEXT} label="Ouvir sobre os organizadores">
      <div className="flex-1">
        {/* Header */}
        <div className="container py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-body font-semibold hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" /> Voltar ao início
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <img
              src={LOGO_AVB}
              alt="Logo Associação Viver Bem"
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-3xl sm:text-4xl mb-3">Organizadores</h1>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Este material foi desenvolvido por uma equipe multidisciplinar do{" "}
              <strong className="text-foreground">Instituto de Psiquiatria do Hospital das Clínicas da Faculdade de Medicina da USP</strong>,
              vinculada à <strong className="text-foreground">Associação Viver Bem</strong>.
            </p>
          </motion.div>
        </div>

        {/* Organizadores Grid */}
        <section className="container pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {organizadores.map((org, i) => (
              <motion.div
                key={org.nome}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-cordel p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-md border-3 border-foreground overflow-hidden bg-muted">
                      <img
                        src={org.foto}
                        alt={`Foto de ${org.nome}`}
                        className={`w-full h-full object-cover ${org.fotoPosition === "right" ? "object-right" : org.fotoPosition === "left" ? "object-left" : "object-center"}`}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-1">{org.nome}</h3>
                    <p className="font-body text-xs font-semibold text-primary mb-1">{org.registro}</p>
                    <p className="font-body text-xs font-medium text-muted-foreground bg-muted inline-block px-2 py-0.5 rounded mb-3">{org.cargo}</p>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{org.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Institutional Info */}
        <section className="container pb-12">
          <div className="card-cordel p-6 text-center">
            <h2 className="text-xl mb-4">Associação Viver Bem</h2>
            <p className="font-body text-sm text-muted-foreground mb-2">
              CNPJ: 07.107.729/0001-00
            </p>
            <p className="font-body text-sm text-muted-foreground mb-2">
              Rua Teodoro Sampaio, 1020 — Sala 1202 — 12º andar — Pinheiros
            </p>
            <p className="font-body text-sm text-muted-foreground mb-4">
              CEP 05406-050 | São Paulo — SP
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+5511988112667"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold text-primary hover:underline"
                aria-label="Ligar para a Associação Viver Bem"
              >
                (11) 98811-2667
              </a>
              <a
                href="mailto:contato@associacaoviverbem.org.br"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold text-primary hover:underline"
                aria-label="Enviar email para a Associação Viver Bem"
              >
                contato@associacaoviverbem.org.br
              </a>
            </div>
            <div className="mt-4">
              <a
                href="https://www.associacaoviverbem.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold text-primary hover:underline"
                aria-label="Visitar site da Associação Viver Bem"
              >
                <ExternalLink className="w-4 h-4" />
                www.associacaoviverbem.org.br
              </a>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-4">
              Instagram: @proamiti
            </p>
          </div>
        </section>
      </div>
    </PageAudioWrapper>
  );
}

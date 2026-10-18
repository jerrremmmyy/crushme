"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Flame,
  MessageCircle,
  Zap,
  Shield,
  Star,
  ChevronRight,
  Sparkles,
  Camera,
  Copy,
} from "lucide-react";

const PhoneMockup = dynamic(() => import("@/components/PhoneMockup"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto h-[480px] w-[280px] animate-pulse rounded-[2.5rem] bg-bg-card" />
  ),
});

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Flame size={24} className="text-accent-pink" />
            <span className="text-lg font-bold">CrushMe</span>
          </div>
          <Link
            href="/analyse"
            className="rounded-full bg-accent-pink/10 px-4 py-1.5 text-sm font-semibold text-accent-pink transition hover:bg-accent-pink/20"
          >
            Essayer
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-6 pt-10 text-center">
          {/* Background glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[600px] -translate-x-1/2 bg-gradient-to-b from-accent-pink/8 via-accent-purple/5 to-transparent blur-3xl" />

          <div className="mx-auto max-w-lg">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent-pink/10 px-3 py-1 text-xs font-medium text-accent-pink">
              <Sparkles size={12} />
              +10 000 conversations analysées
            </div>
            <h1 className="mb-3 text-[2.5rem] font-black leading-[1.05] tracking-tight">
              T&apos;es un{" "}
              <span className="gradient-text">crush</span>
              <br />
              ou un flop ?
            </h1>
            <p className="mx-auto mb-8 max-w-xs text-base text-text-secondary">
              Envoie ton screenshot. Note{" "}
              <strong className="text-text-primary">/10</strong> + réponses
              qui tuent en 5 secondes.
            </p>
          </div>
        </section>

        {/* Phone mockup with animated conversation */}
        <section className="relative px-4 pb-12">
          <PhoneMockup />
          <p className="mt-6 text-center text-xs text-text-muted">
            Regarde l&apos;IA analyser en direct ☝️
          </p>
        </section>

        {/* CTA after demo */}
        <section className="px-4 pb-10">
          <div className="mx-auto max-w-md text-center">
            <Link
              href="/analyse"
              className="btn-gradient inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-bold text-white"
            >
              Analyse ta conversation
              <ChevronRight size={20} />
            </Link>
            <p className="mt-3 text-xs text-text-muted">
              1re analyse gratuite · Pas besoin de compte
            </p>
          </div>
        </section>

        {/* How it works — visual steps */}
        <section className="border-t border-white/5 px-4 py-10">
          <div className="mx-auto max-w-md">
            <h2 className="mb-8 text-center text-xl font-bold">
              3 étapes, 5 secondes
            </h2>
            <div className="relative space-y-0">
              {/* Connecting line */}
              <div className="absolute left-[27px] top-[40px] h-[calc(100%-80px)] w-px bg-gradient-to-b from-accent-pink/40 via-accent-purple/40 to-accent-blue/40" />

              {[
                {
                  icon: Camera,
                  color: "from-pink-500/20 to-rose-500/10 border-pink-500/20",
                  iconColor: "text-pink-400",
                  num: "1",
                  title: "Screenshot ta convo",
                  desc: "Tinder, Insta, Snap, SMS, WhatsApp... tout marche",
                },
                {
                  icon: Zap,
                  color: "from-purple-500/20 to-violet-500/10 border-purple-500/20",
                  iconColor: "text-purple-400",
                  num: "2",
                  title: "L'IA analyse en 5s",
                  desc: "Note /10 avec une explication honnête et sans filtre",
                },
                {
                  icon: Copy,
                  color: "from-blue-500/20 to-cyan-500/10 border-blue-500/20",
                  iconColor: "text-blue-400",
                  num: "3",
                  title: "Copie la meilleure réponse",
                  desc: "4 styles : 😂 Drôle · 😏 Charmeur · 🎯 Direct · 🌙 Mystérieux",
                },
              ].map(({ icon: Icon, color, iconColor, num, title, desc }) => (
                <div key={num} className="relative flex items-start gap-4 pb-6">
                  <div
                    className={`relative z-10 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br ${color}`}
                  >
                    <Icon size={22} className={iconColor} />
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-text-secondary">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="border-t border-white/5 px-4 py-10">
          <div className="mx-auto max-w-md">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { value: "10k+", label: "Analyses" },
                { value: "8.2", label: "Note moyenne" },
                { value: "4.8★", label: "Avis utilisateurs" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/5 bg-bg-card py-4"
                >
                  <p className="text-xl font-black gradient-text">{value}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 pb-10">
          <div className="mx-auto max-w-md space-y-3">
            {[
              {
                text: "J'ai envoyé mon screen et j'ai eu un 4/10 😭 mais la réponse drôle qu'elle m'a proposée a tout changé, on a rdv vendredi",
                name: "Lucas, 22 ans",
              },
              {
                text: "Meilleur investissement ever. Je copie-colle les réponses et mon taux de réponse a doublé sur Tinder",
                name: "Sarah, 25 ans",
              },
              {
                text: "L'IA m'a dit que j'étais trop insistant, j'ai pris du recul et ça a marché. Parfois faut entendre la vérité",
                name: "Mehdi, 27 ans",
              },
            ].map(({ text, name }) => (
              <div
                key={name}
                className="glass-card p-4"
              >
                <div className="mb-2 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="mb-2 text-sm leading-relaxed text-text-secondary">
                  &quot;{text}&quot;
                </p>
                <p className="text-xs font-medium text-text-muted">{name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t border-white/5 px-4 py-10">
          <div className="mx-auto max-w-md">
            <h2 className="mb-2 text-center text-xl font-bold">Tarifs</h2>
            <p className="mb-6 text-center text-sm text-text-secondary">
              Résilie en 1 clic, sans engagement
            </p>

            <div className="space-y-3">
              {/* Monthly - Highlighted */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-accent-pink bg-gradient-to-br from-accent-pink/10 to-accent-purple/5 p-5">
                <div className="absolute right-3 top-3 rounded-full bg-accent-pink px-2.5 py-0.5 text-xs font-bold text-white">
                  -40%
                </div>
                <div className="mb-1 text-sm font-medium text-accent-pink">
                  Le plus populaire
                </div>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-3xl font-black">25€</span>
                  <span className="text-text-secondary">/mois</span>
                </div>
                <p className="mb-4 text-sm text-text-secondary">
                  Soit 6,25€/sem au lieu de 10€ ·{" "}
                  <strong className="text-green-400">Économise 40%</strong>
                </p>
                <Link
                  href="/analyse"
                  className="btn-gradient flex w-full items-center justify-center rounded-xl py-3 text-sm font-bold text-white"
                >
                  Commencer
                </Link>
              </div>

              {/* Trial / Weekly */}
              <div className="rounded-2xl border border-white/10 bg-bg-card p-5">
                <div className="mb-1 text-sm font-medium text-text-secondary">
                  Essai
                </div>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-3xl font-black">2€</span>
                  <span className="text-text-secondary">pour 3 jours</span>
                </div>
                <p className="mb-4 text-sm text-text-secondary">
                  Puis 10€/semaine · Résiliation en 1 clic
                </p>
                <Link
                  href="/analyse"
                  className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-bg-elevated py-3 text-sm font-semibold text-text-primary transition hover:bg-white/5"
                >
                  Essayer 3 jours
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="border-t border-white/5 px-4 py-10">
          <div className="mx-auto max-w-md space-y-3">
            {[
              {
                icon: Shield,
                text: "Tes images ne sont jamais stockées",
              },
              {
                icon: Shield,
                text: "L'IA refuse les conversations inappropriées",
              },
              {
                icon: Shield,
                text: "Résiliation en 1 clic · Conforme RGPD",
              },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-bg-card/50 px-4 py-3"
              >
                <Icon size={16} className="shrink-0 text-green-400" />
                <span className="text-sm text-text-secondary">{text}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-6 text-center text-xs text-text-muted">
        <div className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link href="/mentions-legales" className="hover:text-text-secondary">
            Mentions légales
          </Link>
          <Link href="/cgv" className="hover:text-text-secondary">
            CGV
          </Link>
          <Link href="/confidentialite" className="hover:text-text-secondary">
            Confidentialité
          </Link>
          <Link href="/compte" className="hover:text-text-secondary">
            Résilier
          </Link>
        </div>
        <p className="mt-3">© 2025 CrushMe. Tous droits réservés.</p>
      </footer>

      {/* Spacer for sticky CTA */}
      <div className="h-20" />

      {/* Sticky CTA */}
      <div className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-bg-primary/95 px-4 py-3 backdrop-blur-xl">
        <Link
          href="/analyse"
          className="btn-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-bold text-white"
        >
          <Flame size={18} />
          Analyse ta conversation
        </Link>
      </div>
    </div>
  );
}

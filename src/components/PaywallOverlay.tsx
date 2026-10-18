"use client";

import { Lock, Sparkles } from "lucide-react";

interface Props {
  onSubscribe: () => void;
}

export default function PaywallOverlay({ onSubscribe }: Props) {
  return (
    <div className="relative mt-4 rounded-2xl border border-accent-pink/20 bg-gradient-to-b from-accent-pink/5 to-transparent p-5 text-center">
      <div className="mb-3 flex items-center justify-center gap-2">
        <Lock size={18} className="text-accent-pink" />
        <span className="text-sm font-semibold text-text-primary">
          Débloque tes réponses
        </span>
      </div>
      <p className="mx-auto mb-4 max-w-xs text-sm text-text-secondary">
        Ta note est là, mais les réponses sont floutées. Abonne-toi pour
        voir les suggestions et copier les messages.
      </p>
      <button
        onClick={onSubscribe}
        className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white"
      >
        <Sparkles size={16} />
        Essai 3 jours — 2 €
      </button>
      <p className="mt-2 text-xs text-text-muted">
        Puis 10 €/sem. Résilie quand tu veux.
      </p>
    </div>
  );
}

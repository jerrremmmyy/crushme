"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

interface Props {
  tone: string;
  toneLabel: string;
  toneEmoji: string;
  message: string;
  blurred?: boolean;
  onRegenerate?: (tone: string) => void;
  isRegenerating?: boolean;
}

export default function SuggestionCard({
  tone,
  toneLabel,
  toneEmoji,
  message,
  blurred = false,
  onRegenerate,
  isRegenerating = false,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toneColors: Record<string, string> = {
    drole: "from-amber-500/20 to-orange-500/10 border-amber-500/20",
    charmeur: "from-pink-500/20 to-rose-500/10 border-pink-500/20",
    direct: "from-blue-500/20 to-cyan-500/10 border-blue-500/20",
    mysterieux: "from-violet-500/20 to-purple-500/10 border-violet-500/20",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-4 ${toneColors[tone] || toneColors.direct}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">
          {toneEmoji} {toneLabel.replace(/^.*?\s/, "")}
        </span>
        <div className="flex items-center gap-2">
          {onRegenerate && !blurred && (
            <button
              onClick={() => onRegenerate(tone)}
              disabled={isRegenerating}
              className="rounded-full p-1.5 text-text-muted transition hover:bg-white/10 hover:text-text-primary disabled:opacity-50"
              aria-label="Régénérer"
            >
              <RefreshCw
                size={14}
                className={isRegenerating ? "animate-spin" : ""}
              />
            </button>
          )}
          {!blurred && (
            <button
              onClick={handleCopy}
              className="rounded-full p-1.5 text-text-muted transition hover:bg-white/10 hover:text-text-primary"
              aria-label="Copier"
            >
              {copied ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          )}
        </div>
      </div>
      <p
        className={`text-[15px] leading-relaxed ${blurred ? "blur-paywall" : ""}`}
      >
        {message}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

function getScoreColor(score: number) {
  if (score <= 3) return { stroke: "#ef4444", glow: "rgba(239,68,68,0.3)" };
  if (score <= 5) return { stroke: "#f97316", glow: "rgba(249,115,22,0.3)" };
  if (score <= 7) return { stroke: "#8b5cf6", glow: "rgba(139,92,246,0.3)" };
  return { stroke: "#22c55e", glow: "rgba(34,197,94,0.3)" };
}

function getScoreLabel(score: number) {
  if (score <= 2) return "Aïe... 💀";
  if (score <= 4) return "Peut mieux faire";
  if (score <= 6) return "Pas mal !";
  if (score <= 8) return "Solide 💪";
  return "Masterclass 🔥";
}

export default function ScoreRing({
  score,
  size = 180,
}: {
  score: number;
  size?: number;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const { stroke, glow } = getScoreColor(score);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 10) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="animate-score-pop"
          style={{ filter: `drop-shadow(0 0 20px ${glow})` }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-black leading-none"
            style={{ fontSize: size * 0.3, color: stroke }}
          >
            {score}
          </span>
          <span
            className="text-text-secondary font-medium"
            style={{ fontSize: size * 0.08 }}
          >
            / 10
          </span>
        </div>
      </div>
      <span className="text-sm font-semibold text-text-secondary">
        {getScoreLabel(score)}
      </span>
    </div>
  );
}

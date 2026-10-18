"use client";

import { useEffect, useState, useRef } from "react";

interface Message {
  text: string;
  isUser: boolean;
  delay: number;
}

const CONVERSATION: Message[] = [
  { text: "Salut ! Ton profil m'a grave intrigué 👀", isUser: false, delay: 800 },
  { text: "Ah ouais ? Qu'est-ce qui t'a intrigué ?", isUser: true, delay: 2000 },
  { text: "Ton sourire sur la 2e photo, on dirait que t'as un secret", isUser: false, delay: 3500 },
  { text: "Haha peut-être bien 😏 tu veux le découvrir ?", isUser: true, delay: 5200 },
  { text: "Carrément ! Tu fais quoi ce weekend ?", isUser: false, delay: 7000 },
  { text: "Rien de spécial, pourquoi ?", isUser: true, delay: 8800 },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#2a2a3e] px-4 py-3 w-fit">
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
    </div>
  );
}

export default function PhoneMockup() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [showTyping, setShowTyping] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [scoreValue, setScoreValue] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    CONVERSATION.forEach((msg, i) => {
      const typingTimer = setTimeout(() => {
        setShowTyping(true);
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, msg.delay - 600);
      timers.push(typingTimer);

      const msgTimer = setTimeout(() => {
        setShowTyping(false);
        setVisibleMessages(i + 1);
        if (chatRef.current) {
          setTimeout(() => {
            if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }, 50);
        }
      }, msg.delay);
      timers.push(msgTimer);
    });

    const analysisTimer = setTimeout(() => {
      setShowAnalysis(true);
    }, 10500);
    timers.push(analysisTimer);

    const scoreTimer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 0.5;
        if (current > 6.5) {
          clearInterval(interval);
          setScoreValue(6.5);
        } else {
          setScoreValue(current);
        }
      }, 60);
      timers.push(interval as unknown as NodeJS.Timeout);
    }, 11000);
    timers.push(scoreTimer);

    return () => {
      timers.forEach(clearTimeout);
      setVisibleMessages(0);
      setShowTyping(false);
      setShowAnalysis(false);
      setScoreValue(0);
    };
  }, []);

  return (
    <div className="relative mx-auto w-[280px]">
      {/* Phone frame */}
      <div className="relative overflow-hidden rounded-[2.5rem] border-[3px] border-white/10 bg-[#0d0c14] shadow-[0_0_60px_rgba(233,48,255,0.15)]">
        {/* Notch */}
        <div className="relative z-10 flex items-center justify-center bg-[#0d0c14] px-6 pb-1 pt-3">
          <div className="h-[22px] w-[90px] rounded-full bg-black" />
        </div>

        {/* App header */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-[#0d0c14] px-4 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
          <div>
            <p className="text-xs font-semibold text-white">Marie 🦋</p>
            <p className="text-[10px] text-green-400">En ligne</p>
          </div>
        </div>

        {/* Chat area */}
        <div
          ref={chatRef}
          className="no-scrollbar h-[320px] overflow-y-auto bg-[#0d0c14] px-3 py-3"
        >
          <div className="space-y-2">
            {CONVERSATION.slice(0, visibleMessages).map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                style={{
                  animation: "fadeUp 0.3s ease-out",
                }}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                    msg.isUser
                      ? "rounded-br-md bg-gradient-to-r from-accent-pink to-accent-purple text-white"
                      : "rounded-bl-md bg-[#2a2a3e] text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {showTyping && visibleMessages < CONVERSATION.length && (
              <div className="flex justify-start" style={{ animation: "fadeUp 0.2s ease-out" }}>
                {CONVERSATION[visibleMessages]?.isUser ? null : <TypingIndicator />}
              </div>
            )}
          </div>
        </div>

        {/* Analysis overlay */}
        {showAnalysis && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d0c14]/95 backdrop-blur-md"
            style={{ animation: "fadeUp 0.5s ease-out" }}
          >
            {/* Score */}
            <div className="mb-2 text-center" style={{ animation: "scorePop 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>
              <p className="mb-1 text-xs font-medium text-text-secondary">Ta note</p>
              <p className="text-5xl font-black text-accent-pink">
                {scoreValue.toFixed(1)}
              </p>
              <p className="text-sm text-text-muted">/10</p>
            </div>

            <p className="mb-4 px-6 text-center text-xs leading-relaxed text-text-secondary">
              &quot;Réponse trop safe, ose un peu plus ! Le &apos;rien de spécial&apos; casse la vibe.&quot;
            </p>

            {/* Mini suggestions */}
            <div className="w-full space-y-1.5 px-4">
              {[
                { emoji: "😂", label: "Drôle", text: "J'avais prévu de sauver le monde, mais pour toi je peux décaler" },
                { emoji: "😏", label: "Charmeur", text: "Maintenant que tu me parles, mon weekend s'annonce bien mieux..." },
                { emoji: "🎯", label: "Direct", text: "Je me libère, t'as un endroit préféré en tête ?" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2"
                  style={{
                    animation: `fadeUp 0.4s ease-out ${0.3 + i * 0.15}s both`,
                  }}
                >
                  <p className="mb-0.5 text-[10px] font-semibold text-text-muted">
                    {s.emoji} {s.label}
                  </p>
                  <p className="text-[11px] leading-snug text-gray-300">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Glow effects behind phone */}
      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-b from-accent-pink/20 via-accent-purple/10 to-transparent blur-2xl" />
    </div>
  );
}

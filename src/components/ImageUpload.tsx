"use client";

import { useRef, useState, useCallback } from "react";
import { Camera, ImagePlus, Loader2 } from "lucide-react";

interface Props {
  onImageSelected: (base64: string, mediaType: string) => void;
  isLoading: boolean;
}

export default function ImageUpload({ onImageSelected, isLoading }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 10 * 1024 * 1024) {
        alert("Image trop lourde (max 10 Mo)");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(",")[1];
        onImageSelected(base64, file.type);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) processFile(file);
        }
      }
    },
    [processFile]
  );

  return (
    <div
      onPaste={handlePaste}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
      }}
      className={`relative mx-auto w-full max-w-md rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
        dragOver
          ? "border-accent-pink bg-accent-pink/5"
          : "border-white/10 bg-bg-card/50"
      } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />

      {isLoading ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <Loader2 size={48} className="animate-spin text-accent-pink" />
            <div className="absolute inset-0 animate-ping rounded-full bg-accent-pink/20" />
          </div>
          <div>
            <p className="text-lg font-semibold">Analyse en cours...</p>
            <p className="mt-1 text-sm text-text-secondary">
              L'IA lit ta conversation
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 p-4">
            <ImagePlus size={32} className="text-accent-pink" />
          </div>
          <div>
            <p className="text-lg font-semibold">Envoie ta capture</p>
            <p className="mt-1 text-sm text-text-secondary">
              Screenshot de Tinder, Insta, Snap, SMS...
            </p>
          </div>
          <div className="flex w-full gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-gradient flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white"
            >
              <Camera size={18} />
              Galerie
            </button>
            <button
              onClick={() => {
                navigator.clipboard
                  .read()
                  .then((items) => {
                    for (const item of items) {
                      for (const type of item.types) {
                        if (type.startsWith("image/")) {
                          item.getType(type).then((blob) => {
                            const file = new File([blob], "paste.png", {
                              type,
                            });
                            processFile(file);
                          });
                        }
                      }
                    }
                  })
                  .catch(() => {
                    alert(
                      "Colle ton image ici (Ctrl+V) ou utilise la galerie"
                    );
                  });
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-bg-elevated px-4 py-3.5 text-sm font-semibold text-text-primary transition hover:bg-white/5"
            >
              Coller
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

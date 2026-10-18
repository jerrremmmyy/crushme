"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Clock, User } from "lucide-react";

const navItems = [
  { href: "/analyse", label: "Analyse", icon: Flame },
  { href: "/historique", label: "Historique", icon: Clock },
  { href: "/compte", label: "Compte", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-bg-primary/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs font-medium transition ${
                isActive ? "text-accent-pink" : "text-text-muted"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

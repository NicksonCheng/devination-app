"use client";

import { Sparkles, User, LogIn, LogOut, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import type { Page } from "./AppShell";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { logout } from "@/app/login/actions";

interface NavbarProps {
  user: SupabaseUser | null;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navbar({ user, currentPage, onNavigate }: NavbarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isLoggedIn = !!user;
  const navLinks: { label: string; page: Page }[] = [
    { label: "✦ 首頁", page: "home" },
    { label: "☽ 塔羅配對", page: "tarot" },
  ];
  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-amber-500/20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
        >
          <div className="relative">
            <Moon className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors" />
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-300 float-anim" />
          </div>
          <span className="text-lg font-bold tracking-wider shimmer-text">
            命定香氣探索
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                currentPage === page
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-amber-100/60 hover:text-amber-200 hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Auth button */}
        {isLoggedIn ? (
          <button
            onClick={() => startTransition(() => logout())}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-300
              border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-red-900/20 hover:border-red-500/40 hover:text-red-300
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">
              {user?.email?.split("@")[0]}
            </span>
            <LogOut className="w-3 h-3 opacity-60" />
          </button>
        ) : (
          <button
            onClick={() => {
              router.push("/login");
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-300
              border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 glow-border"
          >
            <LogIn className="w-4 h-4" />
            <span>登入 / 註冊</span>
          </button>
        )}
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex gap-2 px-4 pb-2">
        {navLinks.map(({ label, page }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex-1 py-1 rounded-full text-xs transition-all duration-200 ${
              currentPage === page
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-amber-100/50 hover:text-amber-200 hover:bg-white/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}

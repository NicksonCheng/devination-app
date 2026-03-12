"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import LandingPage from "./LandingPage";
import TarotPairing from "./TarotPairing";
import StarField from "./StarField";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export type Page = "home" | "tarot";

export default function AppShell({ children }: { children?: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>("home");

  useEffect(() => {
    const supabase = createClient();

    // 取得初始 session
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // 監聽認證狀態變化（登入/登出）
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null),
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0B1021] overflow-x-hidden">
      {/* Animated star background */}
      <StarField />

      {/* Radial gradient overlays for depth */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-900/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-900/20 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-950/30 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          user={user}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />

        <main className="flex-1">
          {currentPage === "home" && (
            <LandingPage onNavigateTarot={() => setCurrentPage("tarot")} />
          )}
          {currentPage === "tarot" && <TarotPairing />}
        </main>

        <footer className="text-center text-amber-500/40 text-xs py-4 border-t border-amber-500/10">
          ✦ 命定香氣探索 · Soulmate Scent © 2026 ✦
        </footer>
      </div>
    </div>
  );
}

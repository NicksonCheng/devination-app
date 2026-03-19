"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import LandingPage from "./LandingPage";
import TarotPairing from "./TarotPairing";
import FragranceQuiz from "./FragranceQuiz";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export type Page = "home" | "tarot" | "quiz";

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
    <div className="relative min-h-screen bg-[#FDFBF7] overflow-x-hidden">
      {/* Soft ambient background accents */}
      <div className="pointer-events-none fixed inset-0 z-0 will-change-transform">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[500px] sm:h-[500px] rounded-full bg-rose-100/40 blur-[60px] sm:blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[160px] h-[160px] sm:w-[400px] sm:h-[400px] rounded-full bg-amber-100/40 blur-[50px] sm:blur-[80px]" />
        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-stone-100/60 blur-[100px]" />
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
            <LandingPage
              onNavigateTarot={() => setCurrentPage("tarot")}
              onNavigateQuiz={() => setCurrentPage("quiz")}
            />
          )}
          {currentPage === "tarot" && <TarotPairing />}
          {currentPage === "quiz" && <FragranceQuiz />}
        </main>

        <footer className="text-center text-stone-400 text-xs py-4 border-t border-stone-200">
          ✦ 命定香氣探索 · Soulmate Scent © 2026 ✦
        </footer>
      </div>
    </div>
  );
}

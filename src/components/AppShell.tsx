"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import LandingPage from "./LandingPage";
import TarotPairing from "./TarotPairing";
import FragranceQuiz from "./FragranceQuiz";
import NumerologyScent from "./NumerologyScent";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Content } from "@/lib/content";

export type Page = "home" | "tarot" | "quiz" | "numerology";

interface AppShellProps {
  content: Pick<
    Content,
    | "energyPhrases"
    | "energyLink"
    | "scentExploreLink"
    | "masterPhotoUrl"
    | "masterBio"
    | "zodiacs"
    | "quizQuestions"
  >;
  isAdmin: boolean;
}

export default function AppShell({ content, isAdmin }: AppShellProps) {
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
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          user={user}
          isAdmin={isAdmin}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />

        <main className="flex-1">
          {currentPage === "home" && (
            <LandingPage
              energyPhrases={content.energyPhrases}
              energyLink={content.energyLink}
              scentExploreLink={content.scentExploreLink}
              masterPhotoUrl={content.masterPhotoUrl}
              masterBio={content.masterBio}
            />
          )}
          {currentPage === "tarot" && <TarotPairing zodiacs={content.zodiacs} />}
          {currentPage === "quiz" && (
            <FragranceQuiz questions={content.quizQuestions} />
          )}
          {currentPage === "numerology" && <NumerologyScent />}
        </main>

        <footer className="border-t border-stone-200 bg-[#FDFBF7] px-4 py-10">
          <div className="max-w-xl mx-auto flex flex-col items-center gap-5">
            {/* Brand */}
            <div className="text-center">
              <p className="text-stone-700 font-semibold tracking-[0.2em] text-sm">馥境</p>
              <p className="text-stone-400 text-xs tracking-widest mt-0.5">FRAGRANCE REALM</p>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {/* Email */}
              <a
                href="mailto:kouzou21895@gmail.com"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-500 text-xs hover:border-amber-300 hover:text-amber-700 transition-all shadow-sm"
                title="kouzou21895@gmail.com"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m2 7 10 7 10-7"/>
                </svg>
                Email
              </a>

              {/* Line */}
              <a
                href="https://line.me/R/ti/p/@753gszew"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-500 text-xs hover:border-green-300 hover:text-green-600 transition-all shadow-sm"
                title="Line @753gszew"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                Line@
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/__fenny1998/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-500 text-xs hover:border-pink-300 hover:text-pink-600 transition-all shadow-sm"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth="0"/>
                </svg>
                Instagram
              </a>
            </div>

            <p className="text-stone-300 text-xs">© 2026 馥境 FRAGRANCE REALM</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

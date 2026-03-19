"use client";

import {
  FlaskConical,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  BookOpen,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, useEffect } from "react";
import type { Page } from "./AppShell";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface NavbarProps {
  user: SupabaseUser | null;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navbar({ user, currentPage, onNavigate }: NavbarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = !!user;

  const displayName =
    (user?.user_metadata?.nickname as string | undefined) ||
    user?.email?.split("@")[0] ||
    "用戶";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.refresh();
    });
  };

  const navLinks: { label: string; page: Page }[] = [
    { label: "首頁", page: "home" },
    { label: "🧬 配對分析", page: "tarot" },
    { label: "🧪 香氛測驗", page: "quiz" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-md border-b border-stone-200/80 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
        >
          <FlaskConical className="w-5 h-5 text-amber-700 group-hover:text-amber-600 transition-colors" />
          <span className="text-base font-bold tracking-wide text-stone-800 group-hover:text-amber-800 transition-colors">
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
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Auth area */}
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown trigger */}
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              disabled={isPending}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-300
                border-stone-200 bg-stone-50 text-stone-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <User className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline max-w-[96px] truncate">
                {displayName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-[#E5E0D8] shadow-md
                  animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-stone-100">
                  <p className="text-xs text-stone-400">登入身份</p>
                  <p className="text-sm font-semibold text-stone-700 truncate">
                    {displayName}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-amber-500" />
                    個人資料
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/history");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    我的專屬紀錄
                  </button>
                  <div className="my-1 border-t border-stone-100" />
                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-4 h-4" />
                    登出
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300
              bg-[#8B7D6B] text-white hover:bg-[#7a6c5c] hover:shadow-md"
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
                ? "bg-amber-100 text-amber-800 border border-amber-300"
                : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}

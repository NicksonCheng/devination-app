"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  FlaskConical,
  ArrowLeft,
  Loader2,
  FlaskRound,
  Brain,
  Calendar,
  X,
} from "lucide-react";

interface HistoryRow {
  id: string;
  quiz_type: string;
  result_data: Record<string, unknown>;
  created_at: string;
}

/* ────────────────── Detail Modal ────────────────── */
function DetailModal({
  row,
  onClose,
  formatDate,
  quizLabel,
}: {
  row: HistoryRow;
  onClose: () => void;
  formatDate: (iso: string) => string;
  quizLabel: (t: string) => string;
}) {
  const rd = row.result_data;
  const title =
    (rd.title as string) || (rd.result as string) || quizLabel(row.quiz_type);

  const isLab = row.quiz_type === "fragrance_lab";

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Scent notes helper — handles both flat (lab) and nested (quiz) shapes
  const scentTop = isLab
    ? (rd.top as string)
    : ((rd.scent_notes as Record<string, string>)?.top ?? "");
  const scentMid = isLab
    ? (rd.middle as string)
    : ((rd.scent_notes as Record<string, string>)?.middle ?? "");
  const scentBase = isLab
    ? (rd.base as string)
    : ((rd.scent_notes as Record<string, string>)?.base ?? "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white border border-stone-200 rounded-3xl shadow-xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header band */}
        <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-t-3xl px-6 pt-6 pb-5 border-b border-stone-100">
          <div className="flex items-center gap-2 mb-3">
            {isLab ? (
              <FlaskRound className="w-5 h-5 text-amber-600" />
            ) : (
              <Brain className="w-5 h-5 text-rose-500" />
            )}
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/80 text-amber-700">
              {quizLabel(row.quiz_type)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-800 leading-snug">
            {title}
          </h2>
          <div className="flex items-center gap-1.5 mt-2 text-stone-400 text-xs">
            <Calendar className="w-3 h-3" />
            {formatDate(row.created_at)}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Lab: sign pair */}
          {isLab &&
            typeof rd.signA === "string" &&
            typeof rd.signB === "string" && (
              <Section label="星座配對">
                <p className="text-stone-700 text-sm">
                  {rd.signA} × {rd.signB}
                </p>
              </Section>
            )}

          {/* Quiz: MBTI */}
          {!isLab && typeof rd.mbti === "string" && (
            <Section label="MBTI 類型">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
                {rd.mbti}
              </span>
            </Section>
          )}

          {/* Description / personality_desc */}
          {typeof rd.description === "string" && (
            <Section label="描述">
              <p className="text-stone-600 text-sm leading-relaxed">
                {rd.description}
              </p>
            </Section>
          )}
          {typeof rd.personality_desc === "string" && (
            <Section label="人格描述">
              <p className="text-stone-600 text-sm leading-relaxed">
                {rd.personality_desc}
              </p>
            </Section>
          )}

          {/* Scent notes */}
          {(scentTop || scentMid || scentBase) && (
            <Section label="香氛調性">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "前調", value: scentTop },
                  { label: "中調", value: scentMid },
                  { label: "後調", value: scentBase },
                ].map(
                  (n) =>
                    n.value && (
                      <div
                        key={n.label}
                        className="bg-stone-50 rounded-xl p-3 text-center border border-stone-100"
                      >
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">
                          {n.label}
                        </p>
                        <p className="text-stone-700 text-xs font-medium">
                          {n.value}
                        </p>
                      </div>
                    ),
                )}
              </div>
            </Section>
          )}

          {/* Advice */}
          {typeof rd.advice === "string" && (
            <Section label="建議">
              <p className="text-stone-600 text-sm leading-relaxed">
                {rd.advice}
              </p>
            </Section>
          )}

          {/* Life application */}
          {typeof rd.life_application === "string" && (
            <Section label="生活應用">
              <p className="text-stone-600 text-sm leading-relaxed">
                {rd.life_application}
              </p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-stone-400 text-[10px] tracking-widest uppercase mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}

/* ────────────────── Page ────────────────── */

export default function HistoryPage() {
  const router = useRouter();
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<HistoryRow | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("quiz_history")
        .select("id, quiz_type, result_data, created_at")
        .order("created_at", { ascending: false });

      if (fetchError) {
        if (fetchError.message.includes("quiz_history")) {
          setRows([]);
        } else {
          setError(fetchError.message);
        }
      } else {
        setRows((data as HistoryRow[]) ?? []);
      }
      setLoading(false);
    });
  }, [router]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quizLabel = (type: string) =>
    type === "fragrance_lab" ? "靈魂香氛實驗室" : "香氛人格測試";

  const QuizIcon = ({ type }: { type: string }) =>
    type === "fragrance_lab" ? (
      <FlaskRound className="w-5 h-5 text-amber-600" />
    ) : (
      <Brain className="w-5 h-5 text-rose-500" />
    );

  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] flex flex-col items-center px-4 py-8 overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[500px] sm:h-[500px] rounded-full bg-rose-100/40 blur-[60px] sm:blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[160px] h-[160px] sm:w-[400px] sm:h-[400px] rounded-full bg-amber-100/40 blur-[50px] sm:blur-[80px]" />
        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-stone-100/60 blur-[100px]" />
      </div>

      {/* Back */}
      <div className="relative z-10 w-full max-w-2xl mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-400 hover:text-amber-700 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <FlaskConical className="w-7 h-7 text-amber-700" />
        </div>
        <div className="flex items-center justify-center gap-3 mb-2 text-stone-400 text-xs tracking-widest">
          <span>✦</span>
          <span>MY HISTORY</span>
          <span>✦</span>
        </div>
        <h1 className="text-2xl font-bold text-stone-800 tracking-wide">
          我的專屬紀錄
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          回顧你的每一段香氣探索之旅
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-sm">
              還沒有任何紀錄，快去探索你的命定香氣吧 ✦
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => {
              const rd = row.result_data;
              const title =
                (rd.title as string) ||
                (rd.result as string) ||
                quizLabel(row.quiz_type);

              return (
                <button
                  key={row.id}
                  onClick={() => setSelected(row)}
                  className="w-full text-left bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-0.5 p-2 rounded-xl bg-amber-50">
                      <QuizIcon type={row.quiz_type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          {quizLabel(row.quiz_type)}
                        </span>
                      </div>
                      <h3 className="text-stone-800 font-semibold text-sm truncate">
                        {title}
                      </h3>
                      {typeof rd.personality_desc === "string" && (
                        <p className="text-stone-500 text-xs mt-1 line-clamp-2">
                          {rd.personality_desc}
                        </p>
                      )}
                      {Array.isArray(rd.scent_notes) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(rd.scent_notes as string[])
                            .slice(0, 4)
                            .map((note) => (
                              <span
                                key={note}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-500"
                              >
                                {note}
                              </span>
                            ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mt-2 text-stone-400 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        {formatDate(row.created_at)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <DetailModal
          row={selected}
          onClose={closeModal}
          formatDate={formatDate}
          quizLabel={quizLabel}
        />
      )}
    </div>
  );
}

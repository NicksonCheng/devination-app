"use client";

import { useState, useTransition } from "react";
import {
  User,
  Shield,
  ChevronDown,
  ChevronUp,
  Brain,
  FlaskRound,
  Moon,
  Calendar,
  Clock,
  Hash,
  Phone,
  Cake,
  Loader2,
  X,
} from "lucide-react";
import type { AdminUser, AdminHistoryRow } from "@/app/actions/admin";
import { getUserHistory } from "@/app/actions/admin";

/* ------------------------------------------------------------------ */
/*  後台帳號總覽                                                        */
/* ------------------------------------------------------------------ */

const QUIZ_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  personality_quiz: {
    label: "香氛人格",
    icon: <Brain className="w-3.5 h-3.5 text-rose-500" />,
  },
  fragrance_lab: {
    label: "靈魂香氣",
    icon: <FlaskRound className="w-3.5 h-3.5 text-amber-600" />,
  },
  numerology: {
    label: "流年香氣",
    icon: <Moon className="w-3.5 h-3.5 text-[#91634B]" />,
  },
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HistoryModal({
  user,
  rows,
  onClose,
}: {
  user: AdminUser;
  rows: AdminHistoryRow[];
  onClose: () => void;
}) {
  const name = user.nickname || user.email.split("@")[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white border border-stone-200 rounded-3xl shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-t-3xl px-6 pt-6 pb-5 border-b border-stone-100">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-700 font-medium">{name}</span>
            {user.is_admin && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                <Shield className="w-3 h-3" /> 管理員
              </span>
            )}
          </div>
          <p className="text-stone-500 text-xs">{user.email}</p>
          <p className="text-stone-800 font-semibold mt-1">
            共 {rows.length} 筆紀錄
          </p>
        </div>

        <div className="px-6 py-5 space-y-3">
          {rows.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-8">
              沒有任何測驗紀錄
            </p>
          ) : (
            rows.map((row) => {
              const q = QUIZ_LABELS[row.quiz_type] ?? {
                label: row.quiz_type,
                icon: null,
              };
              const rd = row.result_data;
              const title =
                (rd.title as string) ||
                (rd.result as string) ||
                q.label;
              return (
                <div
                  key={row.id}
                  className="border border-stone-100 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {q.icon}
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      {q.label}
                    </span>
                    <span className="text-stone-400 text-[11px] ml-auto flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(row.created_at)}
                    </span>
                  </div>
                  <p className="text-stone-800 text-sm font-medium">{title}</p>
                  {typeof rd.godName === "string" && (
                    <p className="text-stone-500 text-xs mt-1">
                      守護神：{rd.godName}
                    </p>
                  )}
                  {typeof rd.mbti === "string" && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs">
                      {rd.mbti}
                    </span>
                  )}
                  {typeof rd.signA === "string" && (
                    <p className="text-stone-500 text-xs mt-1">
                      {String(rd.signA)} × {String(rd.signB)}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<AdminHistoryRow[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const name = user.nickname || user.email.split("@")[0];

  const loadHistory = () => {
    if (rows !== null) {
      setModalOpen(true);
      return;
    }
    startTransition(async () => {
      const res = await getUserHistory(user.user_id);
      if (res.ok) {
        setRows(res.rows);
        setModalOpen(true);
      }
    });
  };

  return (
    <>
      <div className="border border-stone-200 rounded-2xl overflow-hidden">
        {/* Row header */}
        <button
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-stone-50 transition-colors text-left"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            {user.is_admin ? (
              <Shield className="w-4 h-4 text-amber-700" />
            ) : (
              <User className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-stone-800 truncate">
                {name}
              </span>
              {user.is_admin && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  管理員
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 truncate">{user.email}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-xs text-stone-400">
              <Hash className="w-3 h-3" />
              {user.quiz_count} 筆
            </span>
            {open ? (
              <ChevronUp className="w-4 h-4 text-stone-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-400" />
            )}
          </div>
        </button>

        {/* Expanded details */}
        {open && (
          <div className="border-t border-stone-100 px-4 py-4 bg-stone-50 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {user.birthdate && (
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Cake className="w-3.5 h-3.5 text-stone-400" />
                  <span>{user.birthdate}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-stone-500">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>加入 {formatDate(user.created_at)}</span>
              </div>
              {user.last_sign_in && (
                <div className="flex items-center gap-1.5 text-stone-500">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>最後登入 {formatDate(user.last_sign_in)}</span>
                </div>
              )}
            </div>

            <button
              onClick={loadHistory}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-sm text-stone-700 hover:border-amber-300 hover:text-amber-800 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FlaskRound className="w-4 h-4" />
              )}
              查看測驗紀錄（{user.quiz_count} 筆）
            </button>
          </div>
        )}
      </div>

      {modalOpen && rows !== null && (
        <HistoryModal
          user={user}
          rows={rows}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

export default function UsersPanel({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.nickname ?? "").toLowerCase().includes(q) ||
      (u.phone ?? "").includes(q)
    );
  });

  const totalQuizzes = users.reduce((sum, u) => sum + u.quiz_count, 0);

  return (
    <div className="space-y-4">
      {/* 統計 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "總帳號", value: users.length },
          { label: "管理員", value: users.filter((u) => u.is_admin).length },
          { label: "測驗總筆數", value: totalQuizzes },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-stone-200 rounded-2xl p-4 text-center"
          >
            <p className="text-2xl font-bold text-amber-700">{value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* 搜尋 */}
      <input
        type="text"
        placeholder="搜尋 Email、暱稱或電話…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
      />

      {/* 列表 */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-stone-400 text-sm text-center py-8">
            找不到符合的帳號
          </p>
        ) : (
          filtered.map((u) => <UserRow key={u.user_id} user={u} />)
        )}
      </div>
    </div>
  );
}

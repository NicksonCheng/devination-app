"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  KeyRound,
  Link as LinkIcon,
  FileText,
  Loader2,
  Plus,
  Trash2,
  RotateCcw,
  Users,
} from "lucide-react";
import type { Content, ContentKey } from "@/lib/content";
import type { AdminUser } from "@/app/actions/admin";
import {
  saveContent,
  resetContent,
  setNumerologyPassword,
} from "@/app/actions/admin";
import UsersPanel from "./UsersPanel";

/* ------------------------------------------------------------------ */
/*  調香師後台                                                          */
/* ------------------------------------------------------------------ */

type Section = "password" | "users" | ContentKey;
type Toast = { type: "success" | "error"; message: string } | null;

// 程式依賴的欄位，只顯示不可編輯（與 src/lib/content.ts 的 READONLY_FIELDS 一致）
const READONLY_FIELDS = new Set(["id", "scores"]);

const FIELD_LABELS: Record<string, string> = {
  title: "標題",
  description: "描述",
  top: "前調",
  middle: "中調",
  base: "後調",
  question: "題目",
  options: "選項",
  text: "選項文字",
  scores: "計分（不可修改）",
  id: "代碼（不可修改）",
  name: "名稱",
  symbol: "符號",
  element: "元素 / 香氣區",
  personality_desc: "人格描述",
  scent_notes: "香調",
  advice: "香氣建議",
  life_application: "生活應用",
  scentFamily: "香調家族",
  keywords: "關鍵字",
  ingredients: "香料",
  yearNumText: "流年徽章",
  yearTitle: "流年標題",
  godName: "香氣守護神",
  quote: "語錄",
  challenge: "年度生命課題",
  talent: "年度人生天賦",
  action: "年度行動指南",
  scents: "香氣組合",
  purchaseLink: "購買連結",
};

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300";

/* ────────────────── Generic JSON editor ────────────────── */

function fieldName(path: string) {
  return path.split(".").pop() ?? "";
}

function summaryOf(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const first = Object.values(value).find((v) => typeof v === "string");
    if (typeof first === "string") return first;
  }
  return "";
}

function ValueEditor({
  value,
  path,
  depth,
  onChange,
}: {
  value: unknown;
  path: string;
  depth: number;
  onChange: (v: unknown) => void;
}) {
  const readonly = READONLY_FIELDS.has(fieldName(path));

  if (readonly) {
    return (
      <p className="text-xs text-stone-400 font-mono">
        {Array.isArray(value) ? value.join(", ") : String(value)}
      </p>
    );
  }

  if (typeof value === "string") {
    return value.length > 40 ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(6, Math.ceil(value.length / 40) + 1)}
        className={`${inputClass} leading-relaxed`}
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    );
  }

  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <ValueEditor
                value={item}
                path={`${path}[${i}]`}
                depth={depth + 1}
                onChange={(v) => {
                  const next = [...value];
                  next[i] = v as string;
                  onChange(next);
                }}
              />
            </div>
            <button
              type="button"
              disabled={value.length <= 1}
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:pointer-events-none"
              title="刪除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, ""])}
          className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800"
        >
          <Plus className="w-3.5 h-3.5" /> 新增一項
        </button>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <Collapsible
            key={i}
            label={`#${i + 1}　${summaryOf(item)}`}
            depth={depth}
          >
            <ValueEditor
              value={item}
              path={`${path}[${i}]`}
              depth={depth + 1}
              onChange={(v) => {
                const next = [...value];
                next[i] = v;
                onChange(next);
              }}
            />
          </Collapsible>
        ))}
      </div>
    );
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const isRecord = depth === 0; // 最外層：MBTI、星座配對、流年數字等清單
    return (
      <div className="space-y-3">
        {Object.entries(obj).map(([k, v]) => {
          const childPath = path ? `${path}.${k}` : k;
          const editor = (
            <ValueEditor
              value={v}
              path={childPath}
              depth={depth + 1}
              onChange={(nv) => onChange({ ...obj, [k]: nv })}
            />
          );
          return isRecord ? (
            <Collapsible
              key={k}
              label={`${k}　${summaryOf(v)}`}
              depth={depth}
            >
              {editor}
            </Collapsible>
          ) : (
            <div key={k}>
              <p className="text-xs text-stone-500 mb-1">
                {FIELD_LABELS[k] ?? k}
              </p>
              {editor}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

function Collapsible({
  label,
  depth,
  children,
}: {
  label: string;
  depth: number;
  children: React.ReactNode;
}) {
  return (
    <details
      className={`rounded-2xl border border-stone-200 ${
        depth === 0 ? "bg-white" : "bg-stone-50"
      }`}
    >
      <summary className="cursor-pointer select-none px-4 py-3 text-sm text-stone-700 truncate">
        {label}
      </summary>
      <div className="px-4 pb-4">{children}</div>
    </details>
  );
}

/* ────────────────── Panel ────────────────── */

export default function AdminPanel({
  content,
  defaults,
  labels,
  updatedAt,
  hasPassword,
  users,
}: {
  content: Content;
  defaults: Content;
  labels: Record<ContentKey, string>;
  updatedAt: Record<string, string>;
  hasPassword: boolean;
  users: AdminUser[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [section, setSection] = useState<Section>("password");
  const [values, setValues] = useState<Content>(content);
  const [saved, setSaved] = useState<Content>(content);
  const [customized, setCustomized] = useState(
    () => new Set(Object.keys(updatedAt)),
  );
  const [password, setPassword] = useState("");
  const [passwordSet, setPasswordSet] = useState(hasPassword);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const isDirty = (key: ContentKey) =>
    JSON.stringify(values[key]) !== JSON.stringify(saved[key]);

  const handleSave = (key: ContentKey) => {
    startTransition(async () => {
      const res = await saveContent(key, values[key]);
      if (res.ok) {
        setSaved((s) => ({ ...s, [key]: values[key] }));
        setCustomized((c) => new Set(c).add(key));
        showToast("success", "已儲存，網站已同步更新 ✦");
      } else {
        showToast("error", res.error);
      }
    });
  };

  const handleReset = (key: ContentKey) => {
    if (!confirm(`確定要將「${labels[key]}」還原成預設內容嗎？`)) return;
    startTransition(async () => {
      const res = await resetContent(key);
      if (res.ok) {
        setValues((v) => ({ ...v, [key]: defaults[key] }));
        setSaved((s) => ({ ...s, [key]: defaults[key] }));
        setCustomized((c) => {
          const next = new Set(c);
          next.delete(key);
          return next;
        });
        showToast("success", "已還原預設內容");
      } else {
        showToast("error", res.error);
      }
    });
  };

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await setNumerologyPassword(password);
      if (res.ok) {
        setPassword("");
        setPasswordSet(true);
        showToast("success", "流年香氣密碼已更新，舊密碼即刻失效");
      } else {
        showToast("error", res.error);
      }
    });
  };

  const contentKeys = Object.keys(labels) as ContentKey[];
  const navItem = (key: Section, label: string, icon: React.ReactNode) => (
    <button
      key={key}
      onClick={() => setSection(key)}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
        section === key
          ? "bg-amber-100 text-amber-800"
          : "text-stone-600 hover:bg-stone-100"
      }`}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {key !== "password" && key !== "users" && isDirty(key as ContentKey) && (
        <span className="w-2 h-2 rounded-full bg-amber-500" title="尚未儲存" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-stone-400 hover:text-amber-700 transition-colors text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          回到首頁
        </button>

        <h1 className="text-2xl font-bold tracking-wide mb-1">調香師後台</h1>
        <p className="text-stone-500 text-sm mb-8">
          修改網站文字、連結與流年香氣密碼，儲存後立即生效。
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <nav className="md:w-60 shrink-0 space-y-1 bg-white border border-stone-200 rounded-2xl p-2 h-fit">
            {navItem(
              "users",
              `帳號管理（${users.length}）`,
              <Users className="w-4 h-4 text-amber-600" />,
            )}
            <div className="h-px bg-stone-100 my-1" />
            {navItem(
              "password",
              "流年香氣密碼",
              <KeyRound className="w-4 h-4 text-amber-600" />,
            )}
            {contentKeys.map((k) =>
              navItem(
                k,
                labels[k],
                k === "energyLink" ? (
                  <LinkIcon className="w-4 h-4 text-amber-600" />
                ) : (
                  <FileText className="w-4 h-4 text-amber-600" />
                ),
              ),
            )}
          </nav>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {section === "users" ? (
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">帳號管理</h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    點擊帳號可展開查看資料與測驗紀錄
                  </p>
                </div>
                <UsersPanel users={users} />
              </div>
            ) : section === "password" ? (
              <form
                onSubmit={handlePassword}
                className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4"
              >
                <h2 className="font-semibold">流年香氣密碼</h2>
                <p className="text-sm text-stone-500">
                  {passwordSet
                    ? "目前已設定密碼。設定新密碼後，舊密碼與已解鎖的客人都需重新輸入新密碼。"
                    : "尚未設定密碼，客人目前無法使用流年香氣。"}
                </p>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="輸入新密碼（至少 4 個字元）"
                  autoComplete="off"
                  className={inputClass}
                />
                <button
                  type="submit"
                  disabled={isPending || password.trim().length < 4}
                  className="px-5 py-2 rounded-xl bg-[#8B7D6B] text-white text-sm hover:bg-[#7a6c5c] disabled:opacity-50"
                >
                  {isPending ? "更新中…" : "更新密碼"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="font-semibold">{labels[section as ContentKey]}</h2>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {customized.has(section)
                        ? "使用後台修改過的內容"
                        : "使用預設內容"}
                    </p>
                  </div>
                  {customized.has(section as ContentKey) && (
                    <button
                      onClick={() => handleReset(section as ContentKey)}
                      disabled={isPending}
                      className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-500"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> 還原預設
                    </button>
                  )}
                </div>

                <ValueEditor
                  key={section}
                  value={values[section as ContentKey]}
                  path=""
                  depth={0}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [section]: v }))
                  }
                />

                <div className="sticky bottom-4 flex justify-end gap-2">
                  {isDirty(section as ContentKey) && (
                    <button
                      onClick={() =>
                        setValues((v) => ({
                          ...v,
                          [section]: saved[section as ContentKey],
                        }))
                      }
                      disabled={isPending}
                      className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-sm text-stone-600 shadow-sm"
                    >
                      取消修改
                    </button>
                  )}
                  <button
                    onClick={() => handleSave(section as ContentKey)}
                    disabled={isPending || !isDirty(section as ContentKey)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8B7D6B] text-white text-sm shadow-md hover:bg-[#7a6c5c] disabled:opacity-50"
                  >
                    {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    儲存
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg text-sm ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}

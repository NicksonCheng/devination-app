"use client";

export default function LoadingScreen({ message = "載入中" }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FDFBF7]"
      style={{ animation: "lsFadeIn 0.18s ease-out forwards" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(210,160,90,0.18) 0%, transparent 68%)",
        }}
      />

      {/* Bottle + wisps container */}
      <div className="relative mb-7" style={{ width: 80, height: 170 }}>
        {/* ── Scent wisps (above bottle) ── */}
        <svg
          viewBox="0 0 80 90"
          width="80"
          height="90"
          style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
          aria-hidden="true"
        >
          {[
            { cx: 22, delay: "0s" },
            { cx: 40, delay: "0.9s" },
            { cx: 58, delay: "1.8s" },
          ].map(({ cx, delay }) => (
            <path
              key={cx}
              d={`M ${cx} 88 C ${cx - 8} 72, ${cx + 8} 56, ${cx} 40 C ${cx - 8} 24, ${cx + 8} 10, ${cx} -4`}
              stroke="#C9956A"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              style={{ animation: `lsWisp 2.8s ease-in-out ${delay} infinite` }}
            />
          ))}
        </svg>

        {/* ── Perfume bottle ── */}
        <svg
          viewBox="0 0 80 90"
          width="80"
          height="90"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            animation: "lsFloat 3.2s ease-in-out infinite",
          }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lsBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7A4A28" stopOpacity="0.22" />
              <stop offset="35%" stopColor="white" stopOpacity="0.06" />
              <stop offset="65%" stopColor="white" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#5A3018" stopOpacity="0.28" />
            </linearGradient>
            <linearGradient id="lsCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6A3A18" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6A3A18" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Spray nozzle */}
          <rect x="34" y="2" width="14" height="5" rx="2.5" fill="#8A5E38" />
          <circle cx="48" cy="4.5" r="2.5" fill="#7A4E2A" />

          {/* Cap top rim */}
          <rect x="22" y="7" width="36" height="7" rx="3.5" fill="#A87049" />

          {/* Cap body */}
          <rect x="15" y="13" width="50" height="17" rx="5" fill="#A87049" />
          <rect x="15" y="13" width="50" height="17" rx="5" fill="url(#lsCapGrad)" />
          {/* Cap shine */}
          <rect x="21" y="16" width="5" height="9" rx="2.5" fill="white" opacity="0.18" />

          {/* Neck */}
          <rect x="27" y="29" width="26" height="16" rx="3" fill="#B8845A" />
          <rect x="29" y="31" width="4" height="11" rx="2" fill="white" opacity="0.14" />

          {/* Body */}
          <rect x="9" y="44" width="62" height="42" rx="9" fill="#C9956A" />
          <rect x="9" y="44" width="62" height="42" rx="9" fill="url(#lsBodyGrad)" />

          {/* Body highlight streak */}
          <rect x="15" y="50" width="5" height="24" rx="2.5" fill="white" opacity="0.22" />

          {/* Label area */}
          <rect x="15" y="52" width="50" height="28" rx="5" fill="white" opacity="0.09" />

          {/* Diamond ornament on label */}
          <path d="M 40 62 L 44 66 L 40 70 L 36 66 Z" fill="white" opacity="0.22" />
          <path d="M 40 64 L 42 66 L 40 68 L 38 66 Z" fill="#C9956A" opacity="0.5" />
        </svg>
      </div>

      {/* Brand */}
      <div className="text-center mb-5">
        <p className="text-stone-700 font-semibold tracking-[0.22em] text-sm">馥境</p>
        <p className="text-stone-400 text-[10px] tracking-widest mt-0.5">FRAGRANCE REALM</p>
      </div>

      {/* Message + bouncing dots */}
      <div className="flex items-center gap-1.5">
        <p className="text-stone-400 text-sm tracking-wide">{message}</p>
        <span className="flex gap-1 ml-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full bg-amber-400/80 inline-block"
              style={{
                animation: `lsDot 1.3s ease-in-out ${i * 0.22}s infinite`,
              }}
            />
          ))}
        </span>
      </div>

      <style>{`
        @keyframes lsFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lsFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes lsWisp {
          0%   { opacity: 0;    transform: translateY(6px);  }
          20%  { opacity: 0.65; }
          80%  { opacity: 0.38; }
          100% { opacity: 0;    transform: translateY(-10px); }
        }
        @keyframes lsDot {
          0%, 75%, 100% { opacity: 0.2;  transform: translateY(0);   }
          37%           { opacity: 1;    transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

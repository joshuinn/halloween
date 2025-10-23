"use client";
import React, { useMemo, useRef, useState } from "react";
import StarfieldBackground from "./Background";

type ToastType = "ok" | "error";

const HalloweenRSVP: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [personas, setPersonas] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const toastTimer = useRef<number | null>(null);

  // CSS variables y fondos globales para el tema
  const rootVars = useMemo(
    () =>
      ({
        "--bg": "#0b0b12",
        "--bg2": "#101019",
        "--accent": "#ff6a00",
        "--accent-2": "#ffb300",
        "--blood": "#c81e1e",
        "--fog": "#9aa0a6",
        "--text": "#e9e9ef",
        "--muted": "#b6b6c9",
        "--card": "#151523",
        "--card-2": "#1b1b2c",
        "--success": "#2dd4bf",
        "--error": "#f87171",
      } as React.CSSProperties),
    []
  );

  const showToast = (message: string, type: ToastType = "ok") => {
    setToast({ message, type });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3500);
  };

  const validateName = (v: string) => v.trim().length >= 2 && v.trim().length <= 50;
  const validateCount = (v: string) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateName(nombre)) {
      showToast("El nombre debe tener entre 2 y 50 caracteres.", "error");
      return;
    }
    if (!validateCount(personas)) {
      showToast("Indica un número de personas entre 1 y 20.", "error");
      return;
    }

    try {
      await fetch(
        `/api/confirm?name=${encodeURIComponent(
          nombre
        )}&peopleCount=${encodeURIComponent(personas)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error(error);
      showToast("Error al confirmar asistencia. Intenta nuevamente.", "error");
      return;
    }

    showToast(
      "¡Asistencia confirmada! Nos vemos en la noche más espeluznante 🎃",
      "ok"
    );
    setNombre("");
    setPersonas("");
  };

  return (
    <div
      style={rootVars}
      className="bg-[linear-gradient(180deg,var(--bg),var(--bg2))] relative overflow-hidden f"
    >
      <StarfieldBackground />
      <div
        aria-hidden
        className="fixed -inset-x-[10%] -top-[10%] h-[50vh] pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 50%, rgba(154,160,166,0.12), rgba(154,160,166,0))",
          filter: "blur(18px)",
          animation: "drift 26s linear infinite",
        }}
      />
      <div
        aria-hidden
        className="fixed top-[30%] -inset-x-[10%] h-[60vh] pointer-events-none z-10 opacity-50"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 50%, rgba(154,160,166,0.12), rgba(154,160,166,0))",
          filter: "blur(18px)",
          animation: "drift 36s linear infinite",
        }}
      />

      <main className="relative z-10 grid place-items-center px-4 sm:px-8 py-6">
        <section
          className="w-full max-w-[680px] rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-5 sm:p-8 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)), " +
              "radial-gradient(80% 120% at 0% 0%, rgba(255,106,0,0.05), transparent 60%), " +
              "radial-gradient(70% 110% at 100% 0%, rgba(200,30,30,0.06), transparent 60%), " +
              "var(--card)",
          }}
        >
          {/* Glow orbs */}
          <div
            aria-hidden
            className="absolute -right-[30%] -bottom-[30%] w-[360px] h-[360px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,106,0,0.12), transparent)",
              filter: "blur(18px)",
              transform: "rotate(15deg)",
            }}
          />
          <div
            aria-hidden
            className="absolute -left-[30%] -top-[30%] w-[360px] h-[360px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(200,30,30,0.14), transparent)",
              filter: "blur(18px)",
              transform: "rotate(-10deg)",
            }}
          />

          {/* Drip top */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-0 h-[18px] opacity-25"
            style={{
              background:
                "radial-gradient(12px 8px at 10% 100%, var(--blood), transparent 70%)," +
                "radial-gradient(10px 6px at 22% 100%, var(--blood), transparent 70%)," +
                "radial-gradient(12px 8px at 34% 100%, var(--blood), transparent 70%)," +
                "radial-gradient(8px 6px at 46% 100%, var(--blood), transparent 70%)," +
                "linear-gradient(90deg, var(--blood) 0 100%)",
              filter: "drop-shadow(0 6px 0 rgba(200,30,30,0.25))",
            }}
          />

          {/* Bats */}
          <div className="absolute right-[-10px] top-[-10px] w-[160px] h-[120px] opacity-90 pointer-events-none">
            {["b1", "b2", "b3"].map((b, i) => (
              <div
                key={b}
                className="absolute left-0 top-0 w-[22px] h-[10px] rounded-[10px_10px_6px_6px] z-10"
                style={{
                  left: i === 0 ? "10px" : i === 1 ? "50px" : "110px",
                  top: i === 0 ? "20px" : i === 1 ? "60px" : "30px",
                  transform:
                    i === 1 ? "scale(.9)" : i === 2 ? "scale(1.1)" : undefined,
                  background: "radial-gradient(closest-side, #0f0f17, #0a0a12)",
                  transformOrigin: "center",
                  animation: "fly 8s ease-in-out infinite",
                  animationDelay: `${0.8 * i}s`,
                }}
              >
                <span
                  aria-hidden
                  className="absolute -left-[12px] -top-[2px] block w-[14px] h-[10px] rounded-[0_10px_0_10px]"
                  style={{ background: "#0a0a12", transform: "rotate(-24deg)" }}
                />
                <span
                  aria-hidden
                  className="absolute -right-[12px] -top-[2px] block w-[14px] h-[10px] rounded-[0_10px_0_10px]"
                  style={{
                    background: "#0a0a12",
                    transform: "scaleX(-1) rotate(-24deg)",
                  }}
                />
              </div>
            ))}
          </div>

          <header className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 grid place-items-center rounded-xl border border-white/10 shadow-inner"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,179,0,0.18), rgba(255,106,0,0.08), transparent 70%)",
                boxShadow: "inset 0 0 16px rgba(255,106,0,0.15)",
              }}
            >
              {/* Pumpkin */}
              <div className="relative w-[34px] h-[34px]" aria-hidden="true">
                <div
                  className="absolute -top-[6px] left-1/2 w-[8px] h-[12px] rounded-[3px]"
                  style={{
                    background: "linear-gradient(#2f6f3a, #204a26)",
                    transform: "translateX(-50%) rotate(-8deg)",
                    boxShadow: "0 2px 0 rgba(0,0,0,0.25)",
                  }}
                />
                <div
                  className="absolute inset-x-0 top-[8%] bottom-0 rounded-[18px]"
                  style={{
                    background:
                      "linear-gradient(90deg, #ff6a00 0%, #ff7d1e 50%, #ff6a00 100%)",
                    boxShadow:
                      "inset -6px 0 0 0 rgba(0,0,0,0.12), inset 6px 0 0 0 rgba(0,0,0,0.12)",
                  }}
                />
                <div
                  className="absolute left-[24%] top-[22%] bottom-[10%] w-[18%] rounded-[10px]"
                  style={{ background: "rgba(0,0,0,0.12)" }}
                />
                <div
                  className="absolute right-[24%] top-[22%] bottom-[10%] w-[18%] rounded-[10px]"
                  style={{ background: "rgba(0,0,0,0.12)" }}
                />
                <div className="absolute left-0 right-0 bottom-[18%] h-[40%] flex justify-center gap-[12%]">
                  <span
                    className="block w-[18%] h-[35%]"
                    style={{
                      background:
                        "radial-gradient(closest-side, #ffd27a, #ffb300)",
                      clipPath: "polygon(50% 0, 0 100%, 100% 100%)",
                      filter: "drop-shadow(0 0 6px rgba(255,179,0,0.6))",
                    }}
                  />
                  <span
                    className="block w-[14%] h-[30%]"
                    style={{
                      background:
                        "radial-gradient(closest-side, #ffd27a, #ffb300)",
                      clipPath: "polygon(50% 0, 0 100%, 100% 100%)",
                      filter: "drop-shadow(0 0 6px rgba(255,179,0,0.6))",
                    }}
                  />
                  <span
                    className="block w-[18%] h-[35%]"
                    style={{
                      background:
                        "radial-gradient(closest-side, #ffd27a, #ffb300)",
                      clipPath: "polygon(50% 0, 0 100%, 100% 100%)",
                      filter: "drop-shadow(0 0 6px rgba(255,179,0,0.6))",
                    }}
                  />
                </div>
                <div
                  className="absolute left-0 right-0 bottom-0 h-[28%]"
                  style={{
                    background:
                      "radial-gradient(closest-side, #ffd27a, #ffb300)",
                    clipPath:
                      "polygon(0 30%, 15% 0, 30% 30%, 45% 0, 60% 30%, 75% 0, 90% 30%, 100% 20%, 100% 100%, 0 100%)",
                    filter: "drop-shadow(0 0 6px rgba(255,179,0,0.6))",
                  }}
                />
              </div>
            </div>
            <div>
              <h1
                className="m-0 font-normal leading-none z-50"
                style={{
                  fontFamily: '"Creepster", cursive',
                  fontSize: "clamp(32px, 6vw, 56px)",
                  letterSpacing: "1px",
                  color: "#ffd27a",
                  textShadow:
                    "0 0 18px rgba(255,179,0,0.25), 0 0 3px rgba(255,179,0,0.6)",
                }}
              >
                ¡Noche de Halloween!
              </h1>
              <p className="text-muted mt-1 text-sm sm:text-base">
                Confirma tu asistencia (solo nombre y número de personas)
              </p>
            </div>
          </header>

          <div className="h-px my-4 bg-linear-to-r from-transparent via-white/10 to-transparent" />

          <form onSubmit={onSubmit} noValidate className="grid gap-3">
            <div className="grid sm:grid-cols-[1.2fr_.8fr] gap-3">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="nombre" className="text-sm text-muted">
                    Nombre
                  </label>
                  <span className="text-xs text-muted">
                    {nombre.length}/50
                  </span>
                </div>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Ej. Ana Romero"
                  autoComplete="name"
                  required
                  maxLength={50}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="px-3.5 py-3 rounded-xl border border-white/10 bg-white/5 placeholder-[#8f8fa4] outline-none transition focus:border-[rgba(255,179,0,0.5)] focus:ring-4 focus:ring-[rgba(255,179,0,0.08)]"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="personas" className="text-sm text-muted">
                  Número de personas
                </label>
                <input
                  id="personas"
                  name="personas"
                  type="number"
                  min={1}
                  max={20}
                  step={1}
                  placeholder="Ej. 2"
                  required
                  value={personas}
                  onChange={(e) => setPersonas(e.target.value)}
                  className="px-3.5 py-3 rounded-xl border border-white/10 bg-white/5 placeholder-[#8f8fa4] outline-none transition focus:border-[rgba(255,179,0,0.5)] focus:ring-4 focus:ring-[rgba(255,179,0,0.08)]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 rounded-xl font-bold text-black px-4 py-3 shadow-[0_8px_24px_rgba(255,106,0,0.28)] bg-linear-to-b from-[#ff6a00] to-[#e65c00] active:translate-y-px hover:brightness-105"
            >
              Confirmar asistencia
            </button>
            <p className="text-muted text-xs sm:text-sm">
              Gracias por confirmar. ¡Trae tu mejor disfraz! 🎃
            </p>
          </form>

          <footer className="flex items-center justify-between gap-2 text-muted text-xs mt-2">
            <span>Se aceptan bolsas de dulces y mucho pisto</span>
          </footer>
        </section>
      </main>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed left-1/2 -translate-x-1/2 bottom-6 px-4 py-3 rounded-lg border shadow-[0_12px_40px_rgba(0,0,0,0.5)] z-50 ${
          toast?.type === "error"
            ? "bg-linear-to-b from-[#2a1414] to-[#1a0e0e] border-[rgba(248,113,113,0.35)] text-[#fee2e2]"
            : "bg-linear-to-b from-[#122017] to-[#0d1712] border-[rgba(45,212,191,0.25)] text-[#d1faf4]"
        } ${
          toast
            ? "opacity-100 visible transition-opacity duration-300"
            : "opacity-0 invisible"
        }`}
      >
        {toast?.message || ""}
      </div>
      {/* Fuente Creepster */}
    </div>
  );
};

export default HalloweenRSVP;

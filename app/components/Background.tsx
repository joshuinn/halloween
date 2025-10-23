"use client";
import React, { useState, useEffect } from "react";

type Star = {
  x: number; // 0-100 vw
  y: number; // 0-100 vh
  size: number; // px
  delay: number; // s
  duration: number; // s
  opacity: number; // 0.3-1
};

const genStars = (
  count: number,
  sizeMin = 1,
  sizeMax = 2,
  durationMin = 4,
  durationMax = 12
): Star[] => {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = sizeMin + Math.random() * (sizeMax - sizeMin);
    const delay = Math.random() * 8;
    const duration = durationMin + Math.random() * (durationMax - durationMin);
    const opacity = 0.5 + Math.random() * 0.5; // Increased minimum opacity from 0.3 to 0.5
    stars.push({ x, y, size, delay, duration, opacity });
  }
  return stars;
};

// Crea tres capas para efecto de profundidad:
// - far: estrellas pequeñas, parpadeo lento
// - mid: medianas
// - near: más grandes, parpadeo más rápido
// Generate stars only on the client after mount to avoid SSR randomness
const useStarLayers = () => {
  const [far, setFar] = useState<Star[]>([]);
  const [mid, setMid] = useState<Star[]>([]);
  const [near, setNear] = useState<Star[]>([]);

  useEffect(() => {
    // generate once on client, but defer to the next frame to avoid
    // calling setState synchronously inside an effect (prevents cascade renders)
    let raf = 0 as number;
    raf = window.requestAnimationFrame(() => {
      setFar(genStars(10, 1.5, 2.5, 8, 16));    // Reduced from 200 to 80
      setMid(genStars(20, 2, 3.5, 6, 12));      // Reduced from 140 to 50
      setNear(genStars(15, 3, 5, 4, 10));       // Reduced from 90 to 30
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return { far, mid, near };
};

const StarLayer: React.FC<{
  stars: Star[];
  blur?: boolean;
  drift?: number; // px de deriva vertical para parallax
  className?: string;
}> = ({ stars, blur = false, drift = 0, className }) => {
  return (
    <div className={`absolute inset-0 ${className || ""}`} aria-hidden="true">
      {stars.map((s, idx) => (
        <span
          key={idx}
          className={`absolute rounded-full bg-white ${blur ? "blur-[0.3px]" : ""}`}
          style={(() => {
            // allow custom CSS property --drift in a type-safe way
            type CSSVarStyle = React.CSSProperties & Record<string, string | number>;
            const sStyle: CSSVarStyle = {
              left: `${s.x}vw`,
              top: `${s.y}vh`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
              boxShadow: `0 0 ${Math.max(2, s.size * 1.5)}px rgba(255,255,255,0.6)`,
              transform: `translateY(0px)`,
              willChange: 'opacity, transform',
            };
            sStyle["--drift"] = `${drift}px`;
            return sStyle as React.CSSProperties;
          })()}
        />
      ))}
    </div>
  );
};

const StarfieldBackground: React.FC<{
  className?: string; // permite ajustar contenedor externo
}> = ({ className }) => {
  const { far, mid, near } = useStarLayers();
  const [mounted, setMounted] = useState(false);

  // Set mounted asynchronously to avoid synchronous setState in effect (prevents linter error)
  useEffect(() => {
    let raf = 0 as number;
    raf = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`fixed inset-0 w-full h-full bg-linear-to-b from-[#0a0a12] via-[#1a1a2e] to-[#0b0b12] overflow-hidden ${
        className || ""
      }`}
    >
      {/* Gradiente sutil para profundidad del cielo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(30,30,50,0.35), rgba(0,0,0,0.9) 60%)",
        }}
      />

      {/* Capas de estrellas: solo renderizamos después del montaje para evitar diferencias entre SSR y cliente */}
      {mounted && (far.length > 0 || mid.length > 0 || near.length > 0) && (
        <>
          <StarLayer stars={far} blur drift={4} className="opacity-60" />
          <StarLayer stars={mid} drift={6} className="opacity-75" />
          <StarLayer stars={near} drift={8} className="opacity-90" />
        </>
      )}

      {/* Nebulosidad muy tenue opcional - simplificada */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-10"
        style={{
          background:
            "radial-gradient(800px 600px at 30% 40%, rgba(80,120,255,0.04), transparent 70%)",
        }}
      />

      {/* Inyecta keyframes necesarios */}
      <style>{`
        @keyframes twinkle {
          0%   { opacity: 0.5; }
          50%  { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default StarfieldBackground;

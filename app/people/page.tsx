"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import StarfieldBackground from "../components/Background";

interface Person {
  id: number;
  name: string;
  peopleCount: number;
  created_at: string;
}

const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CSS variables para el tema Halloween
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

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch("/api/get-list");
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        
        const result = await response.json();
        setPeople(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalPeople = people.reduce((sum, person) => sum + person.peopleCount, 0);
    const totalGroups = people.length;
    const capacity = 100;
    const occupancyPercentage = (totalPeople / capacity) * 100;

    return {
      totalPeople,
      totalGroups,
      capacity,
      occupancyPercentage: Math.min(occupancyPercentage, 100),
      remainingSpots: Math.max(capacity - totalPeople, 0)
    };
  }, [people]);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div style={rootVars} className="bg-[linear-gradient(180deg,var(--bg),var(--bg2))] min-h-screen relative overflow-hidden">
        <StarfieldBackground />
        <div className="relative z-10 grid place-items-center min-h-screen px-4">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-[var(--text)]">Convocando a los espíritus...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={rootVars} className="bg-[linear-gradient(180deg,var(--bg),var(--bg2))] min-h-screen relative overflow-hidden">
        <StarfieldBackground />
        <div className="relative z-10 grid place-items-center min-h-screen px-4">
          <div className="text-center text-[var(--error)]">
            <p>💀 Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={rootVars} className="bg-[linear-gradient(180deg,var(--bg),var(--bg2))] min-h-screen relative overflow-hidden">
      <StarfieldBackground />
      
      {/* Fog effects */}
      <div
        aria-hidden
        className="fixed -inset-x-[10%] -top-[10%] h-[50vh] pointer-events-none z-10"
        style={{
          background: "radial-gradient(50% 60% at 50% 50%, rgba(154,160,166,0.12), rgba(154,160,166,0))",
          filter: "blur(18px)",
          animation: "drift 26s linear infinite",
        }}
      />

      <main className="relative z-10 px-4 sm:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="m-0 font-normal leading-none"
            style={{
              fontFamily: '"Creepster", cursive',
              fontSize: "clamp(28px, 5vw, 48px)",
              letterSpacing: "1px",
              color: "#ffd27a",
              textShadow: "0 0 18px rgba(255,179,0,0.25), 0 0 3px rgba(255,179,0,0.6)",
            }}
          >
            👻 Lista de Invocados 👻
          </h1>
          <p className="text-[var(--muted)] mt-2">Almas confirmadas para la noche más tenebrosa</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-xl border border-white/10 bg-[var(--card)] backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-[var(--accent)]">{stats.totalPeople}</div>
              <div className="text-sm text-[var(--muted)]">Personas Confirmadas</div>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-white/10 bg-[var(--card)] backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl mb-2">🎭</div>
              <div className="text-2xl font-bold text-[var(--accent-2)]">{stats.totalGroups}</div>
              <div className="text-sm text-[var(--muted)]">Grupos Registrados</div>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-white/10 bg-[var(--card)] backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl mb-2">🏠</div>
              <div className="text-2xl font-bold text-[var(--success)]">{stats.remainingSpots}</div>
              <div className="text-sm text-[var(--muted)]">Espacios Restantes</div>
            </div>
          </div>
        </div>

        {/* Capacity Chart */}
        <div className="max-w-4xl mx-auto mb-8">
          <div
            className="p-6 rounded-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-sm"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)), var(--card)"
            }}
          >
            <h3 className="text-xl font-bold text-[var(--text)] mb-4 text-center">
              🎃 Capacidad del Aquelarre (100 personas máximo)
            </h3>
            
            <div className="relative">
              <div className="w-full bg-[var(--bg2)] rounded-full h-8 border border-white/10">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{
                    width: `${stats.occupancyPercentage}%`,
                    background: stats.occupancyPercentage > 90 
                      ? "linear-gradient(90deg, var(--blood), #ff4444)"
                      : stats.occupancyPercentage > 70
                      ? "linear-gradient(90deg, var(--accent), var(--accent-2))"
                      : "linear-gradient(90deg, var(--success), #22d3ee)"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              </div>
              
              <div className="flex justify-between mt-2 text-sm text-[var(--muted)]">
                <span>0</span>
                <span className="font-bold text-[var(--text)]">
                  {stats.totalPeople} / {stats.capacity} ({stats.occupancyPercentage.toFixed(1)}%)
                </span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>

        {/* People Table */}
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-sm"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)), var(--card)"
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-[var(--text)] font-semibold">👤 Nombre</th>
                    <th className="text-center p-4 text-[var(--text)] font-semibold">🧛‍♀️ Personas</th>
                    <th className="text-left p-4 text-[var(--text)] font-semibold">⏰ Confirmado</th>
                  </tr>
                </thead>
                <tbody>
                  {people.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center p-8 text-[var(--muted)]">
                        🕸️ Aún no hay almas registradas... 🕸️
                      </td>
                    </tr>
                  ) : (
                    people.map((person, index) => (
                      <tr 
                        key={person.id}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                          index % 2 === 0 ? 'bg-white/2' : ''
                        }`}
                      >
                        <td className="p-4 text-[var(--text)]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--blood)] flex items-center justify-center text-xs font-bold">
                              {person.name.charAt(0).toUpperCase()}
                            </div>
                            {person.name}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] font-bold">
                            {person.peopleCount}
                          </span>
                        </td>
                        <td className="p-4 text-[var(--muted)] text-sm">
                          {formatDate(person.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Back to RSVP */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-black font-bold hover:brightness-110 transition-all shadow-[0_8px_24px_rgba(255,106,0,0.28)]"
          >
            ← Volver al Ritual de Confirmación
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PeoplePage;

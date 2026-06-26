"use client";

import { Trophy } from "lucide-react";

const getRoundLabel = (slot) => {
  if (!slot) return "";
  if (slot.startsWith("F") && !slot.startsWith("F1")) return "Final";
  if (slot.startsWith("F"))  return "Final";
  if (slot.startsWith("SF")) return "Semi-Final";
  if (slot.startsWith("QF")) return "Quarter-Final";
  if (slot.startsWith("R16")) return "Round of 16";
  if (slot.startsWith("R32")) return "Round of 32";
  return slot.replace(/\d+$/, "");
};

const statusBorder = (status) => {
  if (status === "completed") return "border-orange-500 bg-orange-500/10";
  if (status === "live")      return "border-green-400 bg-green-500/10";
  return "border-gray-700 bg-gray-800";
};

function GameCard({ game }) {
  return (
    <div className={`border-2 rounded-xl overflow-hidden shadow-sm ${statusBorder(game.status)}`}>
      {/* Home */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-700/50">
        <span className={`text-sm font-medium truncate max-w-[130px] ${!game.homeTeam ? "text-gray-600 italic" : "text-gray-200"}`}>
          {game.homeTeam?.name ?? "TBD"}
        </span>
        <span className="text-sm font-bold text-gray-100 ml-2 min-w-[22px] text-right">
          {game.homeScore ?? "–"}
        </span>
      </div>
      {/* Away */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className={`text-sm font-medium truncate max-w-[130px] ${!game.awayTeam ? "text-gray-600 italic" : "text-gray-200"}`}>
          {game.awayTeam?.name ?? "TBD"}
        </span>
        <span className="text-sm font-bold text-gray-100 ml-2 min-w-[22px] text-right">
          {game.awayScore ?? "–"}
        </span>
      </div>
      {/* Date */}
      {game.matchDate && (
        <div className="px-3 py-1 bg-gray-800/50 border-t border-gray-700/50">
          <span className="text-[10px] text-gray-500">
            {new Date(game.matchDate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Desktop: horizontal Flexbox bracket (rounds side-by-side).
 * Mobile: vertical accordion — one round per section, stacked.
 */
export default function BracketView({ bracket }) {
  if (!bracket?.rounds?.length) {
    return <p className="text-center py-12 text-gray-500 text-sm">No bracket data available.</p>;
  }

  const rounds = bracket.rounds;

  return (
    <>
      {/* ── DESKTOP: horizontal bracket ─────────────────────────── */}
      <div className="hidden md:block w-full overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max items-start">
          {rounds.map((round, roundIdx) => (
            <div key={round.round} className="flex flex-col gap-3 min-w-[210px]">
              {/* Round label */}
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                  {getRoundLabel(round.games[0]?.slot) || `Round ${round.round}`}
                </span>
              </div>

              {/* Games — vertically spaced to visually align with next round */}
              <div
                className="flex flex-col"
                style={{
                  gap: `${Math.pow(2, roundIdx) * 1.5}rem`,
                  paddingTop: `${(Math.pow(2, roundIdx) - 1) * 0.75}rem`,
                }}
              >
                {round.games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          ))}

          {/* Trophy */}
          <div className="flex flex-col items-center justify-center min-w-[56px] pt-10">
            <Trophy className="w-9 h-9 text-orange-400" />
            <span className="text-[10px] text-gray-500 mt-1">Winner</span>
          </div>
        </div>
      </div>

      {/* ── MOBILE: vertical stacked rounds ─────────────────────── */}
      <div className="md:hidden space-y-4">
        {rounds.map((round) => {
          const label = getRoundLabel(round.games[0]?.slot) || `Round ${round.round}`;
          return (
            <div key={round.round}>
              {/* Round header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                  {label}
                </span>
                <div className="flex-1 h-px bg-gray-700/50" />
              </div>

              {/* Games — full-width cards, easy to read on phone */}
              <div className="grid grid-cols-1 gap-3">
                {round.games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Trophy */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Trophy className="w-6 h-6 text-orange-400" />
          <span className="text-sm font-semibold text-gray-400">Winner</span>
        </div>
      </div>
    </>
  );
}

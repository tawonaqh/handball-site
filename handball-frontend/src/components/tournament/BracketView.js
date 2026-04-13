"use client";

import { Trophy } from "lucide-react";

/**
 * Responsive knockout bracket visualization using CSS Grid/Flexbox.
 * Accepts the bracket data from GET /leagues/{id}/bracket
 */
export default function BracketView({ bracket }) {
  if (!bracket?.rounds?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No bracket data available.
      </div>
    );
  }

  const rounds = bracket.rounds;

  const getRoundLabel = (slot) => {
    if (!slot) return "";
    if (slot.startsWith("F"))  return "Final";
    if (slot.startsWith("SF")) return "Semi-Final";
    if (slot.startsWith("QF")) return "Quarter-Final";
    if (slot.startsWith("R16")) return "Round of 16";
    return `Round ${slot}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "border-green-400 bg-green-50";
      case "live":      return "border-orange-400 bg-orange-50 animate-pulse";
      default:          return "border-gray-200 bg-white";
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div
        className="flex gap-6 min-w-max"
        style={{ alignItems: "flex-start" }}
      >
        {rounds.map((round, roundIdx) => (
          <div key={round.round} className="flex flex-col gap-4 min-w-[200px]">
            {/* Round header */}
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {getRoundLabel(round.games[0]?.slot) || `Round ${round.round}`}
              </span>
            </div>

            {/* Games in this round — vertically spaced to align with next round */}
            <div
              className="flex flex-col"
              style={{
                gap: `${Math.pow(2, roundIdx) * 1.5}rem`,
                paddingTop: `${(Math.pow(2, roundIdx) - 1) * 0.75}rem`,
              }}
            >
              {round.games.map((game) => (
                <div
                  key={game.id}
                  className={`border-2 rounded-xl overflow-hidden shadow-sm transition-all ${getStatusColor(game.status)}`}
                >
                  {/* Home team */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                    <span className={`text-sm font-medium truncate max-w-[120px] ${!game.homeTeam ? "text-gray-300 italic" : "text-gray-800"}`}>
                      {game.homeTeam?.name ?? "TBD"}
                    </span>
                    <span className="text-sm font-bold text-gray-900 ml-2 min-w-[20px] text-right">
                      {game.homeScore ?? "–"}
                    </span>
                  </div>

                  {/* Away team */}
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className={`text-sm font-medium truncate max-w-[120px] ${!game.awayTeam ? "text-gray-300 italic" : "text-gray-800"}`}>
                      {game.awayTeam?.name ?? "TBD"}
                    </span>
                    <span className="text-sm font-bold text-gray-900 ml-2 min-w-[20px] text-right">
                      {game.awayScore ?? "–"}
                    </span>
                  </div>

                  {/* Date */}
                  {game.matchDate && (
                    <div className="px-3 py-1 bg-gray-50 border-t border-gray-100">
                      <span className="text-[10px] text-gray-400">
                        {new Date(game.matchDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Trophy at the end */}
        <div className="flex flex-col items-center justify-center min-w-[60px] pt-8">
          <Trophy className="w-10 h-10 text-yellow-500" />
          <span className="text-xs text-gray-400 mt-1">Winner</span>
        </div>
      </div>
    </div>
  );
}

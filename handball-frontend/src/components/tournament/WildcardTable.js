"use client";

import { Zap } from "lucide-react";

/**
 * Virtual wildcard table — ranks 3rd-place teams across groups.
 * Accepts data from GET /leagues/{id}/wildcard-table
 */
export default function WildcardTable({ wildcards = [], qualifyCount = 4 }) {
  if (!wildcards.length) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No wildcard data available yet.
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg font-bold text-gray-100">Wildcard Rankings</h2>
        <span className="text-xs text-gray-500 ml-auto">Top {qualifyCount} qualify</span>
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900/50">
              <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs uppercase">Pos</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-400 text-xs uppercase">Team</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-400 text-xs uppercase">Group</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-400 text-xs uppercase">P</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-400 text-xs uppercase">W</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-400 text-xs uppercase">D</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-400 text-xs uppercase">L</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-400 text-xs uppercase">GD</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-400 text-xs uppercase">GF</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-400 text-xs uppercase">Pts</th>
            </tr>
          </thead>
          <tbody>
            {wildcards.map((row, i) => {
              const qualifies = i < qualifyCount;
              return (
                <tr
                  key={i}
                  className={`border-b border-gray-700/50 transition-colors ${
                    qualifies ? "bg-orange-500/5 hover:bg-orange-500/10" : "hover:bg-gray-700/30"
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      qualifies ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-200">{row.team?.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-bold text-xs">
                      {row.group ?? "–"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">{row.gamesPlayed}</td>
                  <td className="px-4 py-3 text-center text-green-400 font-medium">{row.wins}</td>
                  <td className="px-4 py-3 text-center text-yellow-400 font-medium">{row.draws}</td>
                  <td className="px-4 py-3 text-center text-red-400 font-medium">{row.losses}</td>
                  <td className="px-4 py-3 text-center font-medium">
                    <span className={row.goalDifference > 0 ? "text-green-400" : row.goalDifference < 0 ? "text-red-400" : "text-gray-500"}>
                      {row.goalDifference > 0 ? "+" : ""}{row.goalDifference}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-300">{row.goalsFor}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      qualifies ? "bg-orange-500/20 text-orange-400" : "bg-gray-700 text-gray-300"
                    }`}>
                      {row.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-2">
        {wildcards.map((row, i) => {
          const qualifies = i < qualifyCount;
          return (
            <div
              key={i}
              className={`rounded-xl p-3 border ${qualifies ? "border-orange-500/30 bg-orange-500/5" : "border-gray-700 bg-gray-800"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    qualifies ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"
                  }`}>
                    {i + 1}
                  </span>
                  <span className="font-semibold text-gray-200">{row.team?.name}</span>
                  <span className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded font-bold">
                    Grp {row.group}
                  </span>
                </div>
                <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                  qualifies ? "bg-orange-500/20 text-orange-400" : "bg-gray-700 text-gray-300"
                }`}>
                  {row.points} pts
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2 text-center text-xs text-gray-500">
                <div><div>P</div><div className="font-medium text-gray-300">{row.gamesPlayed}</div></div>
                <div><div>W-D-L</div><div className="font-medium text-gray-300">{row.wins}-{row.draws}-{row.losses}</div></div>
                <div><div>GD</div><div className={`font-medium ${row.goalDifference > 0 ? "text-green-400" : row.goalDifference < 0 ? "text-red-400" : "text-gray-500"}`}>{row.goalDifference > 0 ? "+" : ""}{row.goalDifference}</div></div>
                <div><div>GF</div><div className="font-medium text-gray-300">{row.goalsFor}</div></div>
              </div>
            </div>
          );
        })}
      </div>

      {wildcards.length > 0 && (
        <p className="text-xs text-gray-500 mt-3">
          Ranked by: Points → Goal Difference → Goals Scored
        </p>
      )}
    </div>
  );
}

"use client";

import { Trophy, CheckCircle2, MinusCircle } from "lucide-react";

/**
 * Renders one standings table per group.
 * Accepts data from GET /leagues/{id}/group-standings
 *
 * Shape: { leagueId, groups: [{ group, standings: [{ rank, team, qualifies, ... }] }] }
 */
export default function GroupStandingsTable({ data, title = "Group Stage" }) {
  if (!data?.groups?.length) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        No group standings available yet.
      </div>
    );
  }

  const getGradient = (name = "") => {
    const gradients = [
      "from-orange-400 to-red-500",
      "from-blue-400 to-purple-500",
      "from-green-400 to-blue-500",
      "from-yellow-400 to-orange-500",
      "from-purple-400 to-pink-500",
      "from-teal-400 to-green-500",
    ];
    const idx = Math.abs(name.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % gradients.length;
    return gradients[idx];
  };

  const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
      )}

      {data.groups.map((g) => (
        <div key={g.group ?? "all"} className="card-modern overflow-hidden p-0">
          {/* Group header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              {g.group ? `Group ${g.group}` : "Standings"}
            </span>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase w-8">#</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase">Team</th>
                  <th className="text-center px-3 py-2.5 font-semibold text-gray-500 text-xs uppercase">P</th>
                  <th className="text-center px-3 py-2.5 font-semibold text-gray-500 text-xs uppercase">W</th>
                  <th className="text-center px-3 py-2.5 font-semibold text-gray-500 text-xs uppercase">D</th>
                  <th className="text-center px-3 py-2.5 font-semibold text-gray-500 text-xs uppercase">L</th>
                  <th className="text-center px-3 py-2.5 font-semibold text-gray-500 text-xs uppercase">GD</th>
                  <th className="text-center px-3 py-2.5 font-semibold text-gray-500 text-xs uppercase">Pts</th>
                  <th className="text-center px-3 py-2.5 font-semibold text-gray-500 text-xs uppercase">Q</th>
                </tr>
              </thead>
              <tbody>
                {g.standings.map((row, i) => (
                  <tr
                    key={row.team.id}
                    className={`border-b border-gray-50 transition-colors ${
                      row.qualifies ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2.5 text-gray-500 font-medium">{row.rank}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${getGradient(row.team.name)} flex items-center justify-center text-white text-[10px] font-bold`}>
                          {getInitials(row.team.name)}
                        </div>
                        <span className="font-medium text-gray-900">{row.team.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">{row.gamesPlayed}</td>
                    <td className="px-3 py-2.5 text-center text-green-600 font-medium">{row.wins}</td>
                    <td className="px-3 py-2.5 text-center text-yellow-600 font-medium">{row.draws}</td>
                    <td className="px-3 py-2.5 text-center text-red-600 font-medium">{row.losses}</td>
                    <td className="px-3 py-2.5 text-center font-medium">
                      <span className={row.goalDifference > 0 ? "text-green-600" : row.goalDifference < 0 ? "text-red-600" : "text-gray-500"}>
                        {row.goalDifference > 0 ? "+" : ""}{row.goalDifference}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        row.qualifies ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }`}>
                        {row.points}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {row.qualifies
                        ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                        : <MinusCircle className="w-4 h-4 text-gray-300 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-50">
            {g.standings.map((row) => (
              <div
                key={row.team.id}
                className={`px-4 py-3 ${row.qualifies ? "bg-green-50" : "bg-white"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-4">{row.rank}</span>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getGradient(row.team.name)} flex items-center justify-center text-white text-xs font-bold`}>
                      {getInitials(row.team.name)}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{row.team.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      row.qualifies ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {row.points} pts
                    </span>
                    {row.qualifies
                      ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                      : <MinusCircle className="w-4 h-4 text-gray-300" />}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-center text-xs text-gray-500">
                  <div><div>P</div><div className="font-medium text-gray-800">{row.gamesPlayed}</div></div>
                  <div><div>W-D-L</div><div className="font-medium text-gray-800">{row.wins}-{row.draws}-{row.losses}</div></div>
                  <div>
                    <div>GD</div>
                    <div className={`font-medium ${row.goalDifference > 0 ? "text-green-600" : row.goalDifference < 0 ? "text-red-600" : "text-gray-500"}`}>
                      {row.goalDifference > 0 ? "+" : ""}{row.goalDifference}
                    </div>
                  </div>
                  <div><div>GF</div><div className="font-medium text-gray-800">{row.goalsFor}</div></div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span>Qualifies to next round</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

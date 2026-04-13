"use client";

import { useState } from "react";
import { FileText, Printer } from "lucide-react";

/**
 * Post-game match sheet report.
 * Accepts data from GET /games/{id}/match-sheet
 */
export default function MatchSheet({ sheet }) {
  const [printing, setPrinting] = useState(false);

  if (!sheet) return null;

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 100);
  };

  const StatCell = ({ value, highlight }) => (
    <td className={`px-3 py-2 text-center text-sm ${highlight ? "font-bold text-orange-600" : "text-gray-700"}`}>
      {value ?? 0}
    </td>
  );

  const TeamTable = ({ team }) => (
    <div className="mb-6">
      <h3 className="font-bold text-lg text-gray-800 mb-2 flex items-center gap-2">
        {team.name}
        <span className="text-2xl font-black text-orange-500">{team.score}</span>
      </h3>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Player</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">G</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">A</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">Saves</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">Save%</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">2'</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">YC</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">BC</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">RC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {team.players?.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-400 text-xs">{p.jersey ?? "–"}</td>
                <td className="px-3 py-2 font-medium text-gray-800">{p.name}</td>
                <StatCell value={p.goals}       highlight={p.goals > 0} />
                <StatCell value={p.assists}     highlight={p.assists > 0} />
                <StatCell value={p.saves} />
                <td className="px-3 py-2 text-center text-sm text-gray-700">
                  {p.saveRate ? `${p.saveRate}%` : "–"}
                </td>
                <StatCell value={p.suspensions} highlight={p.suspensions > 0} />
                <td className="px-3 py-2 text-center">
                  {p.yellowCards > 0 && (
                    <span className="inline-block w-3 h-4 bg-yellow-400 rounded-sm" />
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  {p.blueCards > 0 && (
                    <span className="inline-block w-3 h-4 bg-blue-500 rounded-sm" />
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  {p.redCards > 0 && (
                    <span className="inline-block w-3 h-4 bg-red-600 rounded-sm" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="card-modern print:shadow-none print:border-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 print:mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">Match Sheet</h2>
        </div>
        <button
          onClick={handlePrint}
          disabled={printing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors print:hidden"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      {/* Match info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl text-sm">
        <div>
          <div className="text-gray-400 text-xs uppercase font-semibold">Date</div>
          <div className="font-medium">{sheet.date ? new Date(sheet.date).toLocaleDateString() : "–"}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs uppercase font-semibold">Venue</div>
          <div className="font-medium">{sheet.venue ?? "–"}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs uppercase font-semibold">League</div>
          <div className="font-medium">{sheet.league ?? "–"}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs uppercase font-semibold">Referee</div>
          <div className="font-medium">{sheet.referee ?? "–"}</div>
        </div>
      </div>

      {/* Result banner */}
      <div className="flex items-center justify-center gap-6 mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
        <span className="text-xl font-bold text-gray-800">{sheet.homeTeam?.name}</span>
        <span className="text-4xl font-black text-orange-500">
          {sheet.homeTeam?.score} – {sheet.awayTeam?.score}
        </span>
        <span className="text-xl font-bold text-gray-800">{sheet.awayTeam?.name}</span>
      </div>

      {/* Player tables */}
      <TeamTable team={sheet.homeTeam} />
      <TeamTable team={sheet.awayTeam} />

      <div className="text-xs text-gray-400 text-right mt-2 print:block">
        Generated: {sheet.generatedAt ? new Date(sheet.generatedAt).toLocaleString() : "–"}
      </div>
    </div>
  );
}

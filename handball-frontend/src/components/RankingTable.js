// src/components/RankingTable.js
export default function RankingTable({ rankings }) {
  return (
    <table className="table-auto border-collapse border border-gray-300 w-full">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-2 py-1">Team</th>
          <th className="border px-2 py-1">Played</th>
          <th className="border px-2 py-1">Wins</th>
          <th className="border px-2 py-1">Draws</th>
          <th className="border px-2 py-1">Losses</th>
          <th className="border px-2 py-1">GF</th>
          <th className="border px-2 py-1">GA</th>
          <th className="border px-2 py-1">GD</th>
          <th className="border px-2 py-1">Points</th>
        </tr>
      </thead>
      <tbody>
        {rankings.map((r) => (
          <tr key={r.id}>
            <td className="border px-2 py-1">{r.team?.name}</td>
            <td className="border px-2 py-1">{r.played}</td>
            <td className="border px-2 py-1">{r.wins}</td>
            <td className="border px-2 py-1">{r.draws}</td>
            <td className="border px-2 py-1">{r.losses}</td>
            <td className="border px-2 py-1">{r.goals_for}</td>
            <td className="border px-2 py-1">{r.goals_against}</td>
            <td className="px-4 py-2 text-center text-gray-900">
              {(r.goals_for - r.goals_against > 0)
                ? '+' + (r.goals_for - r.goals_against)
                : '-' + Math.abs(r.goals_for - r.goals_against)}
            </td>
            <td className="border px-2 py-1">{r.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

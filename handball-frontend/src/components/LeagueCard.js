// src/components/LeagueCard.js
import Link from 'next/link';

export default function LeagueCard({ league }) {
  return (
    <Link href={`/viewer/leagues/${league.id}`}>
      <div className="card hover:shadow-lg p-4 border rounded-md cursor-pointer">
        <h3 className="text-lg font-bold">{league.name}</h3>
        <p>{league.teams?.length || 0} Teams</p>
      </div>
    </Link>
  );
}

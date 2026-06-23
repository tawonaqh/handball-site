'use client';

import TournamentManager from '@/components/tournament/TournamentManager';
import { useParams } from 'next/navigation';

export default function LeagueDetailPage() {
  const params = useParams();
  const leagueId = params.id;

  return (
    <div className="space-y-8">
      <TournamentManager leagueId={leagueId} />
    </div>
  );
}

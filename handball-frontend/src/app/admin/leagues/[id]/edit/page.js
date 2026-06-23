'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditLeaguePage() {
  const params = useParams();
  const router = useRouter();
  const leagueId = params.id;

  useEffect(() => {
    router.replace(`/admin/leagues/${leagueId}`);
  }, [leagueId, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500" />
    </div>
  );
}

// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function fetcher(endpoint) {
    const res = await fetch(`${API_URL}/${endpoint}`);
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}

// ── Standings & Bracket ──────────────────────────────────────────────────────

export async function getLeagueStandings(leagueId) {
    return fetcher(`leagues/${leagueId}/standings`);
}

export async function getWildcardTable(leagueId, top = 4) {
    return fetcher(`leagues/${leagueId}/wildcard-table?top=${top}`);
}

export async function recalculateStandings(leagueId) {
    const res = await fetch(`${API_URL}/leagues/${leagueId}/recalculate`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to recalculate');
    return res.json();
}

export async function getBracket(leagueId) {
    return fetcher(`leagues/${leagueId}/bracket`);
}

export async function generateFixtures(leagueId, teamIds, startDate) {
    const res = await fetch(`${API_URL}/leagues/${leagueId}/generate-fixtures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_ids: teamIds, start_date: startDate }),
    });
    if (!res.ok) throw new Error('Failed to generate fixtures');
    return res.json();
}

export async function generateBracket(leagueId, teamIds, startDate) {
    const res = await fetch(`${API_URL}/leagues/${leagueId}/generate-bracket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_ids: teamIds, start_date: startDate }),
    });
    if (!res.ok) throw new Error('Failed to generate bracket');
    return res.json();
}

// ── Match Management ─────────────────────────────────────────────────────────

export async function editGameScore(gameId, homeScore, awayScore) {
    const res = await fetch(`${API_URL}/games/${gameId}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ home_score: homeScore, away_score: awayScore }),
    });
    if (!res.ok) throw new Error('Failed to update score');
    return res.json();
}

export async function getMatchSheet(gameId) {
    return fetcher(`games/${gameId}/match-sheet`);
}

export async function getPlayerRankings(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetcher(`rankings/players${query ? '?' + query : ''}`);
}

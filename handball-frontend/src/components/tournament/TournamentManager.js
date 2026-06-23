'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaUsers, FaArrowLeft, FaArrowRight, FaTrash, FaPlus, FaSave, FaCog, FaRandom, FaPrint, FaTimes, FaGripVertical, FaEdit, FaFootballBall } from 'react-icons/fa';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
});

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
}

const defaultSettings = {
  match_duration: 60,
  overtime_halves: 2,
  shootout_enabled: 'yes',
  roster_limit: 16,
  tiebreaker_order: [
    'Head-to-Head Points',
    'Head-to-Head Goal Difference',
    'Head-to-Head Goals Scored',
    'Overall Goal Difference',
    'Overall Goals Scored',
    'Official Draw / Coin Toss',
  ],
  knockout_method: 'default',
};

export default function TournamentManager({ leagueId, onBack }) {
  const [league, setLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [games, setGames] = useState([]);
  const [bracket, setBracket] = useState(null);
  const [standings, setStandings] = useState([]);
  const [groupStandings, setGroupStandings] = useState({});
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const [teamName, setTeamName] = useState('');
  const [teamGroup, setTeamGroup] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [newTeamId, setNewTeamId] = useState('');

  const [startDate, setStartDate] = useState('');
  const [message, setMessage] = useState(null);
  const [generating, setGenerating] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [showSeeding, setShowSeeding] = useState(false);
  const [showRulebook, setShowRulebook] = useState(false);

  const [knockoutMethod, setKnockoutMethod] = useState('default');
  const [seedingOrder, setSeedingOrder] = useState([]);
  const [tiebreakerOrder, setTiebreakerOrder] = useState(defaultSettings.tiebreaker_order);
  const [dragIdx, setDragIdx] = useState(null);

  const groups = getGroups();
  const qualifiedCount = getQualifiedCount();

  function getGroups() {
    if (!league) return [];
    if (league.type === 'knockout' || league.type === 'league_knockout') {
      const cnt = parseInt(league.num_groups) || 3;
      return Array.from({ length: cnt }, (_, i) => String.fromCharCode(65 + i));
    }
    if (league.type === 'league') return ['League'];
    return [];
  }

  function getQualifiedCount() {
    if (!league) return 0;
    if (league.type === 'knockout') return teams.length;
    if (league.type === 'knockout_only') return teams.length;
    if (league.type === 'league_knockout') return parseInt(league.qualify_spots) || 4;
    if (league.type === 'league') return 0;
    const gc = parseInt(league.num_groups) || 3;
    if (gc <= 2) return gc * 2;
    if (gc === 3) return 8;
    return gc * 2;
  }

  const loadData = useCallback(async () => {
    try {
      const [l, s, b] = await Promise.all([
        fetcher(`leagues/${leagueId}`),
        fetcher(`leagues/${leagueId}/settings`).catch(() => defaultSettings),
        fetcher(`leagues/${leagueId}/bracket`).catch(() => null),
      ]);
      setLeague(l);
      setSettings(s);
      setKnockoutMethod(s?.knockout_method || 'default');
      setTiebreakerOrder(s?.tiebreaker_order || defaultSettings.tiebreaker_order);

      const teamsRes = await fetch(`${API}/teams`);
      const allT = await teamsRes.json();
      const leagueTeams = allT.filter((t) => t.league_id === parseInt(leagueId));
      setTeams(leagueTeams);
      setAllTeams(allT);

      const gamesRes = await fetch(`${API}/games`);
      const allGames = await gamesRes.json();
      const leagueGames = allGames.filter((g) => g.league_id === parseInt(leagueId));
      setGames(leagueGames);

      const stdRes = await fetch(`${API}/leagues/${leagueId}/standings`).catch(() => null);
      if (stdRes && stdRes.ok) {
        const stdData = await stdRes.json();
        setStandings(Array.isArray(stdData) ? stdData : []);
      }

      setBracket(b);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => { loadData(); }, [loadData]);

  const showMsg = (text, type = 'success') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const addTeam = async () => {
    const name = teamName.trim();
    if (!name) { showMsg('Enter a team name', 'alert'); return; }
    if (teams.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      showMsg('Team already exists in this league', 'alert');
      return;
    }
    try {
      const group = teamGroup || 'A';
      const res = await fetch(`${API}/teams`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          name,
          league_id: leagueId,
          group_label: group,
          gender: league?.gender || 'men',
        }),
      });
      if (!res.ok) throw new Error('Failed to create team');
      const team = await res.json();
      setTeams((prev) => [...prev, team]);
      setTeamName('');
      showMsg(`Team "${name}" added to Group ${group}`, 'success');
    } catch (e) {
      showMsg(e.message, 'alert');
    }
  };

  const deleteTeam = async (id) => {
    if (!confirm('Delete this team?')) return;
    try {
      await fetch(`${API}/teams/${id}`, { method: 'DELETE', headers: authHeaders() });
      setTeams((prev) => prev.filter((t) => t.id !== id));
      setGames([]);
      setBracket(null);
      showMsg('Team deleted', 'success');
    } catch (e) {
      showMsg(e.message, 'alert');
    }
  };

  const addExistingTeam = async () => {
    const id = parseInt(newTeamId);
    if (!id) { showMsg('Select a team', 'alert'); return; }
    if (teams.some((t) => t.id === id)) { showMsg('Team already in league', 'alert'); return; }
    const t = allTeams.find((t) => t.id === id);
    if (!t) { showMsg('Team not found', 'alert'); return; }
    try {
      const group = teamGroup || 'A';
      const res = await fetch(`${API}/teams/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ league_id: leagueId, group_label: group }),
      });
      if (!res.ok) throw new Error('Failed to assign team');
      const updated = await res.json();
      setTeams((prev) => [...prev, updated]);
      setNewTeamId('');
      showMsg(`Team "${t.name}" assigned to Group ${group}`, 'success');
    } catch (e) {
      showMsg(e.message, 'alert');
    }
  };

  const updateTeamGroup = async (teamId, group) => {
    try {
      await fetch(`${API}/teams/${teamId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ group_label: group }),
      });
      setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, group_label: group } : t)));
    } catch (e) {
      showMsg(e.message, 'alert');
    }
  };

  const generateFixturesAction = async () => {
    if (teams.length < 2) { showMsg('Need at least 2 teams', 'alert'); return; }
    setGenerating(true);
    try {
      const teamIds = teams.map((t) => t.id);
      if (league.type === 'knockout_only' || league.type === 'knockout') {
        const res = await fetch(`${API}/leagues/${leagueId}/generate-bracket`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ team_ids: teamIds, start_date: startDate || new Date().toISOString().slice(0, 10) }),
        });
        if (!res.ok) throw new Error('Failed to generate bracket');
        const data = await res.json();
        setBracket(data);
        setGames([]);
        showMsg(`Knockout bracket generated with ${teams.length} teams`, 'success');
      } else if (league.type === 'league_knockout' || league.type === 'knockout') {
        const groupsMap = {};
        getGroups().forEach((g) => {
          const gTeams = teams.filter((t) => (t.group_label || 'A') === g);
          if (gTeams.length >= 2) groupsMap[g] = gTeams.map((t) => t.id);
        });
        if (Object.keys(groupsMap).length === 0) {
          showMsg('Assign teams to groups first', 'alert');
          setGenerating(false);
          return;
        }
        const res = await fetch(`${API}/leagues/${leagueId}/generate-group-stage`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            groups: groupsMap,
            start_date: startDate || new Date().toISOString().slice(0, 10),
          }),
        });
        if (!res.ok) throw new Error('Failed to generate group stage');
        showMsg('Group fixtures generated', 'success');
      } else {
        const res = await fetch(`${API}/leagues/${leagueId}/generate-fixtures`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            team_ids: teamIds,
            start_date: startDate || new Date().toISOString().slice(0, 10),
          }),
        });
        if (!res.ok) throw new Error('Failed to generate fixtures');
        showMsg('Round-robin fixtures generated', 'success');
      }
      loadData();
    } catch (e) {
      showMsg(e.message, 'alert');
    } finally {
      setGenerating(false);
    }
  };

  const updateScore = async (gameId, homeScore, awayScore) => {
    try {
      const res = await fetch(`${API}/games/${gameId}/score`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ home_score: homeScore, away_score: awayScore }),
      });
      if (!res.ok) throw new Error('Failed to update score');
      showMsg('Score saved', 'success');
      loadData();
    } catch (e) {
      showMsg(e.message, 'alert');
    }
  };

  const generateKnockoutBracket = async () => {
    if (teams.length < 2) { showMsg('Need at least 2 teams', 'alert'); return; }
    setGenerating(true);
    try {
      let orderedIds = teams.map((t) => t.id);
      if (knockoutMethod === 'manual' && seedingOrder.length === teams.length) {
        orderedIds = seedingOrder;
      }
      const res = await fetch(`${API}/leagues/${leagueId}/generate-bracket`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          team_ids: orderedIds,
          start_date: startDate || new Date().toISOString().slice(0, 10),
        }),
      });
      if (!res.ok) throw new Error('Failed to generate bracket');
      const b = await fetcher(`leagues/${leagueId}/bracket`);
      setBracket(b);
      showMsg('Knockout bracket generated', 'success');
    } catch (e) {
      showMsg(e.message, 'alert');
    } finally {
      setGenerating(false);
    }
  };

  const saveSettings = async () => {
    try {
      const res = await fetch(`${API}/leagues/${leagueId}/settings`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ ...settings, tiebreaker_order: tiebreakerOrder, knockout_method: knockoutMethod }),
      });
      if (res.ok) {
        setShowSettings(false);
        showMsg('Settings saved', 'success');
      }
    } catch (e) {
      showMsg('Failed to save settings', 'alert');
    }
  };

  // Seeding
  const openSeeding = () => {
    if (!teams.length) { showMsg('No teams available', 'alert'); return; }
    const sorted = [...teams].sort((a, b) => (b.ranking?.points || 0) - (a.ranking?.points || 0));
    if (seedingOrder.length !== teams.length || !seedingOrder.every((id) => teams.some((t) => t.id === id))) {
      setSeedingOrder(sorted.map((t) => t.id));
    }
    setKnockoutMethod('manual');
    setShowSeeding(true);
  };

  const moveSeed = (idx, dir) => {
    const order = [...seedingOrder];
    const ni = idx + dir;
    if (ni < 0 || ni >= order.length) return;
    [order[idx], order[ni]] = [order[ni], order[idx]];
    setSeedingOrder(order);
  };

  const applySeeding = () => {
    setShowSeeding(false);
    showMsg('Seeding set. Generate knockout to apply.', 'success');
  };

  const getPreviewPairs = () => {
    if (seedingOrder.length < 2) return [];
    const n = seedingOrder.length;
    const pairs = [];
    for (let i = 0; i < Math.floor(n / 2); i++) {
      pairs.push([seedingOrder[i], seedingOrder[n - 1 - i]]);
    }
    return pairs;
  };

  const getTeamName = (id) => {
    const t = teams.find((t) => t.id === id);
    return t ? t.name : `#${id}`;
  };

  // Rulebook
  const openRulebook = () => setShowRulebook(true);

  const typeLabels = {
    league: 'League (Round Robin)',
    knockout: 'Groups + Knockout',
    knockout_only: 'Knockout Only (Direct Elimination)',
    league_knockout: 'League + Knockout',
  };

  const generateRulebookHTML = () => {
    const l = league;
    if (!l) return '';
    const fmt = typeLabels[l.type] || l.type;
    const s = settings || defaultSettings;
    const tbList = (tiebreakerOrder || defaultSettings.tiebreaker_order)
      .map((item, i) => `<li><strong>${i + 1}.</strong> ${escapeHtml(item)}</li>`)
      .join('');

    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${escapeHtml(l.name)} - Rulebook</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Segoe UI',Arial,sans-serif; max-width:900px; margin:40px auto; padding:0 20px; color:#333; line-height:1.6; }
  h1 { font-size:28px; color:#1a5f2c; border-bottom:4px solid #d4a017; padding-bottom:12px; margin-bottom:20px; text-align:center; }
  h2 { font-size:20px; color:#1a5f2c; margin-top:28px; margin-bottom:12px; border-left:6px solid #d4a017; padding-left:14px; }
  h3 { font-size:16px; color:#0d3d1c; margin-top:18px; margin-bottom:8px; }
  p { margin-bottom:10px; }
  ul, ol { margin-left:24px; margin-bottom:14px; }
  li { margin-bottom:4px; }
  table { width:100%; border-collapse:collapse; margin:16px 0; font-size:14px; }
  th { background:#1a5f2c; color:white; padding:10px 12px; border:1px solid #1a5f2c; }
  td { padding:10px 12px; border:1px solid #ddd; }
  tr:nth-child(even) { background:#f8f9fa; }
  .subtitle { text-align:center; font-size:18px; color:#555; margin-bottom:30px; }
  .highlight { background:#f0f7f0; border-left:6px solid #1a5f2c; padding:16px 20px; border-radius:8px; margin:16px 0; }
  .footer { margin-top:36px; padding-top:16px; border-top:2px solid #e0e0e0; text-align:center; font-size:13px; color:#888; }
  .info-bar { display:flex; flex-wrap:wrap; gap:16px; background:#f0f7f0; padding:14px 18px; border-radius:12px; margin-bottom:20px; }
  .info-bar span { font-size:14px; }
  @media print { body { margin:0; padding:15px; } }
</style></head><body>
<h1>🏆 Official Rulebook</h1>
<div class="subtitle">${escapeHtml(l.name)}</div>
<div class="info-bar">
  <span><strong>Format:</strong> ${fmt}</span>
  <span><strong>Gender:</strong> ${escapeHtml(l.gender === 'women' ? "Women's" : "Men's")}</span>
  <span><strong>Season:</strong> ${escapeHtml(l.season || 'Current')}</span>
  <span><strong>Teams:</strong> ${teams.length}</span>
</div>
<h2>1. Competition Format</h2>
<div class="highlight">
  <p><strong>Type:</strong> ${fmt}</p>
  <p><strong>Max Teams:</strong> ${l.max_teams || 'N/A'}</p>
  ${l.num_groups ? `<p><strong>Groups:</strong> ${l.num_groups}</p>` : ''}
  ${l.teams_per_group ? `<p><strong>Teams per Group:</strong> ${l.teams_per_group}</p>` : ''}
  ${l.qualify_spots ? `<p><strong>Teams to Knockout:</strong> ${l.qualify_spots}</p>` : ''}
  ${l.knockout_rounds ? `<p><strong>Knockout Rounds:</strong> ${l.knockout_rounds.replace(/_/g, ' ')}</p>` : ''}
</div>
<h2>2. Match Settings</h2>
<table><tr><th>Setting</th><th>Value</th></tr>
<tr><td>Match Duration</td><td>${s.match_duration || 60} minutes</td></tr>
<tr><td>Overtime</td><td>${s.overtime_halves || 2} halves</td></tr>
<tr><td>Shootout</td><td>${s.shootout_enabled === 'yes' ? 'Yes (after overtime)' : 'No'}</td></tr>
<tr><td>Roster Limit</td><td>${s.roster_limit || 16} players</td></tr>
</table>
<h2>3. Scoring System</h2>
<p>Win = 2 points, Draw = 1 point, Loss = 0 points.</p>
<h2>4. Tiebreaker Hierarchy</h2>
<div class="highlight"><ol>${tbList}</ol></div>
<h2>5. Overtime Rules</h2>
<p>If a knockout match ends in a draw: 5-min break, then ${s.overtime_halves || 2} halves of 5min each. If still tied, 7-meter shootout.</p>
<h2>6. Registered Teams (${teams.length})</h2>
<table><tr><th>#</th><th>Team</th><th>Group</th></tr>
${teams.map((t, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(t.name)}</td><td>${t.group_label || '-'}</td></tr>`).join('')}
</table>
<div class="footer"><p>Generated from Handball 263 Tournament System • ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p><p>© Handball 263</p></div>
</body></html>`;
  };

  const printRulebook = () => {
    const html = generateRulebookHTML();
    const win = window.open('', '_blank', 'width=1100,height=800');
    if (!win) { showMsg('Allow popups for printing', 'warning'); return; }
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500" />
      </div>
    );
  }

  if (!league) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">League not found</p>
        <button onClick={onBack} className="px-6 py-3 bg-blue-600 text-white rounded-xl">Back</button>
      </div>
    );
  }

  const pairs = getPreviewPairs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
              <FaArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaTrophy className="text-blue-500" /> {league.name}
            </h1>
            <p className="text-sm text-gray-400">
              {typeLabels[league.type] || league.type} &middot;{" "}
              {league.gender === 'women' ? "Women's" : "Men's"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowSettings(true)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-700/50 text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-600/50 transition-colors">
            <FaCog className="w-4 h-4" /> Settings
          </button>
          <button onClick={openRulebook} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/20 text-blue-400 rounded-xl text-sm font-semibold hover:bg-blue-600/30 transition-colors">
            <FaPrint className="w-4 h-4" /> Rulebook
          </button>
          <Link href={`/admin/leagues`}>
            <button className="px-4 py-2.5 bg-red-500/20 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-colors">
              Close
            </button>
          </Link>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
          message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : message.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {message.text}
        </div>
      )}

      {/* Team Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FaUsers className="text-blue-500" /> Teams ({teams.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)}
            placeholder="New team name" className="px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          {groups.length > 0 && (
            <select value={teamGroup} onChange={(e) => setTeamGroup(e.target.value)}
              className="px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              {groups.map((g) => <option key={g} value={g}>Group {g}</option>)}
            </select>
          )}
          <div className="flex gap-2">
            <select value={newTeamId} onChange={(e) => setNewTeamId(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <option value="">Add existing team...</option>
              {allTeams.filter((t) => !teams.some((lt) => lt.id === t.id)).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button onClick={addExistingTeam} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              <FaPlus />
            </button>
          </div>
          <button onClick={addTeam} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
            <FaPlus /> Add Team
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          <button onClick={generateFixturesAction} disabled={generating}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors">
            {generating ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" /> : <FaFootballBall />}
            Generate Fixtures
          </button>
          {(league.type === 'knockout' || league.type === 'knockout_only' || league.type === 'league_knockout') && (
            <>
              <button onClick={generateKnockoutBracket} disabled={generating}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-50 transition-colors">
                Generate Bracket
              </button>
              <button onClick={openSeeding}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                <FaRandom /> Seed
              </button>
            </>
          )}
        </div>

        <input type="text" value={teamSearch} onChange={(e) => setTeamSearch(e.target.value)}
          placeholder="Filter teams by name..." className="w-full max-w-md px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />

        {teams.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No teams added yet. Add teams above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {teams
              .filter((t) => !teamSearch || t.name.toLowerCase().includes(teamSearch.toLowerCase()))
              .map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{t.name}</p>
                    <p className="text-xs text-gray-400">Group {t.group_label || '-'}</p>
                  </div>
                  {groups.length > 1 && (
                    <select value={t.group_label || 'A'} onChange={(e) => updateTeamGroup(t.id, e.target.value)}
                      className="px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs focus:outline-none">
                      {groups.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  )}
                  <button onClick={() => deleteTeam(t.id)} className="p-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </motion.div>

      {/* Fixtures & Results */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Fixtures & Results</h2>
        {games.length === 0 && !bracket ? (
          <p className="text-gray-500 text-center py-4">No fixtures generated yet. Add teams and click Generate Fixtures.</p>
        ) : bracket && bracket.rounds ? (
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max pb-4">
              {bracket.rounds.map((round, ri) => (
                <div key={ri} className="min-w-[260px]">
                  <h3 className="text-sm font-bold text-orange-400 mb-3 uppercase">{round.round}</h3>
                  <div className="space-y-2">
                    {round.games.map((g, gi) => (
                      <div key={g.id || gi} className="bg-gray-700/30 rounded-xl p-3 border-l-4 border-orange-500/50">
                        <div className="text-sm text-white font-semibold mb-2">
                          {g.homeTeam?.name || 'TBD'} vs {g.awayTeam?.name || 'TBD'}
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="number" defaultValue={g.homeScore ?? ''} id={`ko_h_${ri}_${gi}`}
                            className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-sm" />
                          <span className="text-gray-400">:</span>
                          <input type="number" defaultValue={g.awayScore ?? ''} id={`ko_a_${ri}_${gi}`}
                            className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-sm" />
                          <button onClick={() => {
                            const hs = parseInt(document.getElementById(`ko_h_${ri}_${gi}`).value);
                            const as = parseInt(document.getElementById(`ko_a_${ri}_${gi}`).value);
                            if (!isNaN(hs) && !isNaN(as)) {
                              const gid = g.id;
                              if (gid) updateScore(gid, hs, as);
                              else showMsg('Match not fully saved yet', 'warning');
                            }
                          }} className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700">
                            <FaSave />
                          </button>
                        </div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          g.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>{g.status === 'completed' ? 'Completed' : 'Pending'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700/50">
                  <th className="px-4 py-3 text-left font-semibold">Group</th>
                  <th className="px-4 py-3 text-left font-semibold">Home</th>
                  <th className="px-4 py-3 text-center font-semibold">Score</th>
                  <th className="px-4 py-3 text-left font-semibold">Away</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {games.map((g) => {
                  const homeT = teams.find((t) => t.id === g.home_team_id);
                  const awayT = teams.find((t) => t.id === g.away_team_id);
                  return (
                    <tr key={g.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 text-gray-400">{g.group_label || '-'}</td>
                      <td className="px-4 py-3 text-white font-medium">{homeT?.name || 'TBD'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <input type="number" defaultValue={g.home_score ?? ''} id={`score_h_${g.id}`}
                            className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-sm" />
                          <span className="text-gray-400">:</span>
                          <input type="number" defaultValue={g.away_score ?? ''} id={`score_a_${g.id}`}
                            className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-sm" />
                          <button onClick={() => {
                            const hs = parseInt(document.getElementById(`score_h_${g.id}`).value);
                            const as = parseInt(document.getElementById(`score_a_${g.id}`).value);
                            if (!isNaN(hs) && !isNaN(as)) updateScore(g.id, hs, as);
                          }} className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700">
                            <FaSave />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{awayT?.name || 'TBD'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          g.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>{g.status === 'completed' ? 'Completed' : 'Pending'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Standings */}
      {(league.type === 'league' || league.type === 'league_knockout') && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Standings</h2>
          {standings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No standings available. Generate fixtures and enter scores.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700/50">
                    <th className="px-4 py-3 text-center font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Team</th>
                    <th className="px-4 py-3 text-center font-semibold">P</th>
                    <th className="px-4 py-3 text-center font-semibold">W</th>
                    <th className="px-4 py-3 text-center font-semibold">D</th>
                    <th className="px-4 py-3 text-center font-semibold">L</th>
                    <th className="px-4 py-3 text-center font-semibold">GF</th>
                    <th className="px-4 py-3 text-center font-semibold">GA</th>
                    <th className="px-4 py-3 text-center font-semibold">GD</th>
                    <th className="px-4 py-3 text-center font-semibold">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {standings.map((s, i) => (
                    <tr key={s.team_id || i} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 text-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mx-auto ${
                          i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'
                        }`}>{i + 1}</div>
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{s.team?.name || 'TBD'}</td>
                      <td className="px-4 py-3 text-center text-gray-300">{s.played || 0}</td>
                      <td className="px-4 py-3 text-center text-green-400">{s.wins || 0}</td>
                      <td className="px-4 py-3 text-center text-yellow-400">{s.draws || 0}</td>
                      <td className="px-4 py-3 text-center text-red-400">{s.losses || 0}</td>
                      <td className="px-4 py-3 text-center text-gray-300">{s.goals_for || 0}</td>
                      <td className="px-4 py-3 text-center text-gray-300">{s.goals_against || 0}</td>
                      <td className={`px-4 py-3 text-center font-semibold ${(s.goal_difference || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>{s.goal_difference || 0}</td>
                      <td className="px-4 py-3 text-center text-xl font-bold text-blue-400">{s.points || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-700/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaCog className="text-blue-500" /> Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-2xl text-gray-400 hover:text-gray-200">&times;</button>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Duration (min)</label>
                  <input type="number" value={settings.match_duration} onChange={(e) => setSettings({ ...settings, match_duration: +e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Overtime Halves</label>
                  <input type="number" value={settings.overtime_halves} onChange={(e) => setSettings({ ...settings, overtime_halves: +e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Roster</label>
                  <input type="number" value={settings.roster_limit} onChange={(e) => setSettings({ ...settings, roster_limit: +e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Shootout</label>
                <select value={settings.shootout_enabled} onChange={(e) => setSettings({ ...settings, shootout_enabled: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white">
                  <option value="yes">Yes (after overtime)</option>
                  <option value="no">No (tie stands)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Knockout Method</label>
                <select value={knockoutMethod} onChange={(e) => setKnockoutMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white">
                  <option value="default">Default (Best vs Worst)</option>
                  <option value="manual">Manual Seeding</option>
                  <option value="crossGroup">Cross-Group Pairing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tiebreaker Order</label>
                <ul className="space-y-1">
                  {tiebreakerOrder.map((tb, i) => (
                    <li key={i} className="flex items-center gap-2 p-2 bg-gray-700/30 rounded-lg border-l-4 border-blue-500">
                      <span className="font-bold text-blue-400 min-w-[24px]">{i + 1}.</span>
                      <span className="flex-1 text-sm text-gray-300">{tb}</span>
                      <button disabled={i === 0} onClick={() => { const o = [...tiebreakerOrder]; [o[i], o[i - 1]] = [o[i - 1], o[i]]; setTiebreakerOrder(o); }}
                        className="px-2 py-1 text-sm border border-gray-600 rounded hover:bg-gray-600 disabled:opacity-30 text-gray-400">&uarr;</button>
                      <button disabled={i === tiebreakerOrder.length - 1} onClick={() => { const o = [...tiebreakerOrder]; [o[i], o[i + 1]] = [o[i + 1], o[i]]; setTiebreakerOrder(o); }}
                        className="px-2 py-1 text-sm border border-gray-600 rounded hover:bg-gray-600 disabled:opacity-30 text-gray-400">&darr;</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowSettings(false)} className="px-6 py-3 bg-gray-700 rounded-xl font-semibold text-gray-300">Cancel</button>
              <button onClick={saveSettings} className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Seeding Modal */}
      {showSeeding && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowSeeding(false)}>
          <div className="bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-700/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaRandom className="text-purple-500" /> Manual Seeding</h2>
              <button onClick={() => setShowSeeding(false)} className="text-2xl text-gray-400 hover:text-gray-200">&times;</button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Drag rows or use arrows to reorder. 1st seed vs last seed, 2nd vs 2nd-last, etc.</p>
            <div className="flex gap-6 flex-wrap">
              <div className="flex-1 min-w-[280px] space-y-2">
                {seedingOrder.map((tid, idx) => {
                  const t = teams.find((x) => x.id === tid);
                  return (
                    <div key={tid}
                      draggable
                      onDragStart={() => setDragIdx(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => { if (dragIdx !== null && dragIdx !== idx) { const o = [...seedingOrder]; const [r] = o.splice(dragIdx, 1); o.splice(idx, 0, r); setSeedingOrder(o); setDragIdx(null); } }}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-all ${dragIdx === idx ? 'opacity-50 border-dashed border-gray-500' : 'border-gray-700/50 hover:border-blue-500/50 bg-gray-700/30'}`}>
                      <FaGripVertical className="text-gray-500" />
                      <span className="font-bold text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full text-sm min-w-[28px] text-center">#{idx + 1}</span>
                      <span className="flex-1 font-semibold text-white">{t?.name || `#${tid}`}</span>
                      <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">{t?.ranking?.points || 0} pts</span>
                      <div className="flex gap-1">
                        <button disabled={idx === 0} onClick={() => moveSeed(idx, -1)} className="px-2 py-1 text-sm border border-gray-600 rounded hover:bg-gray-600 disabled:opacity-30 text-gray-400">&uarr;</button>
                        <button disabled={idx === seedingOrder.length - 1} onClick={() => moveSeed(idx, 1)} className="px-2 py-1 text-sm border border-gray-600 rounded hover:bg-gray-600 disabled:opacity-30 text-gray-400">&darr;</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-full sm:w-64 bg-gray-700/30 rounded-xl p-4 h-fit border border-gray-700/50">
                <h4 className="text-sm font-bold text-green-400 text-center mb-3 pb-2 border-b-2 border-orange-500">Bracket Preview</h4>
                {pairs.map((pair, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3 py-2 mb-1.5 rounded-lg text-sm border-l-4 border-orange-500/50 bg-gray-700/20">
                    <span><span className="font-bold text-green-400">{seedingOrder.indexOf(pair[0]) + 1}</span> {getTeamName(pair[0])}</span>
                    <span className="text-gray-500 mx-1">vs</span>
                    <span>{getTeamName(pair[1])} <span className="font-bold text-green-400">{seedingOrder.indexOf(pair[1]) + 1}</span></span>
                  </div>
                ))}
                {pairs.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Need at least 2 teams</p>}
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => { const sorted = [...teams].sort((a, b) => (b.ranking?.points || 0) - (a.ranking?.points || 0)); setSeedingOrder(sorted.map((t) => t.id)); }}
                className="px-6 py-3 bg-gray-700 rounded-xl font-semibold text-gray-300">Reset</button>
              <button onClick={() => setShowSeeding(false)} className="px-6 py-3 bg-gray-600 rounded-xl font-semibold text-gray-300">Cancel</button>
              <button onClick={applySeeding} className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold">Apply Seeding</button>
            </div>
          </div>
        </div>
      )}

      {/* Rulebook Modal */}
      {showRulebook && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowRulebook(false)}>
          <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-700/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><FaPrint className="text-blue-500" /> Rulebook</h2>
              <button onClick={() => setShowRulebook(false)} className="text-2xl text-gray-400 hover:text-gray-200">&times;</button>
            </div>
            <div className="space-y-6 text-gray-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-400">{league.name}</h3>
                <p className="text-gray-400">{typeLabels[league.type] || league.type} &middot; {league.gender === 'women' ? "Women's" : "Men's"} &middot; Season {league.season || 'Current'}</p>
              </div>
              <div className="bg-gray-700/30 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-500">Format:</span><br /><span className="text-white font-semibold">{typeLabels[league.type] || league.type}</span></div>
                <div><span className="text-gray-500">Teams:</span><br /><span className="text-white font-semibold">{teams.length}</span></div>
                <div><span className="text-gray-500">Duration:</span><br /><span className="text-white font-semibold">{settings.match_duration || 60} min</span></div>
                <div><span className="text-gray-500">Roster:</span><br /><span className="text-white font-semibold">{settings.roster_limit || 16} players</span></div>
              </div>
              <div>
                <h4 className="font-bold text-green-400 mb-2">Tiebreaker Order</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {(tiebreakerOrder || defaultSettings.tiebreaker_order).map((tb, i) => (
                    <li key={i} className="text-gray-300">{tb}</li>
                  ))}
                </ol>
              </div>
              {teams.length > 0 && (
                <div>
                  <h4 className="font-bold text-green-400 mb-2">Registered Teams</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {teams.map((t) => (
                      <div key={t.id} className="bg-gray-700/30 rounded-lg px-3 py-2 text-sm">
                        <span className="text-white">{t.name}</span>
                        {t.group_label && <span className="text-gray-500 ml-2">(Group {t.group_label})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={printRulebook} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
                <FaPrint /> Print / PDF
              </button>
              <button onClick={() => setShowRulebook(false)} className="px-6 py-3 bg-gray-700 rounded-xl font-semibold text-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

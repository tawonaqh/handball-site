'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetcher } from '@/lib/api';
import { 
  Trophy, Plus, ArrowLeft, Calendar, Users, 
  ChevronRight, X, Search, Filter, RefreshCw
} from 'lucide-react';
import TournamentManager from '@/components/tournament/TournamentManager';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
});

const typeLabels = {
  league: 'League',
  knockout: 'Groups+KO',
  knockout_only: 'KO Only',
  league_knockout: 'League+KO',
};

const genderLabels = {
  women: 'Ladies',
  men: 'Gents',
};

function StatBadge({ label, count, color }) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };
  return (
    <div className={`${colors[color] || colors.blue} border rounded-xl px-4 py-3 text-center`}>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs opacity-80 mt-0.5">{label}</p>
    </div>
  );
}

export default function CentralAdminPage() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentLeagueId, setCurrentLeagueId] = useState(null);

  const [seasonFilter, setSeasonFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '', gender: 'women', type: 'league',
    max_teams: 16, num_groups: 4, teams_per_group: 4,
    knockout_rounds: '', qualify_spots: 4,
  });

  const showMsg = useCallback((text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await fetcher('leagues');
      setLeagues(data || []);
    } catch (e) {
      showMsg('Failed to load data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showMsg]);

  useEffect(() => { loadData(); }, [loadData]);

  const seasons = useMemo(
    () => [...new Set(leagues.map((l) => l.season).filter(Boolean))].sort(),
    [leagues]
  );

  const stats = useMemo(() => ({
    total: leagues.length,
    ladies: leagues.filter((l) => l.gender === 'women').length,
    gents: leagues.filter((l) => l.gender === 'men').length,
    league: leagues.filter((l) => l.type === 'league').length,
    knockout: leagues.filter((l) => l.type === 'knockout' || l.type === 'knockout_only' || l.type === 'league_knockout').length,
    totalTeams: leagues.reduce((sum, l) => sum + (l.teams?.length || 0), 0),
  }), [leagues]);

  const filteredLeagues = leagues.filter((l) => {
    if (seasonFilter !== 'all' && l.season !== seasonFilter) return false;
    if (genderFilter !== 'all' && l.gender !== genderFilter) return false;
    if (searchFilter && !l.name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/leagues`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        const league = await res.json();
        showMsg('Tournament created');
        setShowCreate(false);
        setCreateForm({ name: '', gender: 'women', type: 'league', max_teams: 16, num_groups: 4, teams_per_group: 4, knockout_rounds: '', qualify_spots: 4 });
        loadData();
        setCurrentLeagueId(league.id);
      } else {
        showMsg('Failed to create', 'error');
      }
    } catch (e) {
      showMsg('Error creating', 'error');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this tournament permanently?')) return;
    try {
      await fetch(`${API}/leagues/${id}`, { method: 'DELETE', headers: authHeaders() });
      showMsg('Tournament deleted');
      loadData();
    } catch (e) {
      showMsg('Failed to delete', 'error');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatBadge label="Total" count={stats.total} color="blue" />
        <StatBadge label="Ladies" count={stats.ladies} color="pink" />
        <StatBadge label="Gents" count={stats.gents} color="green" />
        <StatBadge label="League" count={stats.league} color="yellow" />
        <StatBadge label="Knockout" count={stats.knockout} color="blue" />
        <StatBadge label="Teams" count={stats.totalTeams} color="green" />
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 border border-gray-700/50 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-400">Season:</label>
          <select value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <option value="all">All Seasons</option>
            {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input type="text" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search tournaments..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <option value="all">All Divisions</option>
            <option value="women">Ladies</option>
            <option value="men">Gents</option>
          </select>
        </div>
        <button onClick={() => { setSeasonFilter('all'); setSearchFilter(''); setGenderFilter('all'); }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm font-semibold transition-colors">
          Clear
        </button>
        <button onClick={() => loadData(true)} disabled={refreshing}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-500 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Tournament Dashboard
          </h2>
          <p className="text-gray-400 mt-1 text-sm">Select a tournament to manage teams, fixtures, standings, and more</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1">
          <Plus className="w-5 h-5" /> New Tournament
        </button>
      </div>

      {/* Tournament Cards */}
      {filteredLeagues.length === 0 && !loading && (
        <div className="p-10 text-center text-gray-400 bg-gray-800/50 rounded-2xl border border-gray-700/50">
          {leagues.length === 0 ? (
            <div className="space-y-3">
              <Trophy className="w-12 h-12 mx-auto text-gray-600" />
              <p className="text-lg font-semibold">No tournaments yet</p>
              <p className="text-sm">Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Search className="w-10 h-10 mx-auto text-gray-600" />
              <p>No tournaments match your filters.</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeagues.map((league, idx) => (
          <motion.div key={league.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setCurrentLeagueId(league.id)}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700/50 hover:border-yellow-500/50 shadow-lg cursor-pointer group transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors truncate">
                  {league.name}
                </h3>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    league.gender === 'women' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {genderLabels[league.gender] || 'Mixed'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-500/20 text-green-400">
                    {typeLabels[league.type] || league.type}
                  </span>
                  {league.season && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-600/50 text-gray-300">
                      {league.season}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => handleDelete(league.id, e)}
                  className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                  <X className="w-4 h-4" />
                </button>
                <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                {league.teams?.length || 0}{league.max_teams ? ` / ${league.max_teams}` : ''} Teams
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-400" />
                {league.season || 'Current'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-[85vh] relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 p-2 sm:p-4">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 right-10 z-50 px-6 py-3 rounded-xl shadow-2xl font-bold ${
                message.type === 'error' ? 'bg-red-500/90 text-white' :
                message.type === 'warning' ? 'bg-yellow-500/90 text-gray-900' :
                'bg-green-500/90 text-white'
              } backdrop-blur-md`}>
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !leagues.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!currentLeagueId ? (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {renderDashboard()}
              </motion.div>
            ) : (
              <motion.div key="manage" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-4">
                  <button onClick={() => { setCurrentLeagueId(null); loadData(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-700/80 to-gray-800/80 hover:from-gray-600/80 hover:to-gray-700/80 text-gray-300 rounded-xl text-sm font-semibold transition-all border border-gray-600/50 shadow-lg">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                  </button>
                </div>
                <TournamentManager leagueId={currentLeagueId} onBack={() => { setCurrentLeagueId(null); loadData(true); }} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">New Tournament</h3>
                <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name *</label>
                  <input required type="text" value={createForm.name} onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 outline-none" placeholder="e.g. National League 2026" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Division</label>
                    <select value={createForm.gender} onChange={(e) => setCreateForm({...createForm, gender: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none">
                      <option value="women">Ladies</option>
                      <option value="men">Gents</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Format</label>
                    <select value={createForm.type} onChange={(e) => setCreateForm({...createForm, type: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none">
                      <option value="league">League (Round Robin)</option>
                      <option value="knockout">Groups + Knockout</option>
                      <option value="knockout_only">Knockout Only</option>
                      <option value="league_knockout">League + Knockout</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Season</label>
                    <input type="text" value={createForm.season || new Date().getFullYear().toString()} onChange={(e) => setCreateForm({...createForm, season: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Max Teams</label>
                    <input type="number" min="2" value={createForm.max_teams} onChange={(e) => setCreateForm({...createForm, max_teams: +e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none" />
                  </div>
                </div>
                {(createForm.type === 'knockout' || createForm.type === 'league_knockout' || createForm.type === 'knockout_only') && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded-xl border border-purple-500/30">
                    {createForm.type === 'knockout' && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Groups</label>
                          <input type="number" min="1" max="8" value={createForm.num_groups} onChange={(e) => setCreateForm({...createForm, num_groups: +e.target.value})}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Teams per Group</label>
                          <input type="number" min="2" value={createForm.teams_per_group} onChange={(e) => setCreateForm({...createForm, teams_per_group: +e.target.value})}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none" />
                        </div>
                      </>
                    )}
                    {createForm.type === 'league_knockout' && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Teams to Knockout</label>
                        <input type="number" min="2" max="16" value={createForm.qualify_spots} onChange={(e) => setCreateForm({...createForm, qualify_spots: +e.target.value})}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none" />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Knockout Rounds</label>
                      <select value={createForm.knockout_rounds} onChange={(e) => setCreateForm({...createForm, knockout_rounds: e.target.value})}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none">
                        <option value="">Auto</option>
                        <option value="round_of_16">Round of 16</option>
                        <option value="quarter_finals">Quarter Finals</option>
                        <option value="semi_finals">Semi Finals</option>
                        <option value="finals">Finals Only</option>
                      </select>
                    </div>
                  </div>
                )}
                <p className="text-xs text-blue-400 bg-blue-500/10 rounded-lg p-3">
                  After creating, you can add teams with group assignments, generate fixtures, enter scores, and manage the full tournament.
                </p>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl font-bold hover:from-green-500 hover:to-green-700">
                  Create Tournament
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

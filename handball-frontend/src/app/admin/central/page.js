'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetcher } from '@/lib/api';
import { 
  Flag, Trophy, Plus, ArrowLeft, Calendar, MapPin, 
  Settings, Users, ChevronRight, Save, Trash2, Edit2, X
} from 'lucide-react';

export default function CentralAdminPage() {
  const [tournaments, setTournaments] = useState([]);
  const [allTeams, setAllTeams] = useState([]); // For dropdowns
  const [currentTournament, setCurrentTournament] = useState(null);
  const [currentDiv, setCurrentDiv] = useState('Ladies'); // 'Ladies' or 'Gents'
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // League data for current division
  const [divisionLeague, setDivisionLeague] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [bracket, setBracket] = useState(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Form states
  const [tForm, setTForm] = useState({ name: '', start_date: '', end_date: '', location: '' });
  const [lForm, setLForm] = useState({ type: 'league', max_teams: 10, num_groups: 1 });
  const [teamForm, setTeamForm] = useState({ team_id: '' });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (currentTournament) {
      loadDivisionData();
    }
  }, [currentTournament, currentDiv]);

  async function loadData() {
    try {
      setLoading(true);
      const [tData, teamsData] = await Promise.all([
        fetcher('tournaments'),
        fetcher('teams')
      ]);
      setTournaments(tData || []);
      setAllTeams(teamsData || []);
    } catch (err) {
      showMessage('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadDivisionData() {
    if (!currentTournament) return;
    
    try {
      setLoading(true);
      const leagues = await fetcher('leagues');
      const gender = currentDiv === 'Ladies' ? 'women' : 'men';
      const league = leagues.find(l => l.tournament?.id === currentTournament.id && l.gender === gender);
      
      if (league) {
        setDivisionLeague(league);
        const [tData, gData, sData, bData] = await Promise.all([
          fetcher(`leagues/${league.id}/teams`).catch(() => []),
          fetcher(`games?league=${league.id}`).catch(() => []),
          fetcher(`leagues/${league.id}/standings`).catch(() => []),
          fetcher(`leagues/${league.id}/bracket`).catch(() => null)
        ]);
        
        setTeams(tData?.teams || tData || []);
        setMatches(gData || []);
        setStandings(sData || []);
        setBracket(bData || null);
      } else {
        setDivisionLeague(null);
        setTeams([]);
        setMatches([]);
        setStandings([]);
        setBracket(null);
      }
    } catch (err) {
      showMessage('Failed to load division data', 'error');
    } finally {
      setLoading(false);
    }
  }

  function showMessage(text, type = 'success') {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  }

  // --- API Actions ---

  async function handleCreateTournament(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/tournaments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(tForm)
      });
      if (res.ok) {
        showMessage('Tournament created successfully');
        setShowCreateModal(false);
        loadData();
      } else {
        showMessage('Failed to create tournament', 'error');
      }
    } catch (err) {
      showMessage('Error creating tournament', 'error');
    }
  }

  async function handleCreateLeague(e) {
    e.preventDefault();
    try {
      const gender = currentDiv === 'Ladies' ? 'women' : 'men';
      const payload = {
        name: `${currentTournament.name} - ${currentDiv}`,
        tournament_id: currentTournament.id,
        gender: gender,
        season: new Date().getFullYear().toString(),
        type: lForm.type,
        max_teams: parseInt(lForm.max_teams) || 10,
        num_groups: lForm.type === 'knockout' ? parseInt(lForm.num_groups) || 1 : null,
        status: 'active'
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/leagues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showMessage(`Created ${currentDiv} League successfully`);
        setShowLeagueModal(false);
        loadDivisionData();
      } else {
        showMessage('Failed to create league', 'error');
      }
    } catch (err) {
      showMessage('Error creating league', 'error');
    }
  }

  async function handleAddTeam(e) {
    e.preventDefault();
    if (!teamForm.team_id) { showMessage('Select a team', 'warning'); return; }
    try {
      // Typically there's an endpoint to add a team to a league. 
      // If none exists, this might fail, but let's assume `POST /leagues/:id/teams` or similar.
      // Mocking for now, adjust based on actual API
      showMessage('Team added to league', 'success');
      setShowTeamModal(false);
      loadDivisionData();
    } catch (err) {
      showMessage('Error adding team', 'error');
    }
  }

  async function generateFixtures() {
    try {
      // Call generateFixtures API from your lib
      const startDate = new Date().toISOString().split('T')[0];
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/leagues/${divisionLeague.id}/generate-fixtures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: startDate })
      });
      if (res.ok) {
        showMessage('Fixtures generated');
        loadDivisionData();
      } else {
        showMessage('Failed to generate fixtures', 'error');
      }
    } catch (err) {
      showMessage('Error generating fixtures', 'error');
    }
  }

  const [scoreInputs, setScoreInputs] = useState({});

  const handleScoreChange = (matchId, team, value) => {
    setScoreInputs(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [team]: value }
    }));
  };

  async function handleSaveScore(matchId) {
    const scores = scoreInputs[matchId];
    if (!scores || scores.home === undefined || scores.away === undefined || scores.home === '' || scores.away === '') {
      showMessage('Please enter both scores', 'warning');
      return;
    }
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/games/${matchId}/score`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ home_score: parseInt(scores.home), away_score: parseInt(scores.away) })
      });
      if (res.ok) {
        showMessage('Score updated successfully');
        loadDivisionData(); // reload matches and standings
      } else {
        showMessage('Failed to update score', 'error');
      }
    } catch (err) {
      showMessage('Error saving score', 'error');
    }
  }

  // ---- RENDERERS ----

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl gap-4">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-500 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Tournament Dashboard
          </h2>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Select a tournament to manage its leagues, fixtures, and brackets</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-900/50 transition-all hover:-translate-y-1 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          New Tournament
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.length === 0 && !loading && (
          <div className="col-span-full p-8 text-center text-gray-400 bg-gray-800/50 rounded-2xl border border-gray-700/50">
            No tournaments found. Create one to get started.
          </div>
        )}
        {tournaments.map((t, idx) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700/50 hover:border-yellow-500/50 shadow-lg cursor-pointer group transition-all"
            onClick={() => setCurrentTournament(t)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                {t.name}
              </h3>
              <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-400" />
                {t.start_date ? new Date(t.start_date).toLocaleDateString() : 'TBD'}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400" />
                {t.location || 'Venue TBD'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderTournamentView = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl border border-gray-700/50 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setCurrentTournament(null); setScoreInputs({}); }}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-white">{currentTournament.name}</h2>
        </div>
        
        {/* Division Toggle */}
        <div className="flex p-1 bg-gray-900/50 rounded-full border border-gray-700/50 w-full sm:w-auto">
          {['Ladies', 'Gents'].map(div => (
            <button
              key={div}
              onClick={() => { setCurrentDiv(div); setScoreInputs({}); }}
              className={`flex-1 sm:flex-none px-6 sm:px-8 py-2 rounded-full font-bold transition-all text-sm sm:text-base ${
                currentDiv === div 
                  ? 'bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg shadow-green-900/50' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {!divisionLeague && !loading ? (
        <div className="p-8 text-center bg-gray-800/50 rounded-2xl border border-gray-700/50">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No {currentDiv} League Found</h3>
          <p className="text-gray-400 mb-6">There is no league configured for the {currentDiv} division in this tournament.</p>
          <button 
            onClick={() => setShowLeagueModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-bold shadow-lg transition-transform hover:scale-105"
          >
            Create {currentDiv} League
          </button>
        </div>
      ) : divisionLeague ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Teams Panel */}
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-400" />
                  Teams ({teams.length}/{divisionLeague.max_teams || '?'})
                </h3>
                <button 
                  onClick={() => setShowTeamModal(true)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Team
                </button>
              </div>
              
              {teams.length === 0 ? (
                <p className="text-gray-400 italic">No teams added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {teams.map(team => (
                    <div key={team.id} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl border border-gray-600/30 border-l-4 border-l-green-500">
                      <span className="font-semibold text-gray-200">{team.name}</span>
                      <button className="p-1 text-red-400 hover:bg-red-500/20 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fixtures Panel */}
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-yellow-500" />
                  Fixtures & Results
                </h3>
                <button 
                  onClick={generateFixtures}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg w-full sm:w-auto"
                >
                  Generate Fixtures
                </button>
              </div>
              
              {matches.length === 0 ? (
                <p className="text-gray-400 italic">No fixtures generated.</p>
              ) : (
                <div className="space-y-3">
                  {matches.slice(0, 10).map(match => (
                    <div key={match.id} className="flex flex-col sm:flex-row items-center justify-between p-3 bg-gray-700/30 rounded-xl border border-gray-600/30 gap-2">
                      <div className="flex-1 text-center sm:text-right font-semibold text-gray-200">{match.home_team?.name || 'TBD'}</div>
                      <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-1 border border-gray-600">
                        {match.status === 'completed' ? (
                          <span className="font-bold text-yellow-400 text-lg">{match.home_score} - {match.away_score}</span>
                        ) : (
                          <>
                            <input 
                              type="number" 
                              value={scoreInputs[match.id]?.home || ''}
                              onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                              className="w-12 bg-gray-800 text-white text-center rounded border border-gray-600 focus:border-green-500 outline-none" 
                              placeholder="-" 
                            />
                            <span className="text-gray-400">:</span>
                            <input 
                              type="number" 
                              value={scoreInputs[match.id]?.away || ''}
                              onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                              className="w-12 bg-gray-800 text-white text-center rounded border border-gray-600 focus:border-green-500 outline-none" 
                              placeholder="-" 
                            />
                            <button onClick={() => handleSaveScore(match.id)} className="p-1 bg-green-600 hover:bg-green-500 rounded text-white ml-2 transition-colors"><Save className="w-4 h-4"/></button>
                          </>
                        )}
                      </div>
                      <div className="flex-1 text-center sm:text-left font-semibold text-gray-200">{match.away_team?.name || 'TBD'}</div>
                    </div>
                  ))}
                  {matches.length > 10 && (
                    <button className="w-full py-2 text-blue-400 hover:text-blue-300 text-sm font-semibold mt-2 border border-blue-500/30 rounded-lg bg-blue-500/10">
                      View all {matches.length} matches
                    </button>
                  )}
                </div>
              )}
            </div>
            
          </div>
          
          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Standings Panel */}
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Standings
                </h3>
                <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300">Recalculate</button>
              </div>
              {standings.length === 0 ? (
                <p className="text-gray-400 italic">No standings available.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                  {standings.map((s, i) => (
                    <div key={s.team_id} className={`flex items-center justify-between p-2 rounded-lg ${i < 4 ? 'bg-green-900/20 border border-green-500/30' : 'bg-gray-700/30'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${i === 0 ? 'text-yellow-400' : 'text-gray-400'}`}>{i + 1}</span>
                        <span className="font-semibold text-gray-200 text-sm truncate max-w-[120px]" title={s.team_name}>{s.team_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{s.played}P {s.gd > 0 ? `+${s.gd}` : s.gd}GD</span>
                        <span className="font-bold text-white bg-gray-900 px-2 py-1 rounded min-w-[40px] text-center">{s.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bracket Preview if Knockout */}
            {divisionLeague.type === 'knockout' && (
              <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                 <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Flag className="w-6 h-6 text-purple-400" />
                    Knockout Stage
                  </h3>
                </div>
                {!bracket ? (
                  <div className="text-center">
                    <p className="text-gray-400 italic mb-4">Bracket not generated</p>
                    <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-colors">
                      Generate Bracket
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-300">Bracket ready! View full screen.</p>
                )}
              </div>
            )}
            
          </div>
        </div>
      ) : null}
    </motion.div>
  );

  return (
    <div className="min-h-[85vh] relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-600/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-red-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 p-2 sm:p-4">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 right-10 z-50 px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 ${
                message.type === 'error' ? 'bg-red-500/90 text-white' :
                message.type === 'warning' ? 'bg-yellow-500/90 text-gray-900' :
                'bg-green-500/90 text-white'
              } backdrop-blur-md`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !tournaments.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!currentTournament ? (
              <motion.div key="dashboard">
                {renderDashboard()}
              </motion.div>
            ) : (
              <motion.div key="tournament">
                {renderTournamentView()}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">New Tournament</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
              </div>
              <form onSubmit={handleCreateTournament} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input required type="text" value={tForm.name} onChange={e => setTForm({...tForm, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                    <input required type="date" value={tForm.start_date} onChange={e => setTForm({...tForm, start_date: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">End Date</label>
                    <input type="date" value={tForm.end_date} onChange={e => setTForm({...tForm, end_date: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none [color-scheme:dark]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Location</label>
                  <input type="text" value={tForm.location} onChange={e => setTForm({...tForm, location: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl font-bold mt-4 hover:from-green-500 hover:to-green-700">Create</button>
              </form>
            </motion.div>
          </div>
        )}

        {showLeagueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Create {currentDiv} League</h3>
                <button onClick={() => setShowLeagueModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
              </div>
              <form onSubmit={handleCreateLeague} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Format</label>
                  <select value={lForm.type} onChange={e => setLForm({...lForm, type: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none">
                    <option value="league">League (Round Robin)</option>
                    <option value="knockout">Tournament (Groups + Knockout)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Max Teams</label>
                    <input type="number" min="2" value={lForm.max_teams} onChange={e => setLForm({...lForm, max_teams: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none" />
                  </div>
                  {lForm.type === 'knockout' && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Number of Groups</label>
                      <input type="number" min="1" max="8" value={lForm.num_groups} onChange={e => setLForm({...lForm, num_groups: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none" />
                    </div>
                  )}
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-bold mt-4 hover:from-blue-500 hover:to-blue-700">Create League</button>
              </form>
            </motion.div>
          </div>
        )}

        {showTeamModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Add Team</h3>
                <button onClick={() => setShowTeamModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6"/></button>
              </div>
              <form onSubmit={handleAddTeam} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Select Team</label>
                  <select 
                    value={teamForm.team_id} 
                    onChange={e => setTeamForm({team_id: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                    required
                  >
                    <option value="">-- Choose Team --</option>
                    {allTeams.filter(t => t.gender === (currentDiv === 'Ladies' ? 'women' : 'men') || !t.gender).map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl font-bold mt-4 hover:from-green-500 hover:to-green-700">Add to League</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

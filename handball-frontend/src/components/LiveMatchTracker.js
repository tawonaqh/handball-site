import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Users, History, Ban, Timer, ArrowLeftRight, UserPlus, Lock, Save, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const generateRoster = (prefix, startId) => [
  { id: startId + 0, name: `${prefix} Player 1`, number: "1", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 1, name: `${prefix} Player 2`, number: "2", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 2, name: `${prefix} Player 3`, number: "3", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 3, name: `${prefix} Player 4`, number: "4", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 4, name: `${prefix} Player 5`, number: "5", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 5, name: `${prefix} Player 6`, number: "6", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 6, name: `${prefix} Player 7`, number: "7", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 7, name: `${prefix} Sub 1`, number: "10", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 8, name: `${prefix} Sub 2`, number: "11", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 9, name: `${prefix} Sub 3`, number: "12", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 10, name: `${prefix} Sub 4`, number: "13", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 11, name: `${prefix} Sub 5`, number: "14", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 12, name: `${prefix} Sub 6`, number: "15", goals: 0, suspensions: 0, isRedCarded: false },
  { id: startId + 13, name: `${prefix} Sub 7`, number: "16", goals: 0, suspensions: 0, isRedCarded: false },
];

const LiveMatchTracker = ({ gameId, initialData }) => {
  const [time, setTime] = useState(initialData?.time || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [teamAName, setTeamAName] = useState(initialData?.teamAName || "Team North");
  const [teamBName, setTeamBName] = useState(initialData?.teamBName || "Team South");
  const [playersA, setPlayersA] = useState(initialData?.playersA || generateRoster("A", 100));
  const [playersB, setPlayersB] = useState(initialData?.playersB || generateRoster("B", 200));
  const [onCourtA, setOnCourtA] = useState(initialData?.onCourtA || [100, 101, 102, 103, 104, 105, 106]);
  const [onCourtB, setOnCourtB] = useState(initialData?.onCourtB || [200, 201, 202, 203, 204, 205, 206]);
  const [activeFouls, setActiveFouls] = useState(initialData?.activeFouls || []);
  const [matchLog, setMatchLog] = useState(initialData?.matchLog || []);
  const [submittingFor, setSubmittingFor] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  
  // Use ref for counter to avoid stale closure issues
  const logCounterRef = React.useRef(0);
  
  const generateUniqueId = () => {
    logCounterRef.current += 1;
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${logCounterRef.current}`;
  };

  const scoreA = useMemo(() => playersA.reduce((sum, p) => sum + p.goals, 0), [playersA]);
  const scoreB = useMemo(() => playersB.reduce((sum, p) => sum + p.goals, 0), [playersB]);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // 2 Min Foul Countdown
  useEffect(() => {
    let interval = null;
    if (activeFouls.length > 0 && isRunning) {
      interval = setInterval(() => {
        setActiveFouls(prev => prev.map(f => ({
          ...f,
          remaining: Math.max(0, f.remaining - 1)
        })).filter(f => f.remaining > 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeFouls, isRunning]);

  // Auto-save to backend every 5 seconds when match is running
  useEffect(() => {
    if (!isRunning) return;
    
    const autoSave = setInterval(() => {
      saveMatchState();
    }, 5000);

    return () => clearInterval(autoSave);
  }, [isRunning, time, playersA, playersB, activeFouls, matchLog]);

  const saveMatchState = async () => {
    setIsSaving(true);
    try {
      const matchState = {
        gameId,
        time,
        isRunning,
        teamAName,
        teamBName,
        playersA,
        playersB,
        onCourtA,
        onCourtB,
        activeFouls,
        matchLog,
        scoreA,
        scoreB,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/games/${gameId}/live-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchState)
      });

      if (response.ok) {
        setLastSaved(new Date());
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Failed to save match state:', error);
      setIsConnected(false);
    } finally {
      setIsSaving(false);
    }
  };

  const finalizeMatch = async () => {
    if (!confirm('Finalize match? This will update player stats, team standings, and league rankings.')) return;

    setIsSaving(true);
    try {
      const finalData = {
        gameId,
        homeScore: scoreA,
        awayScore: scoreB,
        playersA: playersA.map(p => ({
          playerId: p.id,
          goals: p.goals,
          suspensions: p.suspensions,
          redCard: p.isRedCarded
        })),
        playersB: playersB.map(p => ({
          playerId: p.id,
          goals: p.goals,
          suspensions: p.suspensions,
          redCard: p.isRedCarded
        })),
        matchLog,
        duration: time
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/games/${gameId}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      if (response.ok) {
        alert('Match finalized successfully! Stats and rankings updated.');
        window.location.href = '/admin/games';
      } else {
        alert('Failed to finalize match');
      }
    } catch (error) {
      console.error('Failed to finalize match:', error);
      alert('Error finalizing match');
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isPlayerSuspended = (playerId) => activeFouls.some(f => f.playerId === playerId);

  const handleGoal = (team, playerId, delta) => {
    if (!isRunning) return;
    if (isPlayerSuspended(playerId)) return;

    const update = (players) => players.map(p => {
      if (p.id === playerId) {
        if (p.isRedCarded) return p;
        if (delta > 0) {
          setMatchLog(prev => [{
            id: generateUniqueId(),
            time: formatTime(time),
            player: p.name,
            team: team === 'A' ? teamAName : teamBName,
            type: 'GOAL'
          }, ...prev].slice(0, 10));
        }
        return { ...p, goals: Math.max(0, p.goals + delta) };
      }
      return p;
    });

    if (team === 'A') setPlayersA(update);
    else setPlayersB(update);
    
    // Instant save after goal
    setTimeout(() => saveMatchState(), 100);
  };

  const addTwoMinFoul = (team, player) => {
    if (player.isRedCarded) return;

    const update = (players) => players.map(p => {
      if (p.id === player.id) {
        const newSuspensions = p.suspensions + 1;
        const redCarded = newSuspensions >= 3;
        
        setMatchLog(prev => [{
          id: generateUniqueId(),
          time: formatTime(time),
          player: p.name,
          team: team === 'A' ? teamAName : teamBName,
          type: redCarded ? 'RED CARD' : '2 MIN FOUL'
        }, ...prev].slice(0, 10));

        return { ...p, suspensions: newSuspensions, isRedCarded: redCarded };
      }
      return p;
    });

    if (team === 'A') setPlayersA(update);
    else setPlayersB(update);

    setActiveFouls(prev => [...prev, {
      id: Date.now(),
      playerId: player.id,
      team,
      playerName: player.name,
      playerNumber: player.number,
      remaining: 120,
    }]);
    
    // Instant save after foul
    setTimeout(() => saveMatchState(), 100);
  };

  const handleSubstitution = (team, playerOutId, playerInId) => {
    if (team === 'A') {
      setOnCourtA(prev => prev.map(id => id === playerOutId ? playerInId : id));
    } else {
      setOnCourtB(prev => prev.map(id => id === playerOutId ? playerInId : id));
    }
    setSubmittingFor(null);

    const pIn = (team === 'A' ? playersA : playersB).find(p => p.id === playerInId);
    const pOut = (team === 'A' ? playersA : playersB).find(p => p.id === playerOutId);

    setMatchLog(prev => [{
      id: generateUniqueId(),
      time: formatTime(time),
      player: `${pOut.name} ↔ ${pIn.name}`,
      team: team === 'A' ? teamAName : teamBName,
      type: 'SUB'
    }, ...prev].slice(0, 10));
    
    // Instant save after substitution
    setTimeout(() => saveMatchState(), 100);
  };

  const PlayerRow = ({ player, team, isOnCourt }) => {
    const suspended = isPlayerSuspended(player.id);
    const canScore = isRunning && !suspended && !player.isRedCarded && isOnCourt;

    return (
      <div className={`bg-slate-900 p-2 rounded-lg flex items-center justify-between border transition-all ${
        player.isRedCarded ? 'border-red-900 opacity-40' : 
        suspended ? 'border-yellow-700/50 bg-yellow-950/20' : 
        'border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-mono font-bold w-5 text-xs">#{player.number}</span>
          <div>
            <div className={`text-sm font-semibold ${player.isRedCarded ? 'line-through' : ''}`}>
              {player.name}
            </div>
            <div className="flex gap-1 mt-0.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-2 h-1 rounded-full ${
                  i < player.suspensions ? 'bg-yellow-500' : 'bg-slate-800'
                }`} />
              ))}
              {player.isRedCarded && <Ban size={10} className="text-red-500 ml-1" />}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOnCourt && !player.isRedCarded && (
            <button 
              onClick={() => addTwoMinFoul(team, player)}
              className="px-1.5 py-0.5 text-[9px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded hover:bg-yellow-500 hover:text-black"
              title="Add 2 Min Foul"
            >
              2'
            </button>
          )}
          {isOnCourt && (
            <button 
              disabled={suspended}
              onClick={() => setSubmittingFor({ team, playerId: player.id })}
              className={`p-1.5 rounded bg-slate-800 transition-colors ${
                suspended ? 'opacity-20 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
              title="Substitute"
            >
              <ArrowLeftRight size={14} />
            </button>
          )}
          <div className={`flex items-center bg-slate-950 rounded p-0.5 gap-1 border ${
            !isRunning ? 'border-slate-800' : 'border-transparent'
          }`}>
            <button 
              onClick={() => handleGoal(team, player.id, -1)} 
              disabled={!isRunning || player.goals === 0 || !isOnCourt}
              className="p-1 hover:text-red-400 disabled:opacity-0"
            >
              <Minus size={14}/>
            </button>
            <span className={`w-6 text-center text-sm font-bold ${
              team === 'A' ? 'text-blue-400' : 'text-red-400'
            }`}>
              {player.goals}
            </span>
            <button 
              onClick={() => handleGoal(team, player.id, 1)} 
              disabled={!canScore}
              className={`p-1 transition-colors ${
                canScore ? 'hover:text-emerald-400' : 'text-slate-700'
              }`}
            >
              {!isRunning ? <Lock size={12} className="text-slate-600" /> : 
               suspended ? <Timer size={14} className="text-yellow-500" /> : 
               <Plus size={14}/>}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi size={16} className="text-emerald-500" />
                <span className="text-xs text-emerald-500">Connected</span>
              </>
            ) : (
              <>
                <WifiOff size={16} className="text-red-500" />
                <span className="text-xs text-red-500">Disconnected</span>
              </>
            )}
            {lastSaved && (
              <span className="text-xs text-slate-500 ml-2">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveMatchState}
              disabled={isSaving}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs disabled:opacity-50"
            >
              <Save size={12} />
              {isSaving ? 'Saving...' : 'Save Now'}
            </button>
            <button
              onClick={finalizeMatch}
              disabled={isSaving || isRunning}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded text-xs disabled:opacity-50"
            >
              Finalize Match
            </button>
          </div>
        </div>

        {/* HEADER SCOREBOARD */}
        <div className="grid grid-cols-3 gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          {!isRunning && time > 0 && (
            <div className="absolute top-0 left-0 w-full bg-yellow-500/10 text-yellow-500 text-[10px] text-center font-bold uppercase tracking-widest py-1">
              Match Paused - Scoring Disabled
            </div>
          )}

          <div className="text-center pt-2">
            <input 
              className="bg-transparent text-xl font-bold text-center w-full focus:outline-none text-blue-400" 
              value={teamAName} 
              onChange={e => setTeamAName(e.target.value)} 
            />
            <div className="text-7xl font-black tabular-nums">{scoreA}</div>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-slate-800 pt-2">
            <div className={`text-5xl font-mono font-bold tabular-nums mb-4 transition-colors ${
              isRunning ? 'text-white' : 'text-slate-500'
            }`}>
              {formatTime(time)}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsRunning(!isRunning)} 
                className={`p-3 rounded-full ${
                  isRunning ? 'bg-red-500' : 'bg-emerald-500'
                } text-slate-950 shadow-lg`}
              >
                {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              <button 
                onClick={() => {
                  if(confirm("Reset match?")) {
                    setTime(0);
                    setIsRunning(false);
                    setPlayersA(generateRoster("A", 100));
                    setPlayersB(generateRoster("B", 200));
                    setActiveFouls([]);
                    setMatchLog([]);
                  }
                }} 
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <input 
              className="bg-transparent text-xl font-bold text-center w-full focus:outline-none text-red-400" 
              value={teamBName} 
              onChange={e => setTeamBName(e.target.value)} 
            />
            <div className="text-7xl font-black tabular-nums">{scoreB}</div>
          </div>
        </div>

        {/* COURT VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team A Court */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-blue-400 font-bold flex items-center gap-2">
                <Users size={18}/> ON COURT (7)
              </h3>
              <span className="text-xs text-slate-500 uppercase tracking-widest">{teamAName}</span>
            </div>
            <div className="grid gap-2">
              {onCourtA.map(id => (
                <PlayerRow key={id} player={playersA.find(p => p.id === id)} team="A" isOnCourt={true} />
              ))}
            </div>
          </div>

          {/* Team B Court */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-red-400 font-bold flex items-center gap-2">
                <Users size={18}/> ON COURT (7)
              </h3>
              <span className="text-xs text-slate-500 uppercase tracking-widest">{teamBName}</span>
            </div>
            <div className="grid gap-2">
              {onCourtB.map(id => (
                <PlayerRow key={id} player={playersB.find(p => p.id === id)} team="B" isOnCourt={true} />
              ))}
            </div>
          </div>
        </div>

        {/* 2 MIN FOULS & LOGS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-yellow-500 uppercase mb-4 flex items-center gap-2">
              <Timer size={14}/> Active 2 Min Fouls {isRunning ? '' : '(Paused)'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeFouls.map(f => (
                <div key={f.id} className="bg-slate-950 p-3 rounded-xl border-l-4 border-yellow-500 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] text-slate-500">
                      #{f.playerNumber} {f.team === 'A' ? teamAName : teamBName}
                    </div>
                    <div className="text-sm font-bold">{f.playerName}</div>
                  </div>
                  <div className={`text-xl font-mono ${isRunning ? 'text-yellow-500' : 'text-slate-600'}`}>
                    {formatTime(f.remaining)}
                  </div>
                </div>
              ))}
              {activeFouls.length === 0 && (
                <div className="col-span-full text-center py-4 text-slate-600 text-sm italic">
                  No active 2 min fouls
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
              <History size={14}/> Match Log
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {matchLog.map(log => (
                <div key={log.id} className="text-[11px] flex items-center gap-2 border-b border-slate-800 pb-1">
                  <span className="text-slate-500 font-mono">{log.time}</span>
                  <span className={`font-bold ${
                    log.type === 'GOAL' ? 'text-emerald-500' : 
                    log.type === 'SUB' ? 'text-blue-400' : 
                    log.type === '2 MIN FOUL' ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}>
                    {log.type}
                  </span>
                  <span className="truncate flex-1">{log.player}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SUBSTITUTION MODAL */}
      <AnimatePresence>
        {submittingFor && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Substitution</h2>
                  <p className="text-sm text-slate-400">Select player to enter the court</p>
                </div>
                <button 
                  onClick={() => setSubmittingFor(null)} 
                  className="p-2 hover:bg-slate-800 rounded-full"
                >
                  <RotateCcw size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {(submittingFor.team === 'A' ? playersA : playersB)
                  .filter(p => !(submittingFor.team === 'A' ? onCourtA : onCourtB).includes(p.id))
                  .map(p => (
                    <button
                      key={p.id}
                      disabled={p.isRedCarded}
                      onClick={() => handleSubstitution(submittingFor.team, submittingFor.playerId, p.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        p.isRedCarded 
                          ? 'border-red-900 opacity-30 cursor-not-allowed' 
                          : 'border-slate-800 hover:border-blue-500 hover:bg-blue-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-slate-500">#{p.number}</span>
                        <span className="font-bold">{p.name}</span>
                      </div>
                      <UserPlus size={18} className="text-blue-400" />
                    </button>
                  ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveMatchTracker;

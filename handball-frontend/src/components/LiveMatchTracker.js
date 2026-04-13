import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Users, History, Ban, Timer, ArrowLeftRight, UserPlus, Lock, Save, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const generateRoster = (prefix, startId) => [
  { id: startId + 0, name: `${prefix} Player 1`, number: "1", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 1, name: `${prefix} Player 2`, number: "2", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 2, name: `${prefix} Player 3`, number: "3", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 3, name: `${prefix} Player 4`, number: "4", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 4, name: `${prefix} Player 5`, number: "5", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 5, name: `${prefix} Player 6`, number: "6", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 6, name: `${prefix} Player 7`, number: "7", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 7, name: `${prefix} Sub 1`, number: "10", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 8, name: `${prefix} Sub 2`, number: "11", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 9, name: `${prefix} Sub 3`, number: "12", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 10, name: `${prefix} Sub 4`, number: "13", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 11, name: `${prefix} Sub 5`, number: "14", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 12, name: `${prefix} Sub 6`, number: "15", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
  { id: startId + 13, name: `${prefix} Sub 7`, number: "16", goals: 0, yellowCards: 0, suspensions: 0, isRedCarded: false, isBlueCarded: false },
];

const LiveMatchTracker = ({ gameId, initialData }) => {
  const [isSetup, setIsSetup] = useState(!initialData?.time); // Show setup if no initial time
  const [matchDuration, setMatchDuration] = useState(60); // Default 60 minutes
  
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
  
  // Timeout state
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(null);
  const [activeTimeoutTeam, setActiveTimeoutTeam] = useState(null);
  const [timeoutsUsedA, setTimeoutsUsedA] = useState([]);
  const [timeoutsUsedB, setTimeoutsUsedB] = useState([]);
  
  // Use ref for counter to avoid stale closure issues
  const logCounterRef = React.useRef(0);
  
  const generateUniqueId = () => {
    logCounterRef.current += 1;
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${logCounterRef.current}`;
  };

  const scoreA = useMemo(() => playersA.reduce((sum, p) => sum + p.goals, 0), [playersA]);
  const scoreB = useMemo(() => playersB.reduce((sum, p) => sum + p.goals, 0), [playersB]);
  
  // Derived values for halftime/fulltime
  const halfTimeSeconds = (matchDuration * 60) / 2;
  const fullTimeSeconds = matchDuration * 60;
  const currentHalf = time < halfTimeSeconds ? 1 : 2;
  const isMatchOver = time >= fullTimeSeconds;
  const isHalftimeReached = time === halfTimeSeconds;

  // Timer Logic with auto-stop at halftime and fulltime
  useEffect(() => {
    let interval = null;
    if (isRunning && timeoutCountdown === null) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const nextTime = prevTime + 1;
          
          // Auto-stop at Halftime
          if (nextTime === halfTimeSeconds) {
            setIsRunning(false);
            setMatchLog(prev => [{
              id: generateUniqueId(),
              time: formatTime(nextTime),
              player: 'OFFICIAL',
              team: 'MATCH',
              type: 'HALFTIME'
            }, ...prev].slice(0, 10));
            return nextTime;
          }
          
          // Auto-stop at Full-time
          if (nextTime === fullTimeSeconds) {
            setIsRunning(false);
            setMatchLog(prev => [{
              id: generateUniqueId(),
              time: formatTime(nextTime),
              player: 'OFFICIAL',
              team: 'MATCH',
              type: 'FULL TIME'
            }, ...prev].slice(0, 10));
            return nextTime;
          }
          
          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeoutCountdown, halfTimeSeconds, fullTimeSeconds]);

  // Timeout Countdown Timer
  useEffect(() => {
    let interval = null;
    if (timeoutCountdown !== null && timeoutCountdown > 0) {
      interval = setInterval(() => {
        setTimeoutCountdown(c => {
          if (c <= 1) {
            setActiveTimeoutTeam(null);
            return null;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeoutCountdown]);

  // 2 Min Foul Countdown
  useEffect(() => {
    let interval = null;
    if (activeFouls.length > 0 && isRunning && timeoutCountdown === null) {
      interval = setInterval(() => {
        setActiveFouls(prev => prev.map(f => ({
          ...f,
          remaining: Math.max(0, f.remaining - 1)
        })).filter(f => f.remaining > 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeFouls, isRunning, timeoutCountdown]);

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
          assists: p.assists || 0,
          saves: p.saves || 0,
          suspensions: p.suspensions,
          yellowCard: p.yellowCards > 0,
          blueCard: p.isBlueCarded || false,
          redCard: p.isRedCarded
        })),
        playersB: playersB.map(p => ({
          playerId: p.id,
          goals: p.goals,
          assists: p.assists || 0,
          saves: p.saves || 0,
          suspensions: p.suspensions,
          yellowCard: p.yellowCards > 0,
          blueCard: p.isBlueCarded || false,
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
  
  const getHalfTimeouts = (usedArray) => {
    return usedArray.filter(t => currentHalf === 1 ? t < halfTimeSeconds : t >= halfTimeSeconds).length;
  };

  const getTotalHalfTimeouts = () => {
    return getHalfTimeouts(timeoutsUsedA) + getHalfTimeouts(timeoutsUsedB);
  };

  const getTotalMatchTimeouts = () => {
    return timeoutsUsedA.length + timeoutsUsedB.length;
  };

  const handleToggleTimer = () => {
    if (isMatchOver) return;
    if (isRunning) {
      setShowPauseModal(true);
    } else {
      setIsRunning(true);
      setTimeoutCountdown(null);
      setActiveTimeoutTeam(null);
    }
  };

  const confirmTimeout = (team) => {
    const used = team === 'A' ? timeoutsUsedA : timeoutsUsedB;
    const setUsed = team === 'A' ? setTimeoutsUsedA : setTimeoutsUsedB;
    const teamName = team === 'A' ? teamAName : teamBName;
    
    // Check limits
    if (getTotalMatchTimeouts() >= 3) return;
    if (used.length >= 2) return;
    if (getTotalHalfTimeouts() >= 2) return;
    
    setUsed([...used, time]);
    setIsRunning(false);
    setTimeoutCountdown(60); // 1 minute timeout
    setActiveTimeoutTeam(teamName);
    setShowPauseModal(false);
    
    setMatchLog(prev => [{
      id: generateUniqueId(),
      time: formatTime(time),
      player: 'COACH',
      team: teamName,
      type: 'TIMEOUT'
    }, ...prev].slice(0, 10));
    
    setTimeout(() => saveMatchState(), 100);
  };

  const technicalTimeout = () => {
    setIsRunning(false);
    setShowPauseModal(false);
    
    setMatchLog(prev => [{
      id: generateUniqueId(),
      time: formatTime(time),
      player: 'OFFICIAL',
      team: 'MATCH',
      type: 'TECHNICAL TIMEOUT'
    }, ...prev].slice(0, 10));
    
    setTimeout(() => saveMatchState(), 100);
  };

  const isPlayerSuspended = (playerId) => activeFouls.some(f => f.playerId === playerId);

  const handleGoal = (team, playerId, delta) => {
    if (!isRunning || timeoutCountdown !== null) return;
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

  const addYellowCard = (team, player) => {
    const update = (players) => players.map(p => {
      if (p.id === player.id) {
        setMatchLog(prev => [{
          id: generateUniqueId(),
          time: formatTime(time),
          player: p.name,
          team: team === 'A' ? teamAName : teamBName,
          type: 'YELLOW CARD'
        }, ...prev].slice(0, 10));

        return { ...p, yellowCards: p.yellowCards + 1 };
      }
      return p;
    });

    if (team === 'A') setPlayersA(update);
    else setPlayersB(update);
    
    setTimeout(() => saveMatchState(), 100);
  };

  const addRedCard = (team, player) => {
    if (player.isRedCarded) return;

    const update = (players) => players.map(p => {
      if (p.id === player.id) {
        setMatchLog(prev => [{
          id: generateUniqueId(),
          time: formatTime(time),
          player: p.name,
          team: team === 'A' ? teamAName : teamBName,
          type: 'RED CARD'
        }, ...prev].slice(0, 10));

        return { ...p, isRedCarded: true };
      }
      return p;
    });

    if (team === 'A') setPlayersA(update);
    else setPlayersB(update);

    // Add 2-minute suspension
    setActiveFouls(prev => [...prev, {
      id: Date.now(),
      playerId: player.id,
      team,
      playerName: player.name,
      playerNumber: player.number,
      remaining: 120,
    }]);
    
    setTimeout(() => saveMatchState(), 100);
  };

  const addBlueCard = (team, player) => {
    if (player.isRedCarded) return;

    const update = (players) => players.map(p => {
      if (p.id === player.id) {
        setMatchLog(prev => [{
          id: generateUniqueId(),
          time: formatTime(time),
          player: p.name,
          team: team === 'A' ? teamAName : teamBName,
          type: 'BLUE CARD'
        }, ...prev].slice(0, 10));

        return { ...p, isRedCarded: true, isBlueCarded: true };
      }
      return p;
    });

    if (team === 'A') setPlayersA(update);
    else setPlayersB(update);

    // Add 2-minute suspension
    setActiveFouls(prev => [...prev, {
      id: Date.now(),
      playerId: player.id,
      team,
      playerName: player.name,
      playerNumber: player.number,
      remaining: 120,
    }]);
    
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
    if (!player) return null; // Safety check
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
            <div className="flex gap-1 mt-0.5 items-center">
              {/* Yellow Cards - show actual count */}
              {player.yellowCards > 0 && (
                <div className="flex items-center gap-0.5">
                  {[...Array(player.yellowCards)].map((_, i) => (
                    <div key={i} className="w-2 h-3 bg-yellow-500 rounded-sm" />
                  ))}
                </div>
              )}
              {/* 2-Min Suspensions */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-2 h-1 rounded-full ${
                  i < player.suspensions ? 'bg-yellow-500' : 'bg-slate-800'
                }`} />
              ))}
              {/* Red Card */}
              {player.isRedCarded && <Ban size={10} className="text-red-500 ml-1" />}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOnCourt && !player.isRedCarded && (
            <>
              <button 
                onClick={() => addYellowCard(team, player)}
                className="w-6 h-6 flex items-center justify-center bg-yellow-500/20 border border-yellow-500/40 rounded hover:bg-yellow-500/30"
                title="Yellow Card (Warning)"
              >
                <div className="w-2 h-3 bg-yellow-500 rounded-sm"/>
              </button>
              <button 
                onClick={() => addTwoMinFoul(team, player)}
                className="px-1.5 py-0.5 text-[9px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded hover:bg-yellow-500 hover:text-black"
                title="2-Minute Suspension"
              >
                2'
              </button>
              <button 
                onClick={() => addRedCard(team, player)}
                className="w-6 h-6 flex items-center justify-center bg-red-600/20 border border-red-600/40 rounded hover:bg-red-600/30"
                title="Red Card + 2 Min"
              >
                <div className="w-2 h-3 bg-red-600 rounded-sm"/>
              </button>
              <button 
                onClick={() => addBlueCard(team, player)}
                className="w-6 h-6 flex items-center justify-center bg-blue-600/20 border border-blue-600/40 rounded hover:bg-blue-600/30"
                title="Blue Card + Disqualification"
              >
                <div className="w-2 h-3 bg-blue-600 rounded-sm"/>
              </button>
            </>
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
      {/* SETUP SCREEN */}
      {isSetup && (
        <div className="max-w-2xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl"
          >
            <h1 className="text-3xl font-bold mb-8 text-center">Match Setup</h1>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 uppercase mb-2">
                  Match Duration (Minutes)
                </label>
                <select
                  value={matchDuration}
                  onChange={(e) => setMatchDuration(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={40}>40 Minutes (20 min halves)</option>
                  <option value={50}>50 Minutes (25 min halves)</option>
                  <option value={60}>60 Minutes (30 min halves)</option>
                  <option value={70}>70 Minutes (35 min halves)</option>
                  <option value={80}>80 Minutes (40 min halves)</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  Halftime will automatically trigger at {matchDuration/2} minutes
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase mb-2">
                    Home Team
                  </label>
                  <input
                    value={teamAName}
                    onChange={(e) => setTeamAName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-blue-400 font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 uppercase mb-2">
                    Away Team
                  </label>
                  <input
                    value={teamBName}
                    onChange={(e) => setTeamBName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-red-400 font-bold outline-none"
                  />
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-sm text-blue-300">
                  <strong>Rules:</strong> Max 3 timeouts per match, 2 per half (combined), 1 minute each. 
                  Clock auto-stops at halftime and full-time.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsSetup(false);
                  setMatchLog(prev => [{
                    id: generateUniqueId(),
                    time: '00:00',
                    player: 'OFFICIAL',
                    team: 'MATCH',
                    type: 'KICKOFF'
                  }, ...prev]);
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all"
              >
                Start Match
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MAIN MATCH INTERFACE */}
      {!isSetup && (
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
          {/* TIMEOUT OVERLAY */}
          {timeoutCountdown !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-600/95 backdrop-blur-md z-50 flex flex-col items-center justify-center"
            >
              <div className="text-sm font-bold uppercase tracking-widest mb-2">
                {activeTimeoutTeam} Time-Out
              </div>
              <div className="text-9xl font-mono font-black">{timeoutCountdown}</div>
              <button
                onClick={() => {
                  setTimeoutCountdown(null);
                  setActiveTimeoutTeam(null);
                  setIsRunning(true);
                }}
                className="mt-8 px-6 py-2 bg-white/10 rounded-full text-xs hover:bg-white/20 transition-colors"
              >
                Resume Match
              </button>
            </motion.div>
          )}

          {!isRunning && time > 0 && timeoutCountdown === null && (
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
            <div className="flex justify-center gap-2 mt-2">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-3 rounded-full border border-blue-500/30 ${
                    i < timeoutsUsedA.length ? 'bg-slate-800 shadow-inner' : 'bg-blue-500 shadow-lg shadow-blue-500/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-slate-800 pt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">
                Half {currentHalf}
              </span>
              {isHalftimeReached && (
                <span className="bg-yellow-500 text-slate-950 text-[10px] px-2 py-0.5 rounded font-black">
                  HALFTIME
                </span>
              )}
              {isMatchOver && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-black">
                  FULL TIME
                </span>
              )}
            </div>

            <div className={`text-5xl font-mono font-bold tabular-nums mb-4 transition-colors ${
              isRunning && timeoutCountdown === null ? 'text-white' :
              (isMatchOver || isHalftimeReached) ? 'text-red-500' :
              'text-yellow-500'
            }`}>
              {formatTime(time)}
            </div>
            <div className="flex gap-2">
              <button 
                disabled={isMatchOver}
                onClick={handleToggleTimer}
                className={`p-3 rounded-full ${
                  isMatchOver ? 'bg-slate-800 cursor-not-allowed' :
                  isRunning && timeoutCountdown === null ? 'bg-red-500' : 'bg-emerald-500'
                } text-slate-950 shadow-lg`}
              >
                {isRunning && timeoutCountdown === null ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              <button 
                onClick={() => {
                  if(confirm("Reset match?")) {
                    setTime(0);
                    setIsRunning(false);
                    setActiveFouls([]);
                    setMatchLog([]);
                    const newPlayersA = generateRoster("A", 100);
                    const newPlayersB = generateRoster("B", 200);
                    setPlayersA(newPlayersA);
                    setPlayersB(newPlayersB);
                    setOnCourtA(newPlayersA.slice(0, 7).map(p => p.id));
                    setOnCourtB(newPlayersB.slice(0, 7).map(p => p.id));
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
            <div className="flex justify-center gap-2 mt-2">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-3 rounded-full border border-red-500/30 ${
                    i < timeoutsUsedB.length ? 'bg-slate-800 shadow-inner' : 'bg-red-500 shadow-lg shadow-red-500/20'
                  }`}
                />
              ))}
            </div>
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
                    log.type === 'YELLOW CARD' ? 'text-yellow-500' :
                    log.type === '2 MIN FOUL' ? 'text-yellow-500' : 
                    log.type === 'BLUE CARD' ? 'text-blue-500' :
                    log.type === 'TIMEOUT' ? 'text-blue-400' :
                    log.type === 'TECHNICAL TIMEOUT' ? 'text-slate-400' :
                    log.type === 'HALFTIME' || log.type === 'FULL TIME' || log.type === 'KICKOFF' ? 'text-white' :
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

        {/* PAUSE / TIMEOUT MODAL */}
        <AnimatePresence>
        {showPauseModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Match Stoppage</h2>
                <button
                  onClick={() => setShowPauseModal(false)}
                  className="text-slate-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    disabled={
                      timeoutsUsedA.length >= 2 ||
                      getTotalHalfTimeouts() >= 2 ||
                      getTotalMatchTimeouts() >= 3
                    }
                    onClick={() => confirmTimeout('A')}
                    className="flex flex-col gap-2 p-6 rounded-2xl border border-slate-800 hover:border-blue-500 disabled:opacity-20 transition-all text-left bg-slate-950/50"
                  >
                    <span className="text-blue-400 font-bold text-sm uppercase">
                      T.O. {teamAName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Left: {2 - timeoutsUsedA.length} Team / {2 - getTotalHalfTimeouts()} Half
                    </span>
                  </button>

                  <button
                    disabled={
                      timeoutsUsedB.length >= 2 ||
                      getTotalHalfTimeouts() >= 2 ||
                      getTotalMatchTimeouts() >= 3
                    }
                    onClick={() => confirmTimeout('B')}
                    className="flex flex-col gap-2 p-6 rounded-2xl border border-slate-800 hover:border-red-500 disabled:opacity-20 transition-all text-left bg-slate-950/50"
                  >
                    <span className="text-red-400 font-bold text-sm uppercase">
                      T.O. {teamBName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Left: {2 - timeoutsUsedB.length} Team / {2 - getTotalHalfTimeouts()} Half
                    </span>
                  </button>
                </div>

                {getTotalHalfTimeouts() >= 2 && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-[10px] flex items-center gap-2">
                    <Timer size={14} />
                    Maximum combined timeouts (2) for Half {currentHalf} reached.
                  </div>
                )}

                {getTotalMatchTimeouts() >= 3 && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] flex items-center gap-2">
                    <Timer size={14} />
                    Maximum match timeouts (3) reached.
                  </div>
                )}

                <button
                  onClick={technicalTimeout}
                  className="w-full p-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold transition-all"
                >
                  Technical Time-Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
      )}
    </div>
  );
};

export default LiveMatchTracker;

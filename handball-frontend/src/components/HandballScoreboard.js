import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Users, History, Timer, ArrowLeftRight, UserPlus, Settings, CheckCircle2, ShieldAlert, Trophy, AlertTriangle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HandballScoreboard = () => {
  // --- SETUP STATE ---
  const [isSetup, setIsSetup] = useState(true);
  const [matchLength, setMatchLength] = useState(60); // Total match minutes
  const [teamAName, setTeamAName] = useState("Team North");
  const [teamBName, setTeamBName] = useState("Team South");
  
  // Default 14 players (7 starters + 7 subs)
  const defaultRoster = Array.from({ length: 14 }, (_, i) => `${i + 1}:Player ${i + 1}`).join(', ');
  const [rosterInputA, setRosterInputA] = useState(defaultRoster);
  const [rosterInputB, setRosterInputB] = useState(defaultRoster);

  // --- MATCH STATE ---
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(null);
  const [activeTimeoutTeam, setActiveTimeoutTeam] = useState(null);
  
  const [playersA, setPlayersA] = useState([]);
  const [playersB, setPlayersB] = useState([]);
  const [onCourtA, setOnCourtA] = useState([]);
  const [onCourtB, setOnCourtB] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [matchLog, setMatchLog] = useState([]);
  const [submittingFor, setSubmittingFor] = useState(null);

  // Time-out tracking
  const [timeoutsUsedA, setTimeoutsUsedA] = useState([]); 
  const [timeoutsUsedB, setTimeoutsUsedB] = useState([]);

  // --- DERIVED VALUES ---
  const halfTimeSeconds = (matchLength * 60) / 2;
  const fullTimeSeconds = matchLength * 60;
  const currentHalf = time < halfTimeSeconds ? 1 : 2;
  const isMatchOver = time >= fullTimeSeconds;
  const isHalftimeReached = time === halfTimeSeconds;
  
  const scoreA = useMemo(() => playersA.reduce((sum, p) => sum + p.goals, 0), [playersA]);
  const scoreB = useMemo(() => playersB.reduce((sum, p) => sum + p.goals, 0), [playersB]);

  // --- LOGIC ---
  const parseRoster = (input, prefix) => {
    return input.split(',').map((item, idx) => {
      const [num, name] = item.split(':');
      return {
        id: `${prefix}-${idx}`,
        name: name?.trim() || `Player ${idx + 1}`,
        number: num?.trim() || (idx + 1).toString(),
        goals: 0,
        yellowCards: 0,
        suspensions: 0,
        isRedCarded: false,
        isBlueCarded: false
      };
    });
  };

  const startMatch = () => {
    const pA = parseRoster(rosterInputA, 'A');
    const pB = parseRoster(rosterInputB, 'B');
    setPlayersA(pA);
    setPlayersB(pB);
    setOnCourtA(pA.slice(0, 7).map(p => p.id));
    setOnCourtB(pB.slice(0, 7).map(p => p.id));
    setIsSetup(false);
    addLog("KICKOFF", "MATCH", "OFFICIAL", "Match started");
  };

  // Main Match Timer & Auto-Stop Logic
  useEffect(() => {
    let interval = null;
    if (isRunning && timeoutCountdown === null) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const nextTime = prevTime + 1;
          
          // Auto-stop at Halftime
          if (nextTime === halfTimeSeconds) {
            setIsRunning(false);
            addLog("HALFTIME", "MATCH", "OFFICIAL", "Clock stopped at halftime");
            return nextTime;
          }
          
          // Auto-stop at Full-time
          if (nextTime === fullTimeSeconds) {
            setIsRunning(false);
            addLog("FULL TIME", "MATCH", "OFFICIAL", `Final Score: ${scoreA}-${scoreB}`);
            return nextTime;
          }
          
          return nextTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeoutCountdown, halfTimeSeconds, fullTimeSeconds, scoreA, scoreB]);

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

  // Penalty Countdown Timer
  useEffect(() => {
    let interval = null;
    if (penalties.length > 0 && isRunning && timeoutCountdown === null) {
      interval = setInterval(() => {
        setPenalties(prev => {
          const updated = prev.map(p => ({
            ...p,
            remaining: Math.max(0, p.remaining - 1)
          }));
          
          // Log when penalty expires
          updated.forEach((p, idx) => {
            if (p.remaining === 0 && prev[idx].remaining > 0) {
              addLog("PENALTY END", p.team === 'A' ? teamAName : teamBName, p.playerName, "2-minute suspension completed");
            }
          });
          
          return updated.filter(p => p.remaining > 0);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [penalties, isRunning, timeoutCountdown, teamAName, teamBName]);

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

  const addLog = (type, team, player, detail = "") => {
    setMatchLog(prev => [{
      id: `${Date.now()}-${Math.random()}-${prev.length}`,
      time: formatTime(time),
      type,
      team,
      player,
      detail
    }, ...prev].slice(0, 100));
  };

  const confirmTimeout = (team) => {
    const used = team === 'A' ? timeoutsUsedA : timeoutsUsedB;
    const setUsed = team === 'A' ? setTimeoutsUsedA : setTimeoutsUsedB;
    const teamName = team === 'A' ? teamAName : teamBName;
    
    // Check limits
    if (getTotalMatchTimeouts() >= 3) return; // Max 3 timeouts per match
    if (used.length >= 2) return; // Max 2 timeouts per team
    if (getTotalHalfTimeouts() >= 2) return; // Max 2 timeouts per half (combined)
    
    setUsed([...used, time]);
    setIsRunning(false);
    setTimeoutCountdown(60); // 1 minute timeout
    setActiveTimeoutTeam(teamName);
    setShowPauseModal(false);
    addLog("TIMEOUT", teamName, "COACH", `Team timeout called (1 minute)`);
  };

  const handleGoal = (team, player, delta) => {
    // Cannot score when time is paused
    if (!isRunning || timeoutCountdown !== null || delta === 0) return;
    
    // Check if player is suspended or carded
    const isSuspended = penalties.some(p => p.playerId === player.id);
    if (isSuspended || player.isRedCarded || player.isBlueCarded) return;
    
    const update = (players) => players.map(p => {
      if (p.id === player.id) return { ...p, goals: Math.max(0, p.goals + delta) };
      return p;
    });
    
    if (team === 'A') {
      setPlayersA(prev => {
        const updated = update(prev);
        // Only log if delta is positive (scoring, not removing)
        if (delta > 0) {
          const newScoreA = updated.reduce((sum, p) => sum + p.goals, 0);
          const newScoreB = scoreB;
          addLog("GOAL", teamAName, `#${player.number} ${player.name}`, `Score: ${newScoreA} - ${newScoreB}`);
        }
        return updated;
      });
    } else {
      setPlayersB(prev => {
        const updated = update(prev);
        // Only log if delta is positive (scoring, not removing)
        if (delta > 0) {
          const newScoreA = scoreA;
          const newScoreB = updated.reduce((sum, p) => sum + p.goals, 0);
          addLog("GOAL", teamBName, `#${player.number} ${player.name}`, `Score: ${newScoreA} - ${newScoreB}`);
        }
        return updated;
      });
    }
  };

  const handlePenalty = (team, player, type) => {
    const teamName = team === 'A' ? teamAName : teamBName;
    
    const update = (players) => players.map(p => {
      if (p.id === player.id) {
        if (type === 'YELLOW') {
          return { ...p, yellowCards: p.yellowCards + 1 };
        }
        if (type === '2MIN') {
          const newSusp = p.suspensions + 1;
          // 3rd suspension = automatic red card
          return { ...p, suspensions: newSusp, isRedCarded: newSusp >= 3 };
        }
        if (type === 'RED') {
          return { ...p, isRedCarded: true };
        }
        if (type === 'BLUE') {
          return { ...p, isRedCarded: true, isBlueCarded: true };
        }
      }
      return p;
    });
    
    if (team === 'A') setPlayersA(update);
    else setPlayersB(update);
    
    // Add 2-minute suspension for RED and BLUE cards
    if (type === '2MIN' || type === 'RED' || type === 'BLUE') {
      setPenalties(prev => [...prev, {
        id: Date.now(),
        playerId: player.id,
        team,
        playerName: player.name,
        playerNumber: player.number,
        remaining: 120, // 2 minutes
        type
      }]);
      
      if (type === '2MIN') {
        addLog("2MIN FOUL", teamName, `#${player.number} ${player.name}`, "2-minute suspension");
      } else if (type === 'RED') {
        addLog("RED CARD", teamName, `#${player.number} ${player.name}`, "Red card + 2-minute suspension");
      } else if (type === 'BLUE') {
        addLog("BLUE CARD", teamName, `#${player.number} ${player.name}`, "Blue card + 2-minute suspension + disqualification");
      }
    } else if (type === 'YELLOW') {
      addLog("YELLOW CARD", teamName, `#${player.number} ${player.name}`, "Warning");
    }
  };

  if (isSetup) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 flex items-start justify-center pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-2xl bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-blue-500 flex-shrink-0" size={28} />
            <h1 className="text-xl sm:text-3xl font-bold">Handball Match Setup</h1>
          </div>

          <div className="space-y-5">
            {/* Duration row — stacks on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Match Duration (Minutes)
                </label>
                <input 
                  type="number"
                  inputMode="numeric"
                  value={matchLength} 
                  onChange={e => setMatchLength(Number(e.target.value))} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                />
              </div>
              <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 flex items-center">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Auto-Stop Logic
                  </label>
                  <div className="text-xs text-slate-400 leading-tight">
                    Stops at {matchLength/2}:00 (Halftime) and {matchLength}:00 (Full-time).
                  </div>
                </div>
              </div>
            </div>

            {/* Team rosters — stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Team A', value: teamAName, onChange: setTeamAName, roster: rosterInputA, setRoster: setRosterInputA, color: 'text-blue-400', ring: 'focus:ring-blue-500' },
                { label: 'Team B', value: teamBName, onChange: setTeamBName, roster: rosterInputB, setRoster: setRosterInputB, color: 'text-red-400', ring: 'focus:ring-red-500' },
              ].map(t => (
                <div key={t.label} className="space-y-3">
                  <input 
                    placeholder={`${t.label} Name`}
                    value={t.value} 
                    onChange={e => t.onChange(e.target.value)} 
                    className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-base ${t.color} font-bold outline-none ${t.ring} focus:ring-2 touch-manipulation`}
                  />
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">
                      Players (Number:Name, comma separated)
                    </label>
                    <textarea 
                      value={t.roster} 
                      onChange={e => t.setRoster(e.target.value)} 
                      rows={6}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-blue-300">
                14 players per team (7 starters + 7 subs). Max 3 timeouts per match, 2 per half, 1 min each.
              </p>
            </div>

            <button 
              onClick={startMatch} 
              className="w-full bg-blue-600 active:bg-blue-500 text-white font-bold py-4 rounded-2xl text-base transition-all flex items-center justify-center gap-2 touch-manipulation"
            >
              <CheckCircle2 size={20} /> Start Match
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP SCOREBOARD — always 3-col but scales font with clamp */}
        <div className="scoreboard-grid bg-slate-900 px-3 py-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">

          {/* TIMEOUT OVERLAY */}
          {timeoutCountdown !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-600/95 backdrop-blur-md z-50 flex flex-col items-center justify-center"
            >
              <div className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">
                {activeTimeoutTeam} Time-Out
              </div>
              <div className="clock-display font-mono font-black" style={{ fontSize: 'clamp(4rem,20vw,7rem)' }}>
                {timeoutCountdown}
              </div>
              <button
                onClick={() => { setTimeoutCountdown(null); setActiveTimeoutTeam(null); setIsRunning(true); }}
                className="mt-6 px-6 py-2 bg-white/10 rounded-full text-xs active:bg-white/20 touch-manipulation"
              >
                Resume Match
              </button>
            </motion.div>
          )}

          {/* TEAM A */}
          <div className="text-center flex flex-col items-center justify-center">
            <div className="text-blue-400 font-bold uppercase text-[10px] sm:text-sm tracking-widest mb-1 truncate max-w-full px-1">
              {teamAName}
            </div>
            <div className="score-display font-black tabular-nums leading-none mb-2" style={{ fontSize: 'clamp(3rem,18vw,6rem)' }}>
              {scoreA}
            </div>
            <div className="flex justify-center gap-1.5">
              {[...Array(2)].map((_, i) => (
                <div key={i} className={`w-5 h-2 sm:w-8 sm:h-3 rounded-full border border-blue-500/30 ${i < timeoutsUsedA.length ? 'bg-slate-800' : 'bg-blue-500'}`} />
              ))}
            </div>
          </div>

          {/* CLOCK */}
          <div className="flex flex-col items-center justify-center border-x border-slate-800/50 px-1">
            <div className="flex flex-wrap items-center justify-center gap-1 mb-1">
              <span className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase">H{currentHalf}</span>
              {isHalftimeReached && <span className="bg-yellow-500 text-slate-950 text-[8px] px-1.5 py-0.5 rounded font-black">HT</span>}
              {isMatchOver && <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black">FT</span>}
            </div>

            <div className={`clock-display font-mono font-bold tabular-nums mb-3 ${
              isRunning && timeoutCountdown === null ? 'text-white' :
              (isMatchOver || isHalftimeReached) ? 'text-red-500' : 'text-yellow-500'
            }`} style={{ fontSize: 'clamp(1.4rem,8vw,3.5rem)' }}>
              {formatTime(time)}
            </div>

            <button
              disabled={isMatchOver}
              onClick={handleToggleTimer}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all touch-manipulation ${
                isMatchOver ? 'bg-slate-800 cursor-not-allowed' :
                isRunning && timeoutCountdown === null ? 'bg-red-500 active:bg-red-600' : 'bg-emerald-500 active:bg-emerald-600'
              } text-slate-950 shadow-xl`}
            >
              {isRunning && timeoutCountdown === null
                ? <Pause size={22} fill="currentColor" />
                : <Play size={22} fill="currentColor" className="ml-0.5" />}
            </button>

            <div className="mt-2 text-[9px] text-slate-500 text-center">
              {getTotalMatchTimeouts()}/3 T.O.
            </div>
          </div>

          {/* TEAM B */}
          <div className="text-center flex flex-col items-center justify-center">
            <div className="text-red-400 font-bold uppercase text-[10px] sm:text-sm tracking-widest mb-1 truncate max-w-full px-1">
              {teamBName}
            </div>
            <div className="score-display font-black tabular-nums leading-none mb-2" style={{ fontSize: 'clamp(3rem,18vw,6rem)' }}>
              {scoreB}
            </div>
            <div className="flex justify-center gap-1.5">
              {[...Array(2)].map((_, i) => (
                <div key={i} className={`w-5 h-2 sm:w-8 sm:h-3 rounded-full border border-red-500/30 ${i < timeoutsUsedB.length ? 'bg-slate-800' : 'bg-red-500'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* ACTIVE PLAYERS — single col on mobile, 2-col on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { team: 'A', name: teamAName, players: playersA, onCourt: onCourtA, color: 'text-blue-400', border: 'border-blue-500/20' },
            { team: 'B', name: teamBName, players: playersB, onCourt: onCourtB, color: 'text-red-400', border: 'border-red-500/20' }
          ].map(t => (
            <div key={t.team} className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <h3 className={`${t.color} font-bold flex items-center gap-1.5 text-sm`}>
                  <Users size={15}/> {t.name}
                </h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase">On Court</span>
              </div>

              <div className="grid gap-1.5">
                {t.players.filter(p => t.onCourt.includes(p.id)).map(player => {
                  const isSuspended = penalties.some(pen => pen.playerId === player.id);
                  const isOut = isSuspended || player.isRedCarded || player.isBlueCarded;

                  return (
                    <div
                      key={player.id}
                      className={`bg-slate-900 px-2 py-2 rounded-xl border transition-all ${
                        isOut ? 'border-red-600/50 bg-red-950/10' : 'border-slate-800'
                      }`}
                    >
                      {/* Top row: number + name + status */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-slate-500 font-mono font-bold text-xs w-5 flex-shrink-0">
                            #{player.number}
                          </span>
                          <div className="min-w-0">
                            <span className={`font-semibold text-sm truncate block ${isOut ? 'line-through opacity-50' : ''}`}>
                              {player.name}
                            </span>
                            {isOut && (
                              <span className="text-[9px] text-red-500 font-bold flex items-center gap-0.5">
                                <ShieldAlert size={9}/>
                                {player.isBlueCarded ? 'BLUE' : player.isRedCarded ? 'RED' : 'SUSP'}
                              </span>
                            )}
                            {player.yellowCards > 0 && !isOut && (
                              <span className="text-[9px] text-yellow-500 font-bold">
                                {player.yellowCards}× YC
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Goal counter — always visible, right-aligned */}
                        <div className={`flex items-center bg-slate-950 rounded-lg px-1 gap-1 border flex-shrink-0 ${t.border}`}>
                          <button
                            onClick={() => handleGoal(t.team, player, -1)}
                            disabled={!isRunning || timeoutCountdown !== null || isOut}
                            className="w-7 h-7 flex items-center justify-center text-slate-500 active:text-white disabled:opacity-20 touch-manipulation"
                          >–</button>
                          <span className={`font-black text-base w-5 text-center ${t.color}`}>{player.goals}</span>
                          <button
                            onClick={() => handleGoal(t.team, player, 1)}
                            disabled={!isRunning || timeoutCountdown !== null || isOut}
                            className="w-7 h-7 flex items-center justify-center text-emerald-500 active:text-emerald-400 disabled:opacity-20 touch-manipulation"
                          >+</button>
                        </div>
                      </div>

                      {/* Bottom row: discipline buttons + sub — wraps naturally */}
                      <div className="flex items-center gap-1 flex-wrap">
                        <button onClick={() => handlePenalty(t.team, player, 'YELLOW')}
                          className="w-8 h-8 flex items-center justify-center bg-yellow-500/20 border border-yellow-500/40 rounded-lg active:bg-yellow-500/40 touch-manipulation" title="Yellow Card">
                          <div className="w-2.5 h-3.5 bg-yellow-500 rounded-sm"/>
                        </button>
                        <button onClick={() => handlePenalty(t.team, player, '2MIN')}
                          className="w-8 h-8 flex items-center justify-center text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg active:bg-yellow-500/20 touch-manipulation" title="2-Min Suspension">
                          2'
                        </button>
                        <button onClick={() => handlePenalty(t.team, player, 'RED')}
                          className="w-8 h-8 flex items-center justify-center bg-red-600/20 border border-red-600/40 rounded-lg active:bg-red-600/40 touch-manipulation" title="Red Card">
                          <div className="w-2.5 h-3.5 bg-red-600 rounded-sm"/>
                        </button>
                        <button onClick={() => handlePenalty(t.team, player, 'BLUE')}
                          className="w-8 h-8 flex items-center justify-center bg-blue-600/20 border border-blue-600/40 rounded-lg active:bg-blue-600/40 touch-manipulation" title="Blue Card">
                          <div className="w-2.5 h-3.5 bg-blue-600 rounded-sm"/>
                        </button>
                        <button onClick={() => setSubmittingFor({ team: t.team, playerId: player.id })}
                          className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg active:bg-slate-700 text-slate-400 touch-manipulation" title="Substitute">
                          <ArrowLeftRight size={14}/>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* LOGS & PENALTIES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
          
          {/* ACTIVE PENALTIES */}
          <div className="md:col-span-1 bg-slate-900/50 rounded-3xl p-6 border border-slate-800">
            <h4 className="text-xs font-bold text-yellow-500 uppercase mb-4 flex items-center gap-2">
              <Timer size={16}/> Active 2-Min Fouls
            </h4>
            <div className="space-y-3">
              {penalties.length === 0 && (
                <div className="text-slate-600 text-xs italic">No active suspensions</div>
              )}
              {penalties.map(p => (
                <div 
                  key={p.id} 
                  className="bg-slate-950 p-4 rounded-2xl border-l-4 border-yellow-500 flex justify-between items-center shadow-lg"
                >
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">
                      {p.team === 'A' ? teamAName : teamBName}
                    </div>
                    <div className="font-bold">#{p.playerNumber} {p.playerName}</div>
                    <div className="text-[10px] text-slate-500">
                      {p.type === 'BLUE' ? 'Blue Card' : p.type === 'RED' ? 'Red Card' : '2-Min Foul'}
                    </div>
                  </div>
                  <div className="text-2xl font-mono font-bold text-yellow-500">
                    {formatTime(p.remaining)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MATCH LOG */}
          <div className="md:col-span-2 bg-slate-900/50 rounded-3xl p-6 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
              <History size={16}/> Match Log (Goals & Fouls)
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {matchLog.length === 0 && (
                <div className="text-slate-600 text-xs italic">Waiting for match actions...</div>
              )}
              {matchLog.map(log => (
                <div 
                  key={log.id} 
                  className="flex items-center gap-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50"
                >
                  <span className="text-[10px] font-mono text-slate-500 w-10">
                    {log.time}
                  </span>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {log.type === 'GOAL' && <Trophy size={14} className="text-emerald-500" />}
                      {log.type === '2MIN FOUL' && <AlertTriangle size={14} className="text-yellow-500" />}
                      {log.type === 'YELLOW CARD' && <div className="w-3 h-4 bg-yellow-500 rounded-sm"/>}
                      {(log.type === 'RED CARD' || log.type === 'BLUE CARD') && <ShieldAlert size={14} className="text-red-500" />}
                      {(log.type === 'HALFTIME' || log.type === 'FULL TIME' || log.type === 'KICKOFF') && <Clock size={14} className="text-white" />}
                      {log.type === 'TIMEOUT' && <Clock size={14} className="text-blue-500" />}
                      {log.type === 'PENALTY END' && <CheckCircle2 size={14} className="text-green-500" />}
                      
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        log.type === 'GOAL' ? 'bg-emerald-500/10 text-emerald-500' : 
                        log.type === 'TIMEOUT' ? 'bg-blue-500/10 text-blue-500' : 
                        log.type === 'YELLOW CARD' ? 'bg-yellow-500/10 text-yellow-500' :
                        (log.type === 'HALFTIME' || log.type === 'FULL TIME' || log.type === 'KICKOFF') ? 'bg-white/10 text-white' : 
                        log.type === 'PENALTY END' ? 'bg-green-500/10 text-green-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-xs font-medium">{log.team}: {log.player}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 italic">{log.detail}</span>
                  </div>
                </div>
              ))}
            </div>
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
              className="bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Match Stoppage</h2>
                <button onClick={() => setShowPauseModal(false)} className="text-slate-500 active:text-white text-xl touch-manipulation">✕</button>
              </div>

              <div className="space-y-3">
                {/* Timeout buttons — stack on xs, side-by-side on sm+ */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
                  {[
                    { team: 'A', name: teamAName, used: timeoutsUsedA, color: 'text-blue-400', hover: 'hover:border-blue-500' },
                    { team: 'B', name: teamBName, used: timeoutsUsedB, color: 'text-red-400', hover: 'hover:border-red-500' },
                  ].map(t => (
                    <button
                      key={t.team}
                      disabled={t.used.length >= 2 || getTotalHalfTimeouts() >= 2 || getTotalMatchTimeouts() >= 3}
                      onClick={() => confirmTimeout(t.team)}
                      className={`flex flex-col gap-1 p-4 rounded-2xl border border-slate-800 ${t.hover} disabled:opacity-20 transition-all text-left bg-slate-950/50 touch-manipulation`}
                    >
                      <span className={`${t.color} font-bold text-sm uppercase`}>T.O. {t.name}</span>
                      <span className="text-[10px] text-slate-500">
                        Left: {2 - t.used.length} team · {2 - getTotalHalfTimeouts()} half
                      </span>
                    </button>
                  ))}
                </div>

                {getTotalHalfTimeouts() >= 2 && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-xs flex items-center gap-2">
                    <AlertTriangle size={14}/> Max timeouts for Half {currentHalf} reached.
                  </div>
                )}
                {getTotalMatchTimeouts() >= 3 && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex items-center gap-2">
                    <AlertTriangle size={14}/> Maximum match timeouts (3) reached.
                  </div>
                )}

                <button
                  onClick={() => { setIsRunning(false); setShowPauseModal(false); addLog("TECHNICAL TIMEOUT", "OFFICIAL", "MATCH", "Technical stoppage"); }}
                  className="w-full p-4 rounded-xl bg-slate-800 active:bg-slate-700 font-bold transition-all touch-manipulation"
                >
                  Technical Time-Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUB MODAL */}
      <AnimatePresence>
        {submittingFor && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ArrowLeftRight className="text-blue-500"/> Substitution
              </h2>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {(submittingFor.team === 'A' ? playersA : playersB)
                  .filter(p => !(submittingFor.team === 'A' ? onCourtA : onCourtB).includes(p.id))
                  .map(p => (
                    <button
                      key={p.id}
                      disabled={p.isRedCarded || p.isBlueCarded}
                      onClick={() => {
                        const team = submittingFor.team;
                        const outId = submittingFor.playerId;
                        const outPlayer = (team === 'A' ? playersA : playersB).find(pl => pl.id === outId);
                        
                        if (team === 'A') {
                          setOnCourtA(prev => prev.map(id => id === outId ? p.id : id));
                        } else {
                          setOnCourtB(prev => prev.map(id => id === outId ? p.id : id));
                        }
                        
                        addLog("SUB", team === 'A' ? teamAName : teamBName, `#${p.number} ${p.name}`, `IN for #${outPlayer?.number} ${outPlayer?.name}`);
                        setSubmittingFor(null);
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-800 hover:border-blue-500 bg-slate-950/50 disabled:opacity-30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono font-bold">#{p.number}</span>
                        <div className="text-left">
                          <span className="font-semibold block">{p.name}</span>
                          {(p.isRedCarded || p.isBlueCarded) && (
                            <span className="text-[10px] text-red-500">Cannot substitute</span>
                          )}
                        </div>
                      </div>
                      <UserPlus size={18} className="text-blue-500" />
                    </button>
                  ))}
              </div>

              <button 
                onClick={() => setSubmittingFor(null)} 
                className="w-full mt-6 py-3 text-slate-500 font-bold hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default HandballScoreboard;

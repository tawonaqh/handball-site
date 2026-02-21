import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Timer, History, Ban, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const LiveMatchViewer = ({ gameId }) => {
  const [matchData, setMatchData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchData();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      fetchMatchData();
    }, 2000);

    return () => clearInterval(interval);
  }, [gameId]);

  const fetchMatchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/games/${gameId}/live`);
      if (response.ok) {
        const data = await response.json();
        setMatchData(data);
        setIsConnected(true);
        setLastUpdate(new Date());
        setLoading(false);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Failed to fetch match data:', error);
      setIsConnected(false);
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading live match...</p>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <WifiOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-400">Unable to load match data</p>
          <button 
            onClick={fetchMatchData}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const PlayerRow = ({ player, team }) => {
    const suspended = matchData.activeFouls?.some(f => f.playerId === player.id);
    
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
          {suspended && (
            <div className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded">
              2 MIN
            </div>
          )}
          <div className={`px-3 py-1 rounded font-bold ${
            team === 'A' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {player.goals}
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
                <span className="text-xs text-emerald-500">Live</span>
              </>
            ) : (
              <>
                <WifiOff size={16} className="text-red-500" />
                <span className="text-xs text-red-500">Connection Lost</span>
              </>
            )}
            {lastUpdate && (
              <span className="text-xs text-slate-500 ml-2">
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
          <button
            onClick={fetchMatchData}
            className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>

        {/* LIVE INDICATOR */}
        {matchData.isRunning && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-red-500/20 border border-red-500 rounded-lg px-4 py-2 text-center"
          >
            <span className="text-red-500 font-bold uppercase tracking-wider">🔴 LIVE MATCH IN PROGRESS</span>
          </motion.div>
        )}

        {/* HEADER SCOREBOARD */}
        <div className="grid grid-cols-3 gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400 mb-2">{matchData.teamAName}</div>
            <div className="text-7xl font-black tabular-nums">{matchData.scoreA}</div>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-slate-800">
            <div className={`text-5xl font-mono font-bold tabular-nums mb-2 transition-colors ${
              matchData.isRunning ? 'text-white' : 'text-slate-500'
            }`}>
              {formatTime(matchData.time)}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">
              {matchData.isRunning ? 'In Progress' : 'Paused'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xl font-bold text-red-400 mb-2">{matchData.teamBName}</div>
            <div className="text-7xl font-black tabular-nums">{matchData.scoreB}</div>
          </div>
        </div>

        {/* COURT VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team A Court */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-blue-400 font-bold flex items-center gap-2">
                <Users size={18}/> ON COURT
              </h3>
              <span className="text-xs text-slate-500 uppercase tracking-widest">{matchData.teamAName}</span>
            </div>
            <div className="grid gap-2">
              {matchData.onCourtA?.map(id => {
                const player = matchData.playersA?.find(p => p.id === id);
                return player ? <PlayerRow key={id} player={player} team="A" /> : null;
              })}
            </div>
          </div>

          {/* Team B Court */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-red-400 font-bold flex items-center gap-2">
                <Users size={18}/> ON COURT
              </h3>
              <span className="text-xs text-slate-500 uppercase tracking-widest">{matchData.teamBName}</span>
            </div>
            <div className="grid gap-2">
              {matchData.onCourtB?.map(id => {
                const player = matchData.playersB?.find(p => p.id === id);
                return player ? <PlayerRow key={id} player={player} team="B" /> : null;
              })}
            </div>
          </div>
        </div>

        {/* 2 MIN FOULS & LOGS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-yellow-500 uppercase mb-4 flex items-center gap-2">
              <Timer size={14}/> Active 2 Min Fouls
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchData.activeFouls?.map(f => (
                <div key={f.id} className="bg-slate-950 p-3 rounded-xl border-l-4 border-yellow-500 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] text-slate-500">
                      #{f.playerNumber} {f.team === 'A' ? matchData.teamAName : matchData.teamBName}
                    </div>
                    <div className="text-sm font-bold">{f.playerName}</div>
                  </div>
                  <div className="text-xl font-mono text-yellow-500">
                    {formatTime(f.remaining)}
                  </div>
                </div>
              ))}
              {(!matchData.activeFouls || matchData.activeFouls.length === 0) && (
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
              {matchData.matchLog?.map(log => (
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
              {(!matchData.matchLog || matchData.matchLog.length === 0) && (
                <div className="text-center py-4 text-slate-600 text-sm italic">
                  No events yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BENCH PLAYERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team A Bench */}
          <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-blue-400 uppercase mb-4">
              {matchData.teamAName} - Bench
            </h4>
            <div className="grid gap-2">
              {matchData.playersA
                ?.filter(p => !matchData.onCourtA?.includes(p.id))
                .map(player => <PlayerRow key={player.id} player={player} team="A" />)}
            </div>
          </div>

          {/* Team B Bench */}
          <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold text-red-400 uppercase mb-4">
              {matchData.teamBName} - Bench
            </h4>
            <div className="grid gap-2">
              {matchData.playersB
                ?.filter(p => !matchData.onCourtB?.includes(p.id))
                .map(player => <PlayerRow key={player.id} player={player} team="B" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMatchViewer;

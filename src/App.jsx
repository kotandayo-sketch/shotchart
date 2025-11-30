import React, { useEffect, useState } from 'react';
import './styles.css';
import CourtCanvas from './components/CourtCanvas';
import ShotModal from './components/ShotModal';
import StatsPanel from './components/StatsPanel';
import SessionManager from './components/SessionManager';
import PlayerManager from './components/PlayerManager';
import { AREAS } from './lib/areas';
import { computeStats, shotsToCSV } from './lib/util';
import { loadShots, saveShots, loadSessions, saveSessions, loadPlayers, savePlayers } from './lib/storage';

export default function App(){
  const [shots, setShots] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [editingShot, setEditingShot] = useState(null);

  useEffect(()=>{ (async ()=>{ setShots(await loadShots()); setSessions(await loadSessions()); setPlayers(await loadPlayers()); })(); },[]);
  useEffect(()=>{ saveShots(shots); }, [shots]);
  useEffect(()=>{ saveSessions(sessions); }, [sessions]);
  useEffect(()=>{ savePlayers(players); }, [players]);

  function onAddShot(shot){
    setShots(prev => [...prev, shot]);
  }
  function onSelectShot(shot){
    setEditingShot(shot);
  }
  function onSaveShot(updated){
    setShots(prev => prev.map(s => s.id === updated.id ? updated : s));
    setEditingShot(null);
  }
  function onDeleteShot(id){
    setShots(prev => prev.filter(s => s.id !== id));
    setEditingShot(null);
  }

  function handleUndo(){
    setShots(prev => prev.slice(0,-1));
  }

  function handleExport(){
    const csv = shotsToCSV(shots);
    const blob = new Blob([csv], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url; a.download='shots.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = shots.filter(s => (!selectedPlayer || s.playerId === selectedPlayer) && (!selectedSession || s.sessionId === selectedSession));
  const stats = computeStats(filtered, AREAS);

  return (
    <div className="app">
      <header>
        <h1>ShotChart — 完全版MVP</h1>
        <div className="header-controls">
          <div>
            Player:
            <select value={selectedPlayer||''} onChange={e=>setSelectedPlayer(e.target.value||null)}>
              <option value="">-- all --</option>
              {players.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            Session:
            <select value={selectedSession||''} onChange={e=>setSelectedSession(e.target.value||null)}>
              <option value="">-- all --</option>
              {sessions.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={handleUndo}>Undo</button>
            <button onClick={handleExport}>Export CSV</button>
            <button onClick={()=>{ setShots([]); }}>Clear All</button>
          </div>
        </div>
      </header>

      <main style={{ display:'flex', gap:20 }}>
        <div style={{ flex:1 }}>
          <CourtCanvas width={900} height={450} shots={filtered} onAddShot={onAddShot} onSelectShot={onSelectShot} />
        </div>

        <aside style={{ width:340 }}>
          <StatsPanel shots={filtered} areas={AREAS} />

          <div style={{ marginTop:12 }}>
            <SessionManager sessions={sessions} onCreate={(s)=>setSessions(prev=>[...prev,s])} />
            <PlayerManager players={players} onCreate={(p)=>setPlayers(prev=>[...prev,p])} />
          </div>
        </aside>
      </main>

      {editingShot && <ShotModal shot={editingShot} onClose={()=>setEditingShot(null)} onSave={onSaveShot} />}
    </div>
  );
}

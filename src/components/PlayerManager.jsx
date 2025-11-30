import React, { useState } from 'react';

export default function PlayerManager({ players, onCreate }) {
  const [name, setName] = useState('');
  return (
    <div style={{ marginBottom:8 }}>
      <h4>Players</h4>
      <div style={{ display:'flex', gap:6 }}>
        <input placeholder="player name" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={()=>{ if(!name) return; onCreate({ id:'p-'+Date.now(), name }); setName('');}}>Add</button>
      </div>
      <ul>
        {players.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}

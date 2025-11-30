import React, { useState } from 'react';

export default function SessionManager({ sessions, onCreate }) {
  const [name, setName] = useState('');
  return (
    <div style={{ marginBottom:8 }}>
      <h4>Sessions</h4>
      <div style={{ display:'flex', gap:6 }}>
        <input placeholder="session name" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={()=>{ if(!name) return; onCreate({ id:'s-'+Date.now(), name, date: new Date().toISOString() }); setName('');}}>Create</button>
      </div>
      <ul>
        {sessions.map(s => <li key={s.id}>{s.name} <small style={{color:'#666'}}>({new Date(s.date).toLocaleDateString()})</small></li>)}
      </ul>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function ShotModal({ shot, onClose, onSave }) {
  const [note, setNote] = useState(shot?.note || '');
  const [result, setResult] = useState(shot?.result || 'miss');

  useEffect(() => {
    setNote(shot?.note || '');
    setResult(shot?.result || 'miss');
  }, [shot]);

  if (!shot) return null;

  return (
    <div style={{
      position:'fixed', left:0, top:0, right:0, bottom:0, background:'rgba(0,0,0,0.3)',
      display:'flex', justifyContent:'center', alignItems:'center', zIndex:9999
    }}>
      <div style={{ background:'#fff', padding:16, borderRadius:8, width:320 }}>
        <h3>Edit Shot</h3>
        <div>
          <label>
            Result:
            <select value={result} onChange={(e)=>setResult(e.target.value)}>
              <option value="made">Made</option>
              <option value="miss">Miss</option>
            </select>
          </label>
        </div>
        <div style={{ marginTop:8 }}>
          <label>
            Note:
            <input value={note} onChange={e=>setNote(e.target.value)} style={{ width:'100%' }} />
          </label>
        </div>

        <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:12 }}>
          <button onClick={()=>{ onSave({...shot, result, note}); }}>Save</button>
          <button onClick={onClose} style={{ background:'#ccc' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

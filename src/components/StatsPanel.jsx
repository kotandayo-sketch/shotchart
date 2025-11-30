import React from 'react';
import { computeStats } from '../lib/util';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatsPanel({ shots, areas }) {
  const stats = computeStats(shots, areas);
  const dataForChart = stats.areaStats.map(a => ({ name: a.name, pct: a.pct ? Math.round(a.pct*100) : 0 }));
  return (
    <div style={{ width:320 }}>
      <h3>Stats</h3>
      <div>Total Attempts: {stats.totalAttempts}</div>
      <div>Total Made: {stats.totalMade}</div>
      <div>Total Pct: {stats.totalPct !== null ? Math.round(stats.totalPct*100) + '%' : '-'}</div>

      <h4 style={{ marginTop:12 }}>Area success %</h4>
      <table style={{ width:'100%', fontSize:13 }}>
        <thead><tr><th>Area</th><th>Att</th><th>Made</th><th>Pct</th></tr></thead>
        <tbody>
          {stats.areaStats.map(a => (
            <tr key={a.id}><td>{a.name}</td><td>{a.attempts}</td><td>{a.made}</td><td>{a.pct !== null ? Math.round(a.pct*100)+'%' : '-'}</td></tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop:12, height:120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataForChart}>
            <defs>
              <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0077ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0077ff" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Area type="monotone" dataKey="pct" stroke="#0077ff" fill="url(#color)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

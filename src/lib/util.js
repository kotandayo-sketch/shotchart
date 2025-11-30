// util functions for normalized coords & point-in-polygon and stats

export function pointInPolygonXY(pt, polygon) {
  // pt: [x,y], polygon: [[x,y],...]
  const x = pt[0], y = pt[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function findAreaForPoint(normPoint, areas) {
  // normPoint: {x:0..1, y:0..1}
  for (const a of areas) {
    if (pointInPolygonXY([normPoint.x, normPoint.y], a.polygon)) return a.id;
  }
  return null;
}

export function computeStats(shots, areas) {
  const byArea = {};
  areas.forEach(a => byArea[a.id] = { attempts:0, made:0, name: a.name });
  let totalAttempts = 0, totalMade = 0;
  for (const s of shots) {
    totalAttempts++;
    if (s.result === 'made') totalMade++;
    if (s.areaId && byArea[s.areaId]) {
      byArea[s.areaId].attempts++;
      if (s.result === 'made') byArea[s.areaId].made++;
    }
  }
  const areaStats = Object.entries(byArea).map(([id, v]) => ({ id, name:v.name, attempts:v.attempts, made:v.made, pct: v.attempts ? (v.made/v.attempts) : null }));
  return { totalAttempts, totalMade, totalPct: totalAttempts ? (totalMade/totalAttempts) : null, areaStats };
}

// CSV export helper
export function shotsToCSV(shots) {
  const header = ['id','playerId','sessionId','timestamp','x','y','areaId','result','note'];
  const rows = shots.map(s => [s.id,s.playerId,s.sessionId,s.t,s.x,s.y,s.areaId,s.result,(s.note||'') ]);
  return [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
}

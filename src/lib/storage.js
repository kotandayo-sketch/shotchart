import localforage from 'localforage';
localforage.config({ name: 'shotchart' });

export const saveShots = async (shots) => await localforage.setItem('shots', shots);
export const loadShots = async () => (await localforage.getItem('shots')) || [];
export const saveSessions = async (sessions) => await localforage.setItem('sessions', sessions);
export const loadSessions = async () => (await localforage.getItem('sessions')) || [];
export const savePlayers = async (players) => await localforage.setItem('players', players);
export const loadPlayers = async () => (await localforage.getItem('players')) || [];

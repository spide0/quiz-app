import session from 'express-session';
import MemoryStore from 'memorystore';

const MemoryStoreSession = MemoryStore(session);

export const sessionStore = new MemoryStoreSession({
    checkPeriod: 86400000 // Prune expired entries every 24h
});

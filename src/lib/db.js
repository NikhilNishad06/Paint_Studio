// IndexedDB helpers with in-memory fallback
let db = null;
const mem = new Map();

export function dbo() {
  return new Promise((res) => {
    try {
      const r = indexedDB.open('paint-studio', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('d', { keyPath: 'id' });
      r.onsuccess = () => {
        db = r.result;
        res(true);
      };
      r.onerror = () => res(false);
    } catch {
      res(false);
    }
  });
}

export function isDbConnected() {
  return !!db;
}

function R(mode, f) {
  return new Promise((res, rej) => {
    if (!db) return rej(new Error('No DB'));
    const t = db.transaction('d', mode);
    const r = f(t.objectStore('d'));
    t.oncomplete = () => res(r && r.result);
    t.onerror = t.onabort = () => rej(t.error);
  });
}

export const dbAll = () => (db ? R('readonly', (s) => s.getAll()) : Promise.resolve([...mem.values()]));

export const dbPut = (r) => (db ? R('readwrite', (s) => s.put(r)) : (mem.set(r.id, r), Promise.resolve()));

export const dbDel = (id) => (db ? R('readwrite', (s) => s.delete(id)) : (mem.delete(id), Promise.resolve()));

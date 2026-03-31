export function saveToLocalStorage(key, data) {
  const today = new Date().toISOString().slice(0,10);
  const item = { date: today, data: data };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getFromLocalStorage(key) {
  const today = new Date().toISOString().slice(0,10);
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (parsed.date === today) return parsed.data;
    else { localStorage.removeItem(key); return null; }
  } catch(e) { return null; }
}
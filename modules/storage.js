export function saveToLocalStorage(key, data) {
  const today = new Date().toISOString().slice(0,10);
  localStorage.setItem(key, JSON.stringify({ date: today, data }));
}
export function getFromLocalStorage(key) {
  const today = new Date().toISOString().slice(0,10);
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    const { date, data } = JSON.parse(stored);
    return date === today ? data : null;
  } catch { return null; }
}
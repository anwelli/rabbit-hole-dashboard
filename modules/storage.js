// Save data with today's date
export function saveToLocalStorage(key, data) {
  const today = new Date().toISOString().slice(0,10);
  const item = {
    date: today,
    data: data
  };
  localStorage.setItem(key, JSON.stringify(item));
}

// Get cached data if it's from today
export function getFromLocalStorage(key) {
  const today = new Date().toISOString().slice(0,10);
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    if (parsed.date === today) {
      return parsed.data;
    } else {
      localStorage.removeItem(key);
      return null;
    }
  } catch(e) {
    return null;
  }
}
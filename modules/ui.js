export function showLoading(id, show) {
  const el = document.getElementById(id);
  if (el) el.style.display = show ? 'block' : 'none';
}
export function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
export function hideError(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}
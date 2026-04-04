import { showLoading, showError, hideError } from './ui.js';

export async function loadOnThisDay() {
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const maxDay = month === '02' ? 28 : 30;
  const day = String(Math.floor(Math.random() * maxDay) + 1).padStart(2, '0');
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`;

  showLoading('historySpinner', true);
  hideError('historyError');

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const events = data.events.slice(0, 5);
    const list = document.getElementById('historyList');
    list.innerHTML = '';

    events.forEach(event => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${event.year}</strong> – ${event.text}`;
      if (event.pages && event.pages.length > 0) {
        const page = event.pages[0];
        const pageUrl = page.content_urls?.desktop?.page;
        if (pageUrl) {
          const link = document.createElement('a');
          link.href = pageUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = ' Read more →';
          li.appendChild(link);
        }
      }
      list.appendChild(li);
    });
    list.style.display = 'block';
  } catch (error) {
    console.error('History error:', error);
    showError('historyError', 'Could not load historical events.');
  } finally {
    showLoading('historySpinner', false);
  }
}
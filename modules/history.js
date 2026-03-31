import { showLoading, showError, hideError } from './ui.js';

export async function loadOnThisDay() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2,'0');
  const day = String(today.getDate()).padStart(2,'0');
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`;
  
  showLoading('historySpinner', true);
  hideError('historyError');
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('History feed error');
    const data = await response.json();
    displayHistory(data.events.slice(0, 5)); // show top 5 events
  } catch (error) {
    console.error('History error:', error);
    showError('historyError', 'Historical events unavailable right now.');
  } finally {
    showLoading('historySpinner', false);
  }
}

function displayHistory(events) {
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  events.forEach(event => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${event.year}</strong> – ${event.text}`;
    list.appendChild(li);
  });
  list.style.display = 'block';
  hideError('historyError');
}
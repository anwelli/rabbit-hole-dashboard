import { loadAPOD } from './modules/apod.js';
import { loadRandomWiki } from './modules/wiki.js';
import { loadOnThisDay } from './modules/history.js';

function setGreeting() {
  const hour = new Date().getHours();
  let greetingText = '';
  if (hour < 12) greetingText = 'Good morning ☀️';
  else if (hour < 18) greetingText = 'Good afternoon 🌤️';
  else greetingText = 'Good evening 🌙';
  document.getElementById('greeting').textContent = `${greetingText}, curious mind`;
}

async function initDashboard() {
  setGreeting();
  await loadAPOD();
  await loadOnThisDay();
  await loadRandomWiki();
}

function setupEventListeners() {
  const surpriseBtn = document.getElementById('surpriseBtn');
  surpriseBtn.addEventListener('click', () => {
    document.getElementById('wikiContent').style.display = 'none';
    loadRandomWiki();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  initDashboard();
});
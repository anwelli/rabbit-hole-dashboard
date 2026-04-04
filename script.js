import { loadAPOD } from './modules/apod.js';
import { loadRandomWiki } from './modules/wiki.js';
import { loadOnThisDay } from './modules/history.js';
import { loadWeather } from './modules/weather.js';

function setGreeting() {
  const hour = new Date().getHours();
  let greeting = '';
  if (hour < 12) greeting = 'Good morning ☀️';
  else if (hour < 18) greeting = 'Good afternoon 🌤️';
  else greeting = 'Good evening 🌙';
  document.getElementById('greeting').textContent = `${greeting}, curious mind`;
}

async function refreshNonWeather() {
  console.log('Refreshing NASA, History, Wikipedia...');
  await Promise.all([
    loadAPOD(),
    loadOnThisDay(),
    loadRandomWiki()
  ]);
}

function setupEventListeners() {
  const surpriseBtn = document.getElementById('surpriseBtn');
  surpriseBtn.addEventListener('click', () => {
    // Add rotation animation
    surpriseBtn.classList.add('rotate');
    surpriseBtn.addEventListener('animationend', () => {
      surpriseBtn.classList.remove('rotate');
    }, { once: true });
    // Fetch new Wikipedia article
    document.getElementById('wikiContent').style.display = 'none';
    loadRandomWiki();
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  setGreeting();
  await loadWeather();          // load once
  await refreshNonWeather();    // initial load
  setupEventListeners();
  setInterval(refreshNonWeather, 60000); // every minute
});
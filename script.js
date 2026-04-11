import { loadAPOD } from './modules/apod.js';
import { loadRandomWiki } from './modules/wiki.js';
import { loadOnThisDay } from './modules/history.js';
import { loadWeather } from './modules/weather.js';
import { getFromLocalStorage } from './modules/storage.js';

function setGreeting() {
  const hour = new Date().getHours();
  let greeting = '';
  if (hour < 12) greeting = 'Good morning ☀️';
  else if (hour < 18) greeting = 'Good afternoon 🌤️';
  else greeting = 'Good evening 🌙';
  document.getElementById('greeting').textContent = `${greeting}, curious mind`;
}

function showCachedWiki() {
  const cached = getFromLocalStorage('lastWiki');
  if (cached && cached.title) {
    document.getElementById('wikiTitle').textContent = cached.title;
    document.getElementById('wikiExtract').textContent = cached.extract;
    document.getElementById('wikiLink').href = cached.link;
    document.getElementById('wikiContent').style.display = 'block';
    console.log('Loaded cached Wikipedia article');
  }
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
    surpriseBtn.classList.add('rotate');
    surpriseBtn.addEventListener('animationend', () => {
      surpriseBtn.classList.remove('rotate');
    }, { once: true });
    document.getElementById('wikiContent').style.display = 'none';
    loadRandomWiki();
  });
}

function setupFooter() {
  // Set current year
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  
  // Back to Top button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  setGreeting();
  showCachedWiki();
  await loadWeather();
  await refreshNonWeather();
  setupEventListeners();
  setupFooter();               // <-- initialise footer elements
  setInterval(refreshNonWeather, 60000);
});
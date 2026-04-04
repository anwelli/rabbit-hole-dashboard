import { saveToLocalStorage, getFromLocalStorage } from './storage.js';
import { showLoading, showError, hideError } from './ui.js';

const NASA_API_KEY = 'vWYibmNW8YaYzNdnsXpczz3MxzT4PtKzlKE7BRe0';
const NASA_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

export async function loadAPOD() {
  const cached = getFromLocalStorage('nasa');
  if (cached) {
    displayAPOD(cached);
    return;
  }
  showLoading('nasaSpinner', true);
  hideError('nasaError');
  try {
    const response = await fetch(NASA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    saveToLocalStorage('nasa', data);
    displayAPOD(data);
  } catch (error) {
    console.error('NASA error:', error);
    showError('nasaError', 'Could not load space picture.');
    document.getElementById('nasaContent').style.display = 'none';
  } finally {
    showLoading('nasaSpinner', false);
  }
}

function displayAPOD(data) {
  document.getElementById('nasaImage').src = data.url;
  document.getElementById('nasaTitle').textContent = data.title;
  document.getElementById('nasaExplanation').textContent = data.explanation;
  document.getElementById('nasaContent').style.display = 'block';
  hideError('nasaError');
}
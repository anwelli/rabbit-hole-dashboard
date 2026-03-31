import { showLoading, showError } from './ui.js';

export async function loadRandomWiki() {
  showLoading('wikiSpinner', true);
  const url = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Wikipedia not responding');
    const data = await response.json();
    displayWiki(data);
  } catch (error) {
    console.error('Wiki error:', error);
    showError('wikiError', 'Failed to load random article. Click "Surprise Me" to try again.');
  } finally {
    showLoading('wikiSpinner', false);
  }
}

function displayWiki(data) {
  document.getElementById('wikiTitle').textContent = data.title;
  document.getElementById('wikiExtract').textContent = data.extract || 'No summary available.';
  const link = document.getElementById('wikiLink');
  link.href = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`;
  
  document.getElementById('wikiContent').style.display = 'block';
  // hide any previous error
  document.getElementById('wikiError').style.display = 'none';
}
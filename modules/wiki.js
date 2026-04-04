import { showLoading, showError, hideError } from './ui.js';

export async function loadRandomWiki() {
  showLoading('wikiSpinner', true);
  hideError('wikiError');
  document.getElementById('wikiContent').style.display = 'none';
  try {
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary');
    if (!res.ok) throw new Error();
    const data = await res.json();
    document.getElementById('wikiTitle').textContent = data.title;
    document.getElementById('wikiExtract').textContent = data.extract || 'No summary.';
    const link = document.getElementById('wikiLink');
    link.href = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`;
    document.getElementById('wikiContent').style.display = 'block';
  } catch (err) {
    showError('wikiError', 'Failed to load article. Click dice to try again.');
  } finally {
    showLoading('wikiSpinner', false);
  }
}
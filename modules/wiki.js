import { showLoading, showError, hideError } from './ui.js';
import { saveToLocalStorage } from './storage.js';   // add this import

export async function loadRandomWiki() {
  showLoading('wikiSpinner', true);
  hideError('wikiError');
  document.getElementById('wikiContent').style.display = 'none';
  try {
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary');
    if (!res.ok) throw new Error();
    const data = await res.json();
    const title = data.title;
    const extract = data.extract || 'No summary.';
    const linkUrl = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
    
    document.getElementById('wikiTitle').textContent = title;
    document.getElementById('wikiExtract').textContent = extract;
    const link = document.getElementById('wikiLink');
    link.href = linkUrl;
    document.getElementById('wikiContent').style.display = 'block';
    
    // ✅ Save to localStorage (third property)
    saveToLocalStorage('lastWiki', {
      title: title,
      extract: extract,
      link: linkUrl,
      timestamp: Date.now()
    });
  } catch (err) {
    showError('wikiError', 'Failed to load article. Click dice to try again.');
  } finally {
    showLoading('wikiSpinner', false);
  }
}
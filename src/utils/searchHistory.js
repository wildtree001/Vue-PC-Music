const SEARCH_HISTORY_KEY = 'vue_music_search_history';
const MAX_HISTORY_COUNT = 20;

export function getSearchHistory() {
  const history = localStorage.getItem(SEARCH_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

export function addSearchHistory(keyword) {
  if (!keyword || !keyword.trim()) return;
  
  let history = getSearchHistory();
  keyword = keyword.trim();
  
  const index = history.indexOf(keyword);
  if (index > -1) {
    history.splice(index, 1);
  }
  
  history.unshift(keyword);
  
  if (history.length > MAX_HISTORY_COUNT) {
    history = history.slice(0, MAX_HISTORY_COUNT);
  }
  
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  return history;
}

export function removeSearchHistory(keyword) {
  let history = getSearchHistory();
  const index = history.indexOf(keyword);
  if (index > -1) {
    history.splice(index, 1);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  }
  return history;
}

export function clearSearchHistory() {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
  return [];
}

export function getTopSearchHistory(count = 5) {
  const history = getSearchHistory();
  return history.slice(0, count);
}

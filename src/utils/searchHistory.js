const SEARCH_HISTORY_KEY = 'vue_music_search_history';
const MAX_HISTORY_COUNT = 100;

function getHistoryObject() {
  const history = localStorage.getItem(SEARCH_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

function saveHistoryObject(history) {
  if (history.length > MAX_HISTORY_COUNT) {
    history = history.slice(0, MAX_HISTORY_COUNT);
  }
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  return history;
}

export function getSearchHistory() {
  const history = getHistoryObject();
  return history.map(function(item) {
    return typeof item === 'string' ? { keyword: item, count: 1, lastSearchTime: Date.now() } : item;
  });
}

export function getSearchHistorySortedByCount() {
  const history = getSearchHistory();
  return history.sort(function(a, b) {
    return b.count - a.count;
  });
}

export function addSearchHistory(keyword) {
  if (!keyword || !keyword.trim()) return getSearchHistory();
  
  keyword = keyword.trim();
  let history = getHistoryObject();
  
  let existingIndex = -1;
  for (var i = 0; i < history.length; i++) {
    var item = history[i];
    var kw = typeof item === 'string' ? item : item.keyword;
    if (kw === keyword) {
      existingIndex = i;
      break;
    }
  }
  
  if (existingIndex > -1) {
    var existingItem = history[existingIndex];
    if (typeof existingItem === 'string') {
      history[existingIndex] = {
        keyword: keyword,
        count: 2,
        lastSearchTime: Date.now()
      };
    } else {
      existingItem.count += 1;
      existingItem.lastSearchTime = Date.now();
    }
    var movedItem = history.splice(existingIndex, 1)[0];
    history.unshift(movedItem);
  } else {
    history.unshift({
      keyword: keyword,
      count: 1,
      lastSearchTime: Date.now()
    });
  }
  
  return saveHistoryObject(history);
}

export function removeSearchHistory(keyword) {
  if (!keyword || !keyword.trim()) return getSearchHistory();
  
  let history = getHistoryObject();
  keyword = keyword.trim();
  
  for (var i = 0; i < history.length; i++) {
    var item = history[i];
    var kw = typeof item === 'string' ? item : item.keyword;
    if (kw === keyword) {
      history.splice(i, 1);
      break;
    }
  }
  
  return saveHistoryObject(history);
}

export function clearSearchHistory() {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
  return [];
}

export function getTopSearchHistory(count) {
  var maxCount = count || 5;
  const history = getSearchHistory();
  return history.slice(0, maxCount);
}

export function getSearchHistoryKeywords(count) {
  var maxCount = count || 5;
  const history = getSearchHistory();
  return history.slice(0, maxCount).map(function(item) {
    return item.keyword;
  });
}

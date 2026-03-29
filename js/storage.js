/**
 * localStorage persistence for Conexiones game.
 * Manages game state, streak, and history.
 */
const Storage = (function() {
  const STORAGE_KEY = 'conexiones_state';

  function _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function _save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage full or unavailable — silently fail
    }
  }

  function _getDefaults() {
    return {
      currentGame: null,
      streak: { current: 0, lastWinDate: null, maxStreak: 0 },
      history: {},
      hasSeenTutorial: false
    };
  }

  function _getData() {
    return _load() || _getDefaults();
  }

  // --- Public API ---

  function loadGameState() {
    return _getData().currentGame;
  }

  function saveGameState(gameState) {
    const data = _getData();
    data.currentGame = gameState;
    _save(data);
  }

  function loadStreak() {
    return _getData().streak;
  }

  function saveStreak(streak) {
    const data = _getData();
    data.streak = streak;
    _save(data);
  }

  function loadHistory() {
    return _getData().history;
  }

  function saveGameToHistory(dateStr, result) {
    const data = _getData();
    data.history[dateStr] = result;
    _save(data);
  }

  function hasSeenTutorial() {
    return _getData().hasSeenTutorial;
  }

  function markTutorialSeen() {
    const data = _getData();
    data.hasSeenTutorial = true;
    _save(data);
  }

  /**
   * Get today's date as YYYY-MM-DD string.
   */
  function getTodayStr() {
    const d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  /**
   * Get yesterday's date as YYYY-MM-DD string relative to a given date string.
   */
  function getYesterdayStr(dateStr) {
    const d = new Date(dateStr + 'T12:00:00'); // noon to avoid DST issues
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  /**
   * Update streak after a game ends.
   * @param {boolean} won - Whether the player won
   * @param {string} todayStr - Today's date string
   */
  function updateStreak(won, todayStr) {
    const data = _getData();
    const streak = data.streak;

    if (won) {
      const yesterday = getYesterdayStr(todayStr);
      if (streak.lastWinDate === yesterday) {
        streak.current += 1;
      } else if (streak.lastWinDate === todayStr) {
        // Already recorded today — no-op
      } else {
        streak.current = 1;
      }
      streak.lastWinDate = todayStr;
      streak.maxStreak = Math.max(streak.maxStreak, streak.current);
    } else {
      streak.current = 0;
    }

    data.streak = streak;
    _save(data);
    return streak;
  }

  /**
   * Check if streak is already broken (missed a day without playing).
   * Call on app load to ensure UI reflects reality.
   */
  function checkStreakOnLoad(todayStr) {
    const data = _getData();
    const streak = data.streak;

    if (!streak.lastWinDate) return streak;

    const yesterday = getYesterdayStr(todayStr);
    // If last win was not today and not yesterday, streak is broken
    if (streak.lastWinDate !== todayStr && streak.lastWinDate !== yesterday) {
      streak.current = 0;
      data.streak = streak;
      _save(data);
    }

    return streak;
  }

  /**
   * Get stats for the stats modal.
   */
  function getStats() {
    const data = _getData();
    const history = data.history;
    const entries = Object.values(history);
    const played = entries.length;
    const wins = entries.filter(e => e.won).length;
    const winPct = played > 0 ? Math.round((wins / played) * 100) : 0;

    return {
      played: played,
      wins: wins,
      winPct: winPct,
      currentStreak: data.streak.current,
      maxStreak: data.streak.maxStreak
    };
  }

  return {
    loadGameState,
    saveGameState,
    loadStreak,
    saveStreak,
    loadHistory,
    saveGameToHistory,
    hasSeenTutorial,
    markTutorialSeen,
    getTodayStr,
    getYesterdayStr,
    updateStreak,
    checkStreakOnLoad,
    getStats
  };
})();

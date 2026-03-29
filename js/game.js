/**
 * Core game logic for Conexiones.
 * Handles puzzle selection, guess validation, and game state management.
 */
const Game = (function() {
  const MAX_MISTAKES = 4;
  const MAX_SELECTED = 4;
  const LAUNCH_EPOCH = '2026-03-29';

  /**
   * Get today's puzzle. Primary: exact date match. Fallback: deterministic cycle.
   */
  function getTodayPuzzle(dateStr) {
    const exact = PUZZLES.find(function(p) { return p.date === dateStr; });
    if (exact) return exact;

    // Deterministic fallback cycle
    var epoch = new Date(LAUNCH_EPOCH + 'T12:00:00');
    var today = new Date(dateStr + 'T12:00:00');
    var daysSince = Math.floor((today - epoch) / 86400000);
    var index = ((daysSince % PUZZLES.length) + PUZZLES.length) % PUZZLES.length;
    return PUZZLES[index];
  }

  /**
   * Create a fresh game state for a puzzle.
   */
  function createGameState(puzzle, dateStr) {
    var allWords = [];
    puzzle.groups.forEach(function(g) {
      g.words.forEach(function(w) { allWords.push(w); });
    });

    return {
      date: dateStr,
      selectedWords: [],
      solvedGroups: [],        // indices into puzzle.groups
      mistakes: 0,
      guessHistory: [],        // array of sorted word arrays (for dupe detection)
      status: 'playing',       // 'playing' | 'won' | 'lost'
      remainingWords: shuffle(allWords),
      solveOrder: []           // order groups were solved in, for share
    };
  }

  /**
   * Fisher-Yates shuffle.
   */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  /**
   * Toggle word selection. Returns updated selectedWords array.
   */
  function toggleSelection(gameState, word) {
    var sel = gameState.selectedWords.slice();
    var idx = sel.indexOf(word);
    if (idx >= 0) {
      sel.splice(idx, 1);
    } else if (sel.length < MAX_SELECTED) {
      sel.push(word);
    }
    return sel;
  }

  /**
   * Clear all selections.
   */
  function clearSelection() {
    return [];
  }

  /**
   * Check if a guess (array of 4 words) has already been attempted.
   */
  function isAlreadyGuessed(selectedWords, guessHistory) {
    var sorted = selectedWords.slice().sort().join(',');
    return guessHistory.some(function(prev) {
      return prev.slice().sort().join(',') === sorted;
    });
  }

  /**
   * Validate a guess against the puzzle.
   * Returns: { correct: bool, groupIndex: number|null, oneAway: bool }
   */
  function checkGuess(selectedWords, puzzle) {
    var selected = {};
    selectedWords.forEach(function(w) { selected[w] = true; });

    for (var i = 0; i < puzzle.groups.length; i++) {
      var groupWords = puzzle.groups[i].words;
      var match = groupWords.every(function(w) { return selected[w]; }) &&
                  selectedWords.length === groupWords.length;
      if (match) {
        return { correct: true, groupIndex: i, oneAway: false };
      }
    }

    // Check "one away" (3 of 4 correct in any unsolved group)
    for (var i = 0; i < puzzle.groups.length; i++) {
      var groupWords = puzzle.groups[i].words;
      var overlap = selectedWords.filter(function(w) {
        return groupWords.indexOf(w) >= 0;
      }).length;
      if (overlap === 3) {
        return { correct: false, groupIndex: null, oneAway: true };
      }
    }

    return { correct: false, groupIndex: null, oneAway: false };
  }

  /**
   * Process a correct guess: update game state.
   */
  function processCorrectGuess(gameState, groupIndex, puzzle) {
    var state = Object.assign({}, gameState);
    state.solvedGroups = state.solvedGroups.concat([groupIndex]);
    state.solveOrder = state.solveOrder.concat([groupIndex]);
    state.guessHistory = state.guessHistory.concat([state.selectedWords.slice()]);
    state.selectedWords = [];

    // Remove solved words from remaining
    var solvedWords = {};
    puzzle.groups[groupIndex].words.forEach(function(w) { solvedWords[w] = true; });
    state.remainingWords = state.remainingWords.filter(function(w) {
      return !solvedWords[w];
    });

    if (state.solvedGroups.length === 4) {
      state.status = 'won';
    }

    return state;
  }

  /**
   * Process an incorrect guess: update game state.
   */
  function processIncorrectGuess(gameState) {
    var state = Object.assign({}, gameState);
    state.mistakes = state.mistakes + 1;
    state.guessHistory = state.guessHistory.concat([state.selectedWords.slice()]);
    state.selectedWords = [];

    if (state.mistakes >= MAX_MISTAKES) {
      state.status = 'lost';
    }

    return state;
  }

  /**
   * Shuffle only the remaining (unsolved) words.
   */
  function shuffleRemaining(gameState) {
    var state = Object.assign({}, gameState);
    state.remainingWords = shuffle(state.remainingWords);
    state.selectedWords = [];
    return state;
  }

  /**
   * Generate share text with emoji grid.
   */
  function generateShareText(gameState, puzzle, dateStr) {
    var colorEmojis = {
      yellow: '\uD83D\uDFE8',
      green: '\uD83D\uDFE9',
      blue: '\uD83D\uDFE6',
      purple: '\uD83D\uDFEA'
    };

    var lines = ['Conexiones ' + dateStr];
    var guessIdx = 0;
    var solveIdx = 0;

    // Reconstruct the order of events from guessHistory and solveOrder
    gameState.guessHistory.forEach(function(guess) {
      // Check if this guess was correct
      var result = checkGuess(guess, puzzle);
      if (result.correct) {
        var color = puzzle.groups[result.groupIndex].color;
        lines.push(colorEmojis[color] + colorEmojis[color] + colorEmojis[color] + colorEmojis[color]);
      } else {
        // Incorrect — show the colors of the categories the words belong to
        var row = '';
        guess.forEach(function(word) {
          for (var g = 0; g < puzzle.groups.length; g++) {
            if (puzzle.groups[g].words.indexOf(word) >= 0) {
              row += colorEmojis[puzzle.groups[g].color];
              break;
            }
          }
        });
        lines.push(row);
      }
    });

    return lines.join('\n');
  }

  /**
   * Get milliseconds until next local midnight.
   */
  function msUntilNextPuzzle() {
    var now = new Date();
    var tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow - now;
  }

  return {
    getTodayPuzzle,
    createGameState,
    shuffle,
    toggleSelection,
    clearSelection,
    isAlreadyGuessed,
    checkGuess,
    processCorrectGuess,
    processIncorrectGuess,
    shuffleRemaining,
    generateShareText,
    msUntilNextPuzzle,
    MAX_MISTAKES,
    MAX_SELECTED
  };
})();

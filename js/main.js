/**
 * Main entry point for Conexiones.
 * Wires together game logic, storage, UI, and animations.
 */
(function() {
  var puzzle = null;
  var gameState = null;
  var isAnimating = false;

  function init() {
    var todayStr = Storage.getTodayStr();
    puzzle = Game.getTodayPuzzle(todayStr);
    UI.setPuzzleDate(todayStr);

    // Check streak on load (might be broken from missed days)
    Storage.checkStreakOnLoad(todayStr);

    // Load or create game state
    var saved = Storage.loadGameState();
    if (saved && saved.date === todayStr) {
      gameState = saved;
    } else {
      gameState = Game.createGameState(puzzle, todayStr);
      Storage.saveGameState(gameState);
    }

    // Show tutorial on first visit
    if (!Storage.hasSeenTutorial()) {
      UI.showTutorial();
    }

    // Render initial state
    renderCurrentState();

    // Attach event listeners
    attachListeners();
  }

  function renderCurrentState() {
    // Render solved groups
    UI.renderAllSolvedGroups(puzzle, gameState.solvedGroups);

    // Render grid (remaining words)
    if (gameState.status === 'playing') {
      UI.renderGrid(gameState.remainingWords, gameState.selectedWords, onTileClick);
      UI.renderMistakes(gameState.mistakes, Game.MAX_MISTAKES);
      UI.updateControls(gameState.selectedWords.length);
    } else {
      // Game already over — show completed state
      if (gameState.status === 'lost') {
        UI.revealAllGroups(puzzle, gameState.solvedGroups);
      } else {
        document.getElementById('grid').innerHTML = '';
      }
      var stats = Storage.getStats();
      UI.showCompletedState(gameState.status === 'won', stats);
    }
  }

  function onTileClick(word) {
    if (isAnimating || gameState.status !== 'playing') return;

    gameState.selectedWords = Game.toggleSelection(gameState, word);
    UI.updateSelection(gameState.selectedWords);
    UI.updateControls(gameState.selectedWords.length);
    Storage.saveGameState(gameState);
  }

  function onSubmit() {
    if (isAnimating || gameState.selectedWords.length !== 4 || gameState.status !== 'playing') return;

    // Check for duplicate guess
    if (Game.isAlreadyGuessed(gameState.selectedWords, gameState.guessHistory)) {
      Animations.showToast('Ya intentaste esta combinacion');
      return;
    }

    var result = Game.checkGuess(gameState.selectedWords, puzzle);
    isAnimating = true;
    Animations.disableGrid();

    if (result.correct) {
      handleCorrectGuess(result.groupIndex);
    } else {
      handleIncorrectGuess(result.oneAway);
    }
  }

  function handleCorrectGuess(groupIndex) {
    var selectedTiles = UI.getTilesForWords(gameState.selectedWords);

    Animations.popTiles(selectedTiles).then(function() {
      // Update game state
      gameState = Game.processCorrectGuess(gameState, groupIndex, puzzle);
      Storage.saveGameState(gameState);

      // Render the solved group row
      var row = UI.renderSolvedGroup(puzzle.groups[groupIndex]);

      return Animations.showSolvedRow(row);
    }).then(function() {
      if (gameState.status === 'won') {
        // Render empty grid
        document.getElementById('grid').innerHTML = '';

        // Celebrate
        var solvedRows = document.querySelectorAll('.solved-row');
        return Animations.celebrateWin(solvedRows).then(function() {
          finishGame(true);
        });
      } else {
        // Re-render grid with remaining words
        UI.renderGrid(gameState.remainingWords, gameState.selectedWords, onTileClick);
        UI.updateControls(0);
        isAnimating = false;
        Animations.enableGrid();
      }
    });
  }

  function handleIncorrectGuess(oneAway) {
    var selectedTiles = UI.getTilesForWords(gameState.selectedWords);

    Animations.shakeTiles(selectedTiles).then(function() {
      // Update state
      gameState = Game.processIncorrectGuess(gameState);
      Storage.saveGameState(gameState);

      // Animate mistake dot
      UI.animateMistakeDot(gameState.mistakes, Game.MAX_MISTAKES);

      // Show toast
      if (oneAway) {
        Animations.showToast('Casi...!', 2000);
      }

      if (gameState.status === 'lost') {
        // Short delay then reveal
        setTimeout(function() {
          UI.revealAllGroups(puzzle, gameState.solvedGroups);
          finishGame(false);
        }, 600);
      } else {
        // Clear selection and re-enable
        UI.updateSelection([]);
        UI.updateControls(0);
        isAnimating = false;
        Animations.enableGrid();
      }
    });
  }

  function finishGame(won) {
    var todayStr = Storage.getTodayStr();

    // Save to history
    Storage.saveGameToHistory(todayStr, {
      won: won,
      mistakes: gameState.mistakes
    });

    // Update streak
    Storage.updateStreak(won, todayStr);

    // Show game over
    var stats = Storage.getStats();
    UI.showGameOver(won, stats);

    isAnimating = false;
    Animations.enableGrid();
  }

  function onShuffle() {
    if (isAnimating || gameState.status !== 'playing') return;
    gameState = Game.shuffleRemaining(gameState);
    Storage.saveGameState(gameState);
    UI.renderGrid(gameState.remainingWords, gameState.selectedWords, onTileClick);
    UI.updateControls(0);
  }

  function onDeselect() {
    if (isAnimating || gameState.status !== 'playing') return;
    gameState.selectedWords = Game.clearSelection();
    Storage.saveGameState(gameState);
    UI.updateSelection(gameState.selectedWords);
    UI.updateControls(0);
  }

  function onShare() {
    var text = Game.generateShareText(gameState, puzzle, gameState.date);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        Animations.showToast('Copiado al portapapeles');
      }).catch(function() {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      Animations.showToast('Copiado al portapapeles');
    } catch (e) {
      Animations.showToast('No se pudo copiar');
    }
    document.body.removeChild(textarea);
  }

  function attachListeners() {
    document.getElementById('btn-submit').addEventListener('click', onSubmit);
    document.getElementById('btn-shuffle').addEventListener('click', onShuffle);
    document.getElementById('btn-deselect').addEventListener('click', onDeselect);
    document.getElementById('btn-share').addEventListener('click', onShare);

    // Tutorial
    document.getElementById('btn-help').addEventListener('click', function() {
      UI.showTutorial();
    });
    document.getElementById('btn-close-tutorial').addEventListener('click', function() {
      UI.hideTutorial();
      Storage.markTutorialSeen();
    });
    document.getElementById('btn-start').addEventListener('click', function() {
      UI.hideTutorial();
      Storage.markTutorialSeen();
    });

    // Stats
    document.getElementById('btn-stats').addEventListener('click', function() {
      UI.showStatsModal();
    });
    document.getElementById('btn-close-stats').addEventListener('click', function() {
      UI.hideStatsModal();
    });

    // Close modals on overlay click
    document.getElementById('modal-tutorial').addEventListener('click', function(e) {
      if (e.target === this) {
        UI.hideTutorial();
        Storage.markTutorialSeen();
      }
    });
    document.getElementById('modal-stats').addEventListener('click', function(e) {
      if (e.target === this) {
        UI.hideStatsModal();
      }
    });

    // Keyboard support
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && gameState.selectedWords.length === 4 && !isAnimating) {
        onSubmit();
      }
      if (e.key === 'Escape') {
        UI.hideTutorial();
        UI.hideStatsModal();
      }
    });
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * UI rendering and DOM manipulation for Conexiones.
 */
var UI = (function() {

  /**
   * Render the 4x4 grid of remaining words.
   */
  function renderGrid(remainingWords, selectedWords, onTileClick) {
    var grid = document.getElementById('grid');
    grid.innerHTML = '';

    remainingWords.forEach(function(word) {
      var tile = document.createElement('button');
      tile.className = 'tile';
      tile.textContent = word;
      tile.setAttribute('data-word', word);
      tile.setAttribute('role', 'gridcell');
      tile.setAttribute('aria-pressed', selectedWords.indexOf(word) >= 0 ? 'true' : 'false');

      if (selectedWords.indexOf(word) >= 0) {
        tile.classList.add('selected');
      }

      tile.addEventListener('click', function() {
        onTileClick(word);
      });

      grid.appendChild(tile);
    });
  }

  /**
   * Update tile selection states without re-rendering the entire grid.
   */
  function updateSelection(selectedWords) {
    var tiles = document.querySelectorAll('.tile');
    tiles.forEach(function(tile) {
      var word = tile.getAttribute('data-word');
      var isSelected = selectedWords.indexOf(word) >= 0;
      tile.classList.toggle('selected', isSelected);
      tile.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
  }

  /**
   * Get tile elements for specific words.
   */
  function getTilesForWords(words) {
    var tiles = [];
    var allTiles = document.querySelectorAll('.tile');
    allTiles.forEach(function(tile) {
      if (words.indexOf(tile.getAttribute('data-word')) >= 0) {
        tiles.push(tile);
      }
    });
    return tiles;
  }

  /**
   * Render a solved group row in the solved area.
   */
  function renderSolvedGroup(group) {
    var area = document.getElementById('solved-area');
    var row = document.createElement('div');
    row.className = 'solved-row color-' + group.color;

    var catEl = document.createElement('div');
    catEl.className = 'solved-category';
    catEl.textContent = group.category;

    var wordsEl = document.createElement('div');
    wordsEl.className = 'solved-words';
    wordsEl.textContent = group.words.join(', ');

    row.appendChild(catEl);
    row.appendChild(wordsEl);
    area.appendChild(row);

    return row;
  }

  /**
   * Render all previously solved groups (for restoring state).
   */
  function renderAllSolvedGroups(puzzle, solvedGroupIndices) {
    var area = document.getElementById('solved-area');
    area.innerHTML = '';
    solvedGroupIndices.forEach(function(idx) {
      renderSolvedGroup(puzzle.groups[idx]);
    });
  }

  /**
   * Render the mistakes dots.
   */
  function renderMistakes(mistakes, maxMistakes) {
    var container = document.getElementById('mistakes-dots');
    container.innerHTML = '';
    var remaining = maxMistakes - mistakes;

    for (var i = 0; i < maxMistakes; i++) {
      var dot = document.createElement('div');
      dot.className = 'mistake-dot';
      if (i >= remaining) {
        dot.classList.add('empty');
      }
      container.appendChild(dot);
    }
  }

  /**
   * Update a specific mistake dot (when a new mistake is made).
   */
  function animateMistakeDot(mistakes, maxMistakes) {
    var dots = document.querySelectorAll('.mistake-dot');
    var remaining = maxMistakes - mistakes;
    // The dot that just became empty
    var dotIndex = remaining;
    if (dotIndex < dots.length) {
      dots[dotIndex].classList.add('empty');
      Animations.pulseMistakeDot(dots[dotIndex]);
    }
  }

  /**
   * Update button states based on selection.
   */
  function updateControls(selectedCount) {
    var btnSubmit = document.getElementById('btn-submit');
    var btnDeselect = document.getElementById('btn-deselect');

    btnSubmit.disabled = selectedCount !== 4;
    btnDeselect.disabled = selectedCount === 0;
  }

  /**
   * Show the game over section.
   */
  function showGameOver(won, stats) {
    var el = document.getElementById('game-over');
    el.hidden = false;

    document.getElementById('game-over-title').textContent = won ? '¡Excelente!' : 'Mejor suerte mañana';
    document.getElementById('game-over-subtitle').textContent = won
      ? 'Encontraste todos los grupos'
      : 'No te preocupes, mañana hay una nueva tabla';

    document.getElementById('stat-streak').textContent = stats.currentStreak;
    document.getElementById('stat-max-streak').textContent = stats.maxStreak;
    document.getElementById('stat-win-pct').textContent = stats.winPct + '%';

    // Hide controls
    document.getElementById('controls').style.display = 'none';
    document.getElementById('mistakes-area').style.display = 'none';

    // Start countdown
    startCountdown();
  }

  /**
   * Show the game over state for a game that was already completed (on page reload).
   */
  function showCompletedState(won, stats) {
    showGameOver(won, stats);
  }

  /**
   * Countdown timer to next puzzle.
   */
  var countdownInterval = null;
  function startCountdown() {
    var el = document.getElementById('countdown');
    function update() {
      var ms = Game.msUntilNextPuzzle();
      var totalSecs = Math.floor(ms / 1000);
      var hours = Math.floor(totalSecs / 3600);
      var minutes = Math.floor((totalSecs % 3600) / 60);
      var seconds = totalSecs % 60;
      el.textContent =
        String(hours).padStart(2, '0') + ':' +
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');
    }
    update();
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(update, 1000);
  }

  /**
   * Set the puzzle date in the header.
   */
  function setPuzzleDate(dateStr) {
    var months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    var parts = dateStr.split('-');
    var day = parseInt(parts[2], 10);
    var month = months[parseInt(parts[1], 10) - 1];
    var year = parts[0];
    document.getElementById('puzzle-date').textContent = day + ' de ' + month + ' de ' + year;
  }

  /**
   * Show/hide tutorial modal.
   */
  function showTutorial() {
    document.getElementById('modal-tutorial').hidden = false;
  }

  function hideTutorial() {
    document.getElementById('modal-tutorial').hidden = true;
  }

  /**
   * Show/hide stats modal.
   */
  function showStatsModal() {
    var stats = Storage.getStats();
    document.getElementById('modal-stat-played').textContent = stats.played;
    document.getElementById('modal-stat-win-pct').textContent = stats.winPct + '%';
    document.getElementById('modal-stat-streak').textContent = stats.currentStreak;
    document.getElementById('modal-stat-max').textContent = stats.maxStreak;
    document.getElementById('modal-stats').hidden = false;
  }

  function hideStatsModal() {
    document.getElementById('modal-stats').hidden = true;
  }

  /**
   * Reveal all unsolved groups (on loss).
   */
  function revealAllGroups(puzzle, solvedGroupIndices) {
    // Reveal unsolved groups
    puzzle.groups.forEach(function(group, idx) {
      if (solvedGroupIndices.indexOf(idx) < 0) {
        renderSolvedGroup(group);
      }
    });
    // Hide the grid
    document.getElementById('grid').innerHTML = '';
  }

  return {
    renderGrid: renderGrid,
    updateSelection: updateSelection,
    getTilesForWords: getTilesForWords,
    renderSolvedGroup: renderSolvedGroup,
    renderAllSolvedGroups: renderAllSolvedGroups,
    renderMistakes: renderMistakes,
    animateMistakeDot: animateMistakeDot,
    updateControls: updateControls,
    showGameOver: showGameOver,
    showCompletedState: showCompletedState,
    setPuzzleDate: setPuzzleDate,
    showTutorial: showTutorial,
    hideTutorial: hideTutorial,
    showStatsModal: showStatsModal,
    hideStatsModal: hideStatsModal,
    revealAllGroups: revealAllGroups,
    startCountdown: startCountdown
  };
})();

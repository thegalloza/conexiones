/**
 * Animation orchestration for Conexiones.
 * Manages timing and CSS class toggling for game animations.
 */
var Animations = (function() {

  /**
   * Show a toast message that auto-hides.
   */
  function showToast(message, duration) {
    duration = duration || 1500;
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function() {
      toast.classList.remove('show');
    }, duration);
  }

  /**
   * Shake tiles (incorrect guess). Returns a promise that resolves when done.
   */
  function shakeTiles(tileElements) {
    return new Promise(function(resolve) {
      tileElements.forEach(function(el) {
        el.classList.add('shake');
      });
      setTimeout(function() {
        tileElements.forEach(function(el) {
          el.classList.remove('shake');
        });
        resolve();
      }, 400);
    });
  }

  /**
   * Pop animation on tiles (correct guess before they disappear).
   */
  function popTiles(tileElements) {
    return new Promise(function(resolve) {
      tileElements.forEach(function(el, i) {
        setTimeout(function() {
          el.classList.add('pop');
        }, i * 60);
      });
      setTimeout(function() {
        resolve();
      }, 350 + (tileElements.length - 1) * 60);
    });
  }

  /**
   * Animate the solved row appearing.
   */
  function showSolvedRow(rowElement) {
    return new Promise(function(resolve) {
      // The CSS animation is applied via the .solved-row class
      setTimeout(resolve, 500);
    });
  }

  /**
   * Bounce solved rows sequentially (win celebration).
   */
  function celebrateWin(solvedRows) {
    return new Promise(function(resolve) {
      solvedRows.forEach(function(row, i) {
        setTimeout(function() {
          row.style.animation = 'none';
          row.offsetHeight; // trigger reflow
          row.style.animation = 'bounce 0.4s ease-out';
        }, i * 150);
      });
      setTimeout(resolve, 150 * solvedRows.length + 400);
    });
  }

  /**
   * Pulse a mistake dot when a mistake is made.
   */
  function pulseMistakeDot(dotElement) {
    dotElement.classList.add('used');
    setTimeout(function() {
      dotElement.classList.remove('used');
    }, 300);
  }

  /**
   * Disable all grid interaction during animations.
   */
  function disableGrid() {
    var grid = document.getElementById('grid');
    grid.style.pointerEvents = 'none';
    var controls = document.getElementById('controls');
    controls.style.pointerEvents = 'none';
  }

  /**
   * Re-enable grid interaction.
   */
  function enableGrid() {
    var grid = document.getElementById('grid');
    grid.style.pointerEvents = '';
    var controls = document.getElementById('controls');
    controls.style.pointerEvents = '';
  }

  return {
    showToast: showToast,
    shakeTiles: shakeTiles,
    popTiles: popTiles,
    showSolvedRow: showSolvedRow,
    celebrateWin: celebrateWin,
    pulseMistakeDot: pulseMistakeDot,
    disableGrid: disableGrid,
    enableGrid: enableGrid
  };
})();

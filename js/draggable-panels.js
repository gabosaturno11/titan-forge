/**
 * Draggable 3-Panel Layout - Ableton-style resizable columns
 * Saturno Forge
 */
(function() {
  const STORAGE_KEY = 'saturno_hub_panel_widths';
  const DEFAULT = [28, 44, 28]; // percent

  function loadWidths() {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) return JSON.parse(s);
    } catch (e) {}
    return DEFAULT;
  }

  function saveWidths(w) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(w)); } catch (e) {}
  }

  function initPanels() {
    const container = document.getElementById('three-panel-container');
    if (!container) return;

    const p1 = document.getElementById('panel-input');
    const p2 = document.getElementById('panel-process');
    const p3 = document.getElementById('panel-output');
    const r1 = document.getElementById('resize-1');
    const r2 = document.getElementById('resize-2');

    let widths = loadWidths();
    if (widths.length !== 3) widths = DEFAULT;

    function apply() {
      p1.style.flex = `0 0 ${widths[0]}%`;
      p2.style.flex = `0 0 ${widths[1]}%`;
      p3.style.flex = `0 0 ${widths[2]}%`;
    }
    apply();

    function drag(resizeEl, leftIdx) {
      let startX = 0, startW = [0,0,0];
      function onMove(e) {
        const dx = e.clientX - startX;
        const total = container.offsetWidth;
        const dPct = (dx / total) * 100;
        const newLeft = Math.max(10, Math.min(60, startW[leftIdx] + dPct));
        const newRight = Math.max(10, Math.min(60, startW[leftIdx + 1] - dPct));
        if (newLeft >= 10 && newRight >= 10) {
          widths[leftIdx] = newLeft;
          widths[leftIdx + 1] = newRight;
          widths[2 - leftIdx] = 100 - newLeft - newRight;
          apply();
          saveWidths(widths);
        }
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
      return function(e) {
        e.preventDefault();
        startX = e.clientX;
        startW = [...widths];
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      };
    }

    if (r1) r1.addEventListener('mousedown', drag(r1, 0));
    if (r2) r2.addEventListener('mousedown', drag(r2, 1));

    document.querySelectorAll('.panel-collapse-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const panel = this.closest('.three-panel');
        if (panel) panel.classList.toggle('collapsed');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPanels);
  } else {
    initPanels();
  }
})();

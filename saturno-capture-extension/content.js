// ═══════════════════════════════════════════════════════════════
// SATURNO CAPTURE - Content Script
// Injects capture UI into all pages
// ═══════════════════════════════════════════════════════════════

(function() {
  'use strict';

  let floatingButton = null;
  let captureModal = null;
  let lastSelection = '';

  // ═══════════════════════════════════════════════════════════════
  // FLOATING CAPTURE BUTTON
  // ═══════════════════════════════════════════════════════════════

  function createFloatingButton() {
    if (floatingButton) return;

    floatingButton = document.createElement('div');
    floatingButton.id = 'saturno-capture-btn';
    floatingButton.innerHTML = `
      <div class="saturno-capture-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </div>
    `;
    floatingButton.style.cssText = `
      position: fixed;
      display: none;
      z-index: 2147483647;
      width: 32px;
      height: 32px;
      background: #0a0a0a;
      border: 1px solid #00ffcc;
      border-radius: 4px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 255, 204, 0.3);
      transition: all 0.2s;
    `;

    floatingButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showCaptureModal();
    });

    floatingButton.addEventListener('mouseenter', () => {
      floatingButton.style.transform = 'scale(1.1)';
      floatingButton.style.borderColor = '#00ffcc';
    });

    floatingButton.addEventListener('mouseleave', () => {
      floatingButton.style.transform = 'scale(1)';
    });

    document.body.appendChild(floatingButton);
  }

  function showFloatingButton(x, y) {
    if (!floatingButton) createFloatingButton();

    floatingButton.style.display = 'flex';
    floatingButton.style.left = `${x + 10}px`;
    floatingButton.style.top = `${y - 40}px`;
  }

  function hideFloatingButton() {
    if (floatingButton) {
      floatingButton.style.display = 'none';
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // CAPTURE MODAL
  // ═══════════════════════════════════════════════════════════════

  // Category colors - Clasp style
  const CATEGORY_CONFIG = {
    idea:     { color: '#00ffcc', icon: '💡', label: 'Idea' },
    quote:    { color: '#d4af37', icon: '💬', label: 'Quote' },
    code:     { color: '#a855f7', icon: '⌨️', label: 'Code' },
    insight:  { color: '#22c55e', icon: '🎯', label: 'Insight' },
    todo:     { color: '#ef4444', icon: '✓', label: 'To-Do' },
    book:     { color: '#3b82f6', icon: '📖', label: 'Book' },
    research: { color: '#f97316', icon: '🔬', label: 'Research' },
    thought:  { color: '#ec4899', icon: '💭', label: 'Thought' }
  };

  function createCaptureModal() {
    if (captureModal) return;

    captureModal = document.createElement('div');
    captureModal.id = 'saturno-capture-modal';
    captureModal.innerHTML = `
      <div class="saturno-modal-backdrop"></div>
      <div class="saturno-modal-content">
        <div class="saturno-modal-header">
          <span class="saturno-modal-logo">SATURNO CAPTURE</span>
          <button class="saturno-modal-close">&times;</button>
        </div>

        <div class="saturno-modal-body">
          <div class="saturno-field">
            <label class="saturno-label">SELECTED TEXT</label>
            <div class="saturno-preview" id="saturno-preview"></div>
          </div>

          <div class="saturno-field">
            <label class="saturno-label">COLOR / CATEGORY</label>
            <div class="saturno-color-grid" id="saturno-categories">
              ${Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => `
                <button class="saturno-color-btn ${key === 'idea' ? 'active' : ''}" data-cat="${key}" style="--cat-color: ${cfg.color};" title="${cfg.label}">
                  <span class="saturno-color-dot"></span>
                  <span class="saturno-color-label">${cfg.label}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="saturno-field">
            <label class="saturno-label">TAGS (comma separated)</label>
            <input type="text" class="saturno-input" id="saturno-tags" placeholder="research, important, book">
          </div>

          <div class="saturno-destinations">
            <label class="saturno-checkbox">
              <input type="checkbox" id="saturno-to-nexus" checked>
              <span>Send to NEXUS</span>
            </label>
            <label class="saturno-checkbox">
              <input type="checkbox" id="saturno-to-notion" checked>
              <span>Send to Notion</span>
            </label>
          </div>
        </div>

        <div class="saturno-modal-footer">
          <button class="saturno-btn saturno-btn-secondary" id="saturno-cancel">Cancel</button>
          <button class="saturno-btn saturno-btn-primary" id="saturno-save">
            <span id="saturno-save-text">Capture</span>
            <span id="saturno-save-loading" style="display:none;">Saving...</span>
          </button>
        </div>

        <div class="saturno-toast" id="saturno-toast"></div>
      </div>
    `;

    document.body.appendChild(captureModal);

    // Event listeners
    captureModal.querySelector('.saturno-modal-backdrop').addEventListener('click', hideCaptureModal);
    captureModal.querySelector('.saturno-modal-close').addEventListener('click', hideCaptureModal);
    captureModal.querySelector('#saturno-cancel').addEventListener('click', hideCaptureModal);
    captureModal.querySelector('#saturno-save').addEventListener('click', saveCapture);

    // Category/Color buttons
    captureModal.querySelectorAll('.saturno-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        captureModal.querySelectorAll('.saturno-color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (captureModal.style.display === 'flex') {
        if (e.key === 'Escape') hideCaptureModal();
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveCapture();
      }
    });
  }

  function showCaptureModal() {
    if (!captureModal) createCaptureModal();

    const selection = window.getSelection().toString().trim();
    if (!selection) return;

    lastSelection = selection;
    hideFloatingButton();

    captureModal.querySelector('#saturno-preview').textContent = selection;
    captureModal.querySelector('#saturno-tags').value = '';
    captureModal.querySelectorAll('.saturno-color-btn').forEach((b, i) => {
      b.classList.toggle('active', i === 0);
    });

    // Load settings
    chrome.runtime.sendMessage({ action: 'getSettings' }, (settings) => {
      const notionCheckbox = captureModal.querySelector('#saturno-to-notion');
      const hasNotion = settings.notionToken && settings.notionDatabaseId;
      notionCheckbox.checked = hasNotion && settings.notionEnabled !== false;
      notionCheckbox.disabled = !hasNotion;

      const nexusCheckbox = captureModal.querySelector('#saturno-to-nexus');
      nexusCheckbox.checked = settings.nexusEnabled !== false;
    });

    captureModal.style.display = 'flex';
    captureModal.querySelector('#saturno-tags').focus();
  }

  function hideCaptureModal() {
    if (captureModal) {
      captureModal.style.display = 'none';
    }
  }

  async function saveCapture() {
    const saveBtn = captureModal.querySelector('#saturno-save');
    const saveText = captureModal.querySelector('#saturno-save-text');
    const saveLoading = captureModal.querySelector('#saturno-save-loading');

    saveBtn.disabled = true;
    saveText.style.display = 'none';
    saveLoading.style.display = 'inline';

    const category = captureModal.querySelector('.saturno-color-btn.active').dataset.cat;
    const tagsInput = captureModal.querySelector('#saturno-tags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

    const data = {
      content: lastSelection,
      category: category,
      tags: tags,
      source: window.location.href,
      title: document.title
    };

    try {
      const results = await chrome.runtime.sendMessage({ action: 'capture', data: data });

      let message = 'Captured!';
      if (results.nexus?.error) message += ' (NEXUS failed)';
      if (results.notion?.error) message += ' (Notion failed)';

      showToast(message, !results.nexus?.error && !results.notion?.error);

      setTimeout(hideCaptureModal, 1000);
    } catch (error) {
      showToast('Error: ' + error.message, false);
    }

    saveBtn.disabled = false;
    saveText.style.display = 'inline';
    saveLoading.style.display = 'none';
  }

  function showToast(message, success = true) {
    const toast = captureModal.querySelector('#saturno-toast');
    toast.textContent = message;
    toast.className = 'saturno-toast show ' + (success ? 'success' : 'error');

    setTimeout(() => {
      toast.className = 'saturno-toast';
    }, 3000);
  }

  // ═══════════════════════════════════════════════════════════════
  // SELECTION LISTENER
  // ═══════════════════════════════════════════════════════════════

  document.addEventListener('mouseup', (e) => {
    // Don't show if clicking on our elements
    if (e.target.closest('#saturno-capture-btn') || e.target.closest('#saturno-capture-modal')) {
      return;
    }

    setTimeout(() => {
      const selection = window.getSelection().toString().trim();

      if (selection.length > 0) {
        showFloatingButton(e.pageX, e.pageY);
      } else {
        hideFloatingButton();
      }
    }, 10);
  });

  document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('#saturno-capture-btn')) {
      hideFloatingButton();
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // MESSAGE HANDLER
  // ═══════════════════════════════════════════════════════════════

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelection') {
      const selection = window.getSelection().toString().trim();
      sendResponse({ text: selection });
    }

    if (request.action === 'captureComplete') {
      // Could show a notification on the page
      console.log('Capture complete:', request.capture);
    }
  });

  // Initialize
  createFloatingButton();

})();

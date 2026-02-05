/**
 * Task List - Hub Sidebar Widget
 * Shares saturno-command-tasks with command.html
 */
(function() {
  const KEY = 'saturno-command-tasks';

  const SEED = [
    { id: 1, title: 'Finish Bonus Vault - 50 PDFs', status: 'progress', priority: 'p0', project: 'bonus-vault', due: null, tags: [] },
    { id: 2, title: 'Build 30 Working Tools', status: 'todo', priority: 'p0', project: 'bonus-vault', due: null, tags: [] },
    { id: 3, title: 'Deploy Hub + Command', status: 'todo', priority: 'p1', project: 'tools', due: null, tags: [] },
    { id: 4, title: 'Fix Calisthenics Ecosystem nav', status: 'todo', priority: 'p1', project: 'tools', due: null, tags: [] },
    { id: 5, title: 'Verify Chrome extension sync', status: 'todo', priority: 'p2', project: 'tools', due: null, tags: [] }
  ];

  function load() {
    try {
      const s = localStorage.getItem(KEY);
      const tasks = s ? JSON.parse(s) : [];
      if (tasks.length === 0) {
        save(SEED);
        return SEED;
      }
      return tasks;
    } catch (e) { return []; }
  }

  function save(tasks) {
    try {
      localStorage.setItem(KEY, JSON.stringify(tasks));
      if (window.parent !== window) window.parent.postMessage({ type: 'saturno-tasks-updated' }, '*');
    } catch (e) {}
  }

  function addTask(title, category) {
    const tasks = load();
    const id = Math.max(0, ...tasks.map(t => t.id)) + 1;
    const priority = category === 'emergency' ? 'p0' : category === 'priority' ? 'p1' : 'p3';
    tasks.push({
      id, title: title.trim(), status: 'todo', priority, project: 'saturno-hq',
      due: null, tags: []
    });
    save(tasks);
    return tasks;
  }

  function toggleTask(id) {
    const tasks = load();
    const t = tasks.find(x => x.id === id);
    if (t) {
      t.status = t.status === 'done' ? 'todo' : 'done';
      save(tasks);
    }
    return tasks;
  }

  function render(container) {
    if (!container) return;
    const tasks = load();
    const emergency = tasks.filter(t => t.priority === 'p0' && t.status !== 'done');
    const priority = tasks.filter(t => t.priority === 'p1' && t.status !== 'done');
    const backlog = tasks.filter(t => !['p0','p1'].includes(t.priority || '') && t.status !== 'done');

    container.innerHTML = `
      <div class="task-list-add">
        <input type="text" placeholder="+ Quick add" id="hub-task-input" />
      </div>
      <div class="task-list-sections">
        <div class="task-list-section">
          <div class="task-list-section-header" data-section="emergency">Emergency <span class="count">${emergency.length}</span></div>
          <div class="task-list-items">${emergency.slice(0,5).map(t => item(t)).join('') || '<span class="task-list-empty">None</span>'}</div>
        </div>
        <div class="task-list-section">
          <div class="task-list-section-header" data-section="priority">Priority <span class="count">${priority.length}</span></div>
          <div class="task-list-items">${priority.slice(0,5).map(t => item(t)).join('') || '<span class="task-list-empty">None</span>'}</div>
        </div>
        <div class="task-list-section">
          <div class="task-list-section-header" data-section="backlog">Backlog <span class="count">${backlog.length}</span></div>
          <div class="task-list-items">${backlog.slice(0,5).map(t => item(t)).join('') || '<span class="task-list-empty">None</span>'}</div>
        </div>
      </div>
    `;

    function item(t) {
      const done = t.status === 'done';
      return `<div class="task-list-item" data-id="${t.id}">
        <span class="task-list-check ${done ? 'checked' : ''}" data-id="${t.id}"></span>
        <span class="task-list-title ${done ? 'strike' : ''}">${escapeHtml(t.title)}</span>
      </div>`;
    }

    container.querySelectorAll('.task-list-check').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        toggleTask(+el.dataset.id);
        render(container);
      });
    });

    const input = container.querySelector('#hub-task-input');
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && input.value.trim()) {
          addTask(input.value, 'backlog');
          input.value = '';
          render(container);
        }
      });
    }

    container.querySelectorAll('.task-list-section-header').forEach(h => {
      h.addEventListener('click', () => {
        const items = h.nextElementSibling;
        items.classList.toggle('collapsed');
      });
    });
  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  window.HubTaskList = { load, save, addTask, toggleTask, render };
})();

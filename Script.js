(function () {

  // ============ NAVIGATION ============
  const navLinks = document.querySelectorAll('[data-section]');
  const sections = document.querySelectorAll('.section');

  function showSection(sectionId) {
    sections.forEach(function(section) {
      section.classList.remove('active');
    });
    navLinks.forEach(function(link) {
      link.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    const activeLink = document.querySelector('[data-section="' + sectionId + '"]');
    if (activeLink) activeLink.classList.add('active');
    if (sectionId === 'dashboard') renderDashboard();
  }

  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      showSection(section);
    });
  });

  // ============ STORAGE ============
  const STORAGE_KEY = 'campus_planner_tasks';

  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function loadTasks() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  // ============ STATE ============
  let tasks = loadTasks();

  function generateId() {
    const count = tasks.length + 1;
    return 'task_' + String(count).padStart(4, '0');
  }

  function addTask(taskData) {
    const now = new Date().toISOString();
    const newTask = {
      id: generateId(),
      title: taskData.title,
      dueDate: taskData.dueDate,
      duration: Number(taskData.duration),
      tag: taskData.tag,
      createdAt: now,
      updatedAt: now
    };
    tasks.push(newTask);
    saveTasks(tasks);
  }

  function deleteTask(id) {
    tasks = tasks.filter(function(task) {
      return task.id !== id;
    });
    saveTasks(tasks);
  }

  function updateTask(id, taskData) {
    tasks = tasks.map(function(task) {
      if (task.id === id) {
        return {
          ...task,
          title: taskData.title,
          dueDate: taskData.dueDate,
          duration: Number(taskData.duration),
          tag: taskData.tag,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    });
    saveTasks(tasks);
  }

  // ============ VALIDATORS ============
  const patterns = {
    title: /^\S(?:.*\S)?$/,
    duration: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    dueDate: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    duplicateWord: /\b(\w+)\s+\1\b/i
  };

  function validateTitle(value) {
    if (value.trim() === '') return 'Title is required';
    if (!patterns.title.test(value)) return 'Title cannot have leading or trailing spaces';
    if (patterns.duplicateWord.test(value)) return 'Title has a duplicate word';
    return '';
  }

  function validateDuration(value) {
    if (value.trim() === '') return 'Duration is required';
    if (!patterns.duration.test(value)) return 'Enter a valid number e.g. 90 or 1.5';
    return '';
  }

  function validateDueDate(value) {
    if (value.trim() === '') return 'Due date is required';
    if (!patterns.dueDate.test(value)) return 'Enter a valid date in YYYY-MM-DD format';
    return '';
  }

  function validateTag(value) {
    if (value.trim() === '') return 'Tag is required';
    if (!patterns.tag.test(value)) return 'Tag can only have letters, spaces or hyphens';
    return '';
  }

  function showError(fieldId, message) {
    const errorEl = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message;
  }

  function clearErrors() {
    showError('title-error', '');
    showError('due-error', '');
    showError('duration-error', '');
    showError('tag-error', '');
  }

  // ============ FORM ============
  const titleInput = document.getElementById('task-title');
  const dueInput = document.getElementById('task-due');
  const durationInput = document.getElementById('task-duration');
  const tagInput = document.getElementById('task-tag');
  const editIdInput = document.getElementById('edit-task-id');
  const formHeading = document.getElementById('form-heading');

  function clearForm() {
    titleInput.value = '';
    dueInput.value = '';
    durationInput.value = '';
    tagInput.value = '';
    editIdInput.value = '';
    formHeading.textContent = 'Add Task';
    clearErrors();
  }

  document.getElementById('save-task-btn').addEventListener('click', function () {
    const titleVal = titleInput.value;
    const dueVal = dueInput.value;
    const durationVal = durationInput.value;
    const tagVal = tagInput.value;

    const titleErr = validateTitle(titleVal);
    const dueErr = validateDueDate(dueVal);
    const durationErr = validateDuration(durationVal);
    const tagErr = validateTag(tagVal);

    showError('title-error', titleErr);
    showError('due-error', dueErr);
    showError('duration-error', durationErr);
    showError('tag-error', tagErr);

    if (titleErr || dueErr || durationErr || tagErr) return;

    const taskData = {
      title: titleVal,
      dueDate: dueVal,
      duration: durationVal,
      tag: tagVal
    };

    const editId = editIdInput.value;

    if (editId) {
      updateTask(editId, taskData);
    } else {
      addTask(taskData);
    }

    clearForm();
    showSection('tasks');
    renderTasks();
  });

  document.getElementById('cancel-task-btn').addEventListener('click', function () {
    clearForm();
    showSection('tasks');
  });

  titleInput.addEventListener('input', function () {
    showError('title-error', validateTitle(this.value));
  });

  durationInput.addEventListener('input', function () {
    showError('duration-error', validateDuration(this.value));
  });

  tagInput.addEventListener('input', function () {
    showError('tag-error', validateTag(this.value));
  });

  // ============ SEARCH & SORT ============
  function getFilteredTasks() {
    const query = document.getElementById('search-input').value;
    const caseSensitive = document.getElementById('case-toggle').checked;
    const sortVal = document.getElementById('sort-select').value;

    let filtered = tasks.slice();

    if (query) {
      try {
        const flags = caseSensitive ? '' : 'i';
        const regex = new RegExp(query, flags);
        filtered = filtered.filter(function(task) {
          return regex.test(task.title) || regex.test(task.tag);
        });
      } catch (e) {
        filtered = tasks.slice();
      }
    }

    filtered.sort(function(a, b) {
      if (sortVal === 'dueDate-asc') return a.dueDate.localeCompare(b.dueDate);
      if (sortVal === 'dueDate-desc') return b.dueDate.localeCompare(a.dueDate);
      if (sortVal === 'title-asc') return a.title.localeCompare(b.title);
      if (sortVal === 'title-desc') return b.title.localeCompare(a.title);
      if (sortVal === 'duration-asc') return a.duration - b.duration;
      if (sortVal === 'duration-desc') return b.duration - a.duration;
      return 0;
    });

    return filtered;
  }

  function highlight(text, query, caseSensitive) {
    if (!query) return text;
    try {
      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(query, flags);
      return text.replace(regex, function(m) {
        return '<mark>' + m + '</mark>';
      });
    } catch (e) {
      return text;
    }
  }

  // ============ RENDER TASKS ============
  function renderTasks() {
    const container = document.getElementById('tasks-container');
    const query = document.getElementById('search-input').value;
    const caseSensitive = document.getElementById('case-toggle').checked;
    const filtered = getFilteredTasks();

    if (filtered.length === 0) {
      container.innerHTML = '<p>No tasks found.</p>';
      return;
    }

    let html = '<table><thead><tr><th>Title</th><th>Due Date</th><th>Duration</th><th>Tag</th><th>Actions</th></tr></thead><tbody>';

    filtered.forEach(function(task) {
      const title = highlight(task.title, query, caseSensitive);
      const tag = highlight(task.tag, query, caseSensitive);
      html += '<tr>';
      html += '<td>' + title + '</td>';
      html += '<td>' + task.dueDate + '</td>';
      html += '<td>' + task.duration + ' min</td>';
      html += '<td>' + tag + '</td>';
      html += '<td><button data-id="' + task.id + '" class="btn-edit">Edit</button> <button data-id="' + task.id + '" class="btn-delete">Delete</button></td>';
      html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    document.querySelectorAll('.btn-edit').forEach(function(btn) {
      btn.addEventListener('click', function() {
        editTask(this.getAttribute('data-id'));
      });
    });

    document.querySelectorAll('.btn-delete').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (confirm('Delete this task?')) {
          deleteTask(this.getAttribute('data-id'));
          renderTasks();
        }
      });
    });
  }

  function editTask(id) {
    const task = tasks.find(function(t) { return t.id === id; });
    if (!task) return;
    titleInput.value = task.title;
    dueInput.value = task.dueDate;
    durationInput.value = task.duration;
    tagInput.value = task.tag;
    editIdInput.value = task.id;
    formHeading.textContent = 'Edit Task';
    showSection('add-task');
  }

  // DASHBOARD 
  function renderDashboard() {
    const total = tasks.length;
    const totalDuration = tasks.reduce(function(sum, t) {
      return sum + t.duration;
    }, 0);

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-duration').textContent = totalDuration + ' min';
  }

  // ============ SETTINGS ============
  function loadSettings() {
    const unit = localStorage.getItem('campus_unit') || 'minutes';
    const cap = localStorage.getItem('campus_cap') || '';
    const unitSelect = document.getElementById('unit-select');
    const capInput = document.getElementById('cap-input');
    if (unitSelect) unitSelect.value = unit;
    if (capInput) capInput.value = cap;
  }

  document.getElementById('save-cap-btn').addEventListener('click', function () {
    const cap = document.getElementById('cap-input').value;
    if (cap) {
      localStorage.setItem('campus_cap', cap);
      document.getElementById('import-status').textContent = 'Target saved!';
    }
  });

  document.getElementById('unit-select').addEventListener('change', function () {
    localStorage.setItem('campus_unit', this.value);
  });

  document.getElementById('export-btn').addEventListener('click', function () {
    const data = JSON.stringify(tasks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campus-tasks.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('import-file').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) {
          document.getElementById('import-status').textContent = 'Invalid file format.';
          return;
        }
        const valid = imported.every(function(t) {
          return t.id && t.title && t.dueDate && t.duration && t.tag;
        });
        if (!valid) {
          document.getElementById('import-status').textContent = 'Some records are missing fields.';
          return;
        }
        tasks = imported;
        saveTasks(tasks);
        renderTasks();
        document.getElementById('import-status').textContent = 'Imported ' + tasks.length + ' tasks successfully!';
      } catch (e) {
        document.getElementById('import-status').textContent = 'Error reading file.';
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('clear-data-btn').addEventListener('click', function () {
    if (confirm('Are you sure? This will delete all your tasks.')) {
      tasks = [];
      saveTasks(tasks);
      renderTasks();
      document.getElementById('import-status').textContent = 'All data cleared.';
    }
  });

  loadSettings();

  // INIT 
  renderTasks();

  const searchInput = document.getElementById('search-input');
  const caseToggle = document.getElementById('case-toggle');
  const sortSelect = document.getElementById('sort-select');

  if (searchInput) searchInput.addEventListener('input', renderTasks);
  if (caseToggle) caseToggle.addEventListener('change', renderTasks);
  if (sortSelect) sortSelect.addEventListener('change', renderTasks);

})();
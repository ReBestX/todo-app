(function () {
  "use strict";

  const input = document.getElementById("new-task");
  const addBtn = document.getElementById("add-task-btn");
  const list = document.getElementById("task-list");

  const STORAGE_KEY = "todo.tasks";
  let tasks = [];

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch (_) {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (_) {}
  }

  function uid() {
    return `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
  }

  function renderAll() {
    list.innerHTML = "";
    for (const t of tasks) {
      list.appendChild(createTaskItem(t));
    }
  }

  function createTaskItem(task) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!task.completed;
    checkbox.setAttribute("aria-label", "Mark task as complete");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.type = "button";
    delBtn.textContent = "Delete";
    delBtn.setAttribute("aria-label", `Delete task: ${task.text}`);

    if (task.completed) li.classList.add("completed");

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    return li;
  }

  function addTaskFromInput() {
    const text = input.value.trim();
    if (!text) return;

    const task = { id: uid(), text, completed: false };
    tasks.push(task);
    saveTasks();

    const li = createTaskItem(task);
    list.appendChild(li);

    input.value = "";
    input.focus();
  }

  addBtn.addEventListener("click", addTaskFromInput);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTaskFromInput();
    }
  });

  list.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches('input[type="checkbox"]')) {
      const li = target.closest("li");
      if (!li) return;
      const id = li.dataset.id;
      const checked = /** @type {HTMLInputElement} */ (target).checked;
      li.classList.toggle("completed", checked);

      const t = tasks.find((x) => x.id === id);
      if (t) {
        t.completed = checked;
        saveTasks();
      }
      return;
    }

    if (target.matches("button.delete-btn")) {
      const li = target.closest("li");
      if (!li) return;
      const id = li.dataset.id;
      li.remove();
      tasks = tasks.filter((x) => x.id !== id);
      saveTasks();
    }
  });

  tasks = loadTasks();
  renderAll();
})();

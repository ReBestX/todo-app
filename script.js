(function () {
  "use strict";

  const input = document.getElementById("new-task");
  const addBtn = document.getElementById("add-task-btn");
  const list = document.getElementById("task-list");

  // task handler (button click or Enter key)
  function addTaskFromInput() {
    const text = input.value.trim();
    if (!text) return;

    const li = createTaskItem(text);
    list.appendChild(li);

    input.value = "";
    input.focus();
  }

  function createTaskItem(text) {
    const li = document.createElement("li");
    li.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", "Mark task as complete");

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = text;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.type = "button";
    delBtn.textContent = "Delete";
    delBtn.setAttribute("aria-label", `Delete task: ${text}`);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    return li;
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
      if (li) li.classList.toggle("completed", target.checked);
      return;
    }

    if (target.matches("button.delete-btn")) {
      const li = target.closest("li");
      if (li) li.remove();
    }
  });
})();

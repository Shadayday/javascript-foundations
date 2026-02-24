console.log("script.js loaded");

const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");

let tasks = [];

// Edit state
let editingIndex = null;
let editingText = "";

// -------------------- Storage helpers --------------------
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (!savedTasks) return;

  const parsed = JSON.parse(savedTasks);

  // Upgrade old format (array of strings) to new format (array of objects)
  tasks = parsed.map((t) => {
    if (typeof t === "string") {
      return { text: t, completed: false };
    }
    return t;
  });

  saveTasks();
}

// -------------------- Edit helpers --------------------
function cancelEdit() {
  editingIndex = null;
  editingText = "";
  renderTasks();
}

function saveEdit(index, newText) {
  const cleaned = newText.trim();
  if (cleaned === "") return;

  // Prevent duplicates when editing (ignore current item)
  const duplicate = tasks.some((t, i) => {
    return i !== index && t.text.toLowerCase() === cleaned.toLowerCase();
  });

  if (duplicate) {
    alert("That task already exists.");
    return;
  }

  tasks[index].text = cleaned;
  saveTasks();

  editingIndex = null;
  editingText = "";
  renderTasks();
}

// -------------------- UI render --------------------
function renderTasks() {
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    // Left side container
    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "10px";
    left.style.flex = "1";

    // Checkbox (complete)
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    left.appendChild(checkbox);

    // Editing mode
    if (editingIndex === index) {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = editingText;
      editInput.style.flex = "1";

      // Save on Enter / Cancel on Esc
      editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          saveEdit(index, editInput.value);
        } else if (event.key === "Escape") {
          cancelEdit();
        }
      });

      left.appendChild(editInput);

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.addEventListener("click", () => saveEdit(index, editInput.value));

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.addEventListener("click", cancelEdit);

      li.appendChild(left);
      li.appendChild(saveBtn);
      li.appendChild(cancelBtn);
      list.appendChild(li);

      // Focus the input after it’s on the page
      setTimeout(() => editInput.focus(), 0);
      return;
    }

    // Normal view text
    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.6";
    }

    left.appendChild(span);

    // Right side buttons
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      editingIndex = index;
      editingText = task.text;
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      // If you delete the one you're editing, exit edit mode safely
      if (editingIndex === index) {
        editingIndex = null;
        editingText = "";
      }
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(left);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// -------------------- Add task --------------------
button.addEventListener("click", () => {
  const taskText = input.value.trim();
  if (taskText === "") return;

  const alreadyExists = tasks.some(
    (t) => t.text.toLowerCase() === taskText.toLowerCase()
  );

  if (alreadyExists) {
    alert("That task already exists.");
    input.value = "";
    return;
  }

  tasks.push({ text: taskText, completed: false });
  saveTasks();
  renderTasks();
  input.value = "";
});

// Enter key support for adding tasks
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    button.click();
  }
});

// -------------------- Start app --------------------
loadTasks();
renderTasks();
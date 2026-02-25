console.log("script.js loaded");

const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");

const filterAllBtn = document.getElementById("filterAllBtn");
const filterActiveBtn = document.getElementById("filterActiveBtn");
const filterCompletedBtn = document.getElementById("filterCompletedBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const clearAllBtn = document.getElementById("ClearAllBtn");
const stats = document.getElementById("stats")


let tasks = [];

// Edit state
let editingIndex = null;
let editingText = "";

let currentFilter = "all"; //"all" | "active" | "completed"

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

function swapTasks(i, j) {
  const temp = tasks [i];
  tasks[i] = tasks[j];
  tasks[j] = temp;
  saveTasks();
  renderTasks();
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

  // Stats
  const total = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = total - completedCount;
  stats.textContent = `${total} total - ${activeCount} active - ${completedCount} completed`;

  // Filtered view
  const visibleTasks = tasks
    .map((task, index) => ({task, index})) // keep original index for edit/delete
    .filter(({ task }) => {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter ==="completed") return task.completed;
      return true; // all
    });

  visibleTasks.forEach(({ task, index }) => {
    const li = document.createElement("li");

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "centre";
    left.style.gap = "10px";
    left.style.flex = "1";

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
      const editInput = document.createElement ("input");
      editInput.type = "text";
      editInput.value = editingText;
      editInput.style.flex = "1";

      editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") saveEdit(index, editInput.value);
        if (event.key === "Escape") cancelEdit();
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

      setTimeout(() => editInput.focus(), 0);
      return;
    }

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
      if (editingIndex === index) cancelEdit();
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    const upBtn =document.createElement("button");
    upBtn.textContent = "↑";
    upBtn.disabled = index === 0;
    upBtn.addEventListener("click", () => {
      swapTasks(index, index - 1);
    });

    const downBtn = document.createElement("button");
    downBtn.textContent = "↓";
    downBtn.disabled = index === tasks.length - 1;
    downBtn.addEventListener("click", () => {
      swapTasks(index, index + 1);
    });

    // after creating upBtn/downBtn and setting disabled = index ===...
    upBtn.disabled = upBtn.disabled || editingIndex !== null;
    downBtn.disabled = downBtn.disabled || editingIndex !== null;

    // Only show reorder buttons in "all" view
    if (currentFilter === "all"){
      li.appendChild(upBtn);
      li.appendChild(downBtn);
    }
    
    li.appendChild(left);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

filterAllBtn.addEventListener("click", () => {
  currentFilter = "all";
  renderTasks();
});

filterActiveBtn.addEventListener("click", () => {
  currentFilter = "active";
  renderTasks();
});

filterCompletedBtn.addEventListener("click", () => {
  currentFilter = "completed";
  renderTasks();
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();

  // If you were editing something that got removed, exit edit mode safely
  cancelEdit();
  renderTasks();
});
if (clearAllBtn) {
clearAllBtn.addEventListener("click", () => {
  if (tasks.length === 0) return;

  const ok = confirm("Clear all tasks? This cannot be undone.");
  if (!ok) return;

  tasks = [];
  saveTasks();
  cancelEdit(); // exits edit mode safely
  renderTasks();
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
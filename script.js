console.log("script.js loaded");
const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");

let tasks = [];

// Load saved tasks
const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    
}

//Render function
function renderTasks() {
    list.innerHTML = "";

    tasks.forEach(function (task, index) {
        const li = document.createElement("li");
        
        const span = document.createElement("span");
        span.textContent = task;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function () {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

//Initial render
renderTasks();

//Add task
button.addEventListener("click", function() {

// 1. Get the value from the input    
const taskText = input.value.trim();

// 2. If input is empty, do nothing
if (taskText === "") {
    return;

}

tasks.push(taskText);
console.log(taskText);
localStorage.setItem("tasks", JSON.stringify(tasks));
renderTasks();

// 3. Create a new <li> element
//const li = document.createElement("li");

// 4. Set the text of <li>
//li.textContent = taskText;

// 5. Append <li> to the list
//list.appendChild(li);

// 6. Clear the input
input.value = "";

});

//Enter key support
input.addEventListener("keydown", function(event){
    if (event.key=== "Enter") {
        button.click();
    }
});
const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");

let tasks = [];

// Load saved tasks
const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    
}

function renderTasks() {
    list.innerHTML = "";

    tasks.forEach(function (task) {
        const li = document.createElement("li");
        li.textContent = task;
        list.appendChild(li);
    });
}

renderTasks();

button.addEventListener("click", function() {

// 1. Get the value from the input    
const taskText = input.value.trim();

console.log(taskText);

// 2. If input is empty, do nothing
if (taskText === "") {
    return;

}

tasks.push(taskText);

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

input.addEventListener("keydown", function(event){
    if (event.key=== "Enter") {
        button.click();
    }
});

document.body.style.backgroundColor = "lightblue";


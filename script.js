const input = document.getElementById("taskInput");
const button = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");

button.addEventListener("click", function() {

// 1. Get the value from the input    
const taskText = input.value;

console.log(taskText);

// 2. If input is empty, do nothing
if (taskText === "") {
    return;

}

// 3. Create a new <li> element
const li = document.createElement("li");

// 4. Set the text of <li>
li.textContent = taskText;

// 5. Append <li> to the list
list.appendChild(li);

// 6. Clear the input
input.value = "";

});

input.addEventListener("keydown", function(event){
    if (event.key=== "Enter") {
        button.click();
    }
});



interface Todo{
    id:string; // task id
    task: string;
    completed: boolean; //
}

// store todo objects
let todo_array: Todo[] = [];
// what id or task to be deleted
let todo_delete: string | null = null;


const taskForm = document.getElementById('taskForm') as HTMLFormElement;
const taskInput = document.getElementById('taskinput') as HTMLInputElement;
const taskList = document.querySelector('.task-list') as HTMLUListElement;
const successMessage = document.getElementById('successMessage') as HTMLParagraphElement;
const confirmModel = document.getElementById('warning-message') as HTMLDivElement;
const confirmYes = document.getElementById('confirmYes') as HTMLButtonElement;
const confirmNo = document.getElementById('confirmNo') as HTMLButtonElement;

// function for Showing tasks from todo array
const displayTodos = (): void =>{
    // cleare the  task list
    taskList.innerHTML= '';

    todo_array.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'task';
        if(todo.completed)
            li.classList.add('completed');
        li.dataset.id = todo.id;

        const span = document.createElement('span')
        span.textContent = todo.task;

        const trashIcon = document.createElement('i');
        trashIcon.className = 'fa-solid fa-trash';

        // function for trash icon
        trashIcon.addEventListener('click', (e) =>{
            e.stopImmediatePropagation();
            taskDelete(todo.id);
        });

        li.addEventListener('dblclick', () => {
            ToggleComplete(todo.id)
        });

        li.appendChild(span);
        li.append(trashIcon);
        taskList.appendChild(li);
    });
};


// toggle task completeion
const ToggleComplete = (id: string): void => {
    const todo = todo_array.find(t => t.id === id);
    if(todo){
        todo.completed = !todo.completed;
        savedTodos();
        displayTodos();
    }
};


// task delete confirmation
const taskDelete = (id: string): void => {
    todo_delete = id;
    // displaying the error message
    confirmModel.style.display = 'block';

};

// hide model
const hideModel = (): void =>{
    todo_delete = null;
    confirmModel.style.display = 'none';
}

// confirm delete
const deleteTodo = (): void => {
    if(todo_delete){
        todo_array = todo_array.filter(t => t.id !== todo_delete)
        savedTodos();
        displayTodos();
        hideModel();
    }
};

// save todos to localStorage
const savedTodos = (): void => {
    localStorage.setItem('todo_array', JSON.stringify(todo_array));
    // displayTodos();
};

//  load todos to loaclStorage
const loadTodos = (): void => {
    const stored = localStorage.getItem('todo_array')
    if (stored) {
        todo_array = JSON.parse(stored);
    }
    displayTodos();
};

// show Temporary success message
const showSuccessMessage = (message: string): void => {
    successMessage.textContent = message;
    successMessage.style.color='green';
    setTimeout(() => {
        successMessage.textContent = '';
    }, 2000);
};

// Handle form submission

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    if(taskText){
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            task: taskText,
            completed: false
        };
        todo_array.push(newTodo);
        savedTodos();
        displayTodos();
        taskInput.value = '';
        showSuccessMessage('Task added successfully!');
    }
    else{
        successMessage.textContent = "Please enter a task.";
        successMessage.style.color = "red";
    }
});


// Modal events
confirmYes.addEventListener('click', deleteTodo);
confirmNo.addEventListener('click', hideModel);
confirmModel.addEventListener('click', (e) => {
    if (e.target === confirmModel) hideModel();
});

// Initial load
document.addEventListener('DOMContentLoaded', loadTodos);



import "./styles.css";
import '../node_modules/modern-normalize';
import { Task, Project, ProjectList } from "./taskData.js";
import { getLocalData, setLocalData } from "./manageData.js";

const projectList = document.getElementById("projectList");
const taskList = document.getElementById("TaskList");

const projectMenu = document.getElementById("projectMenu");
const projectForm = document.getElementById("projectForm");
const projectFormTitle = document.getElementById("projectFormTitle");
const projectNameField = document.getElementById("projectName");
const projectSubmit = document.getElementById("projectSubmit");
const projectEdit = document.getElementById("projectEdit");

const TaskMenu = document.getElementById("TaskMenu");
const taskForm = document.getElementById("TaskForm");
const taskFormTitle = document.getElementById("taskFormTitle");
const taskNameField = document.getElementById("taskName");
const taskDescField = document.getElementById("taskDesc");
const taskDueField = document.getElementById("taskDueDate");
const taskPriorityField = document.getElementById("taskPriority");
const taskSubmit = document.getElementById("taskSubmit");
const taskEdit = document.getElementById("taskEdit");

//Uses task form fields to run addNewProject(), closes form
projectSubmit.addEventListener("click", function() {
    if (!projectForm.checkValidity()) {
        alert("Please fill out all required fields.");
    }
    else {
        addNewProject(projectNameField.value);
        projectMenu.close();
        selectedProject = findLastUndeletedProject();
        updateDOM();
    }
    
});

//Uses project form field to run editProject on selected project, closes form
projectEdit.addEventListener("click", function() {
    if (!projectForm.checkValidity()) {
        alert("Please fill out all required fields.");
    }
    else {
        editProject(projectNameField.value);
        projectMenu.close();
        updateDOM();
    }
    
});


//Uses task form fields to run addNewTask(), closes form
taskSubmit.addEventListener("click", function() {
    if (!taskForm.checkValidity()) {
        alert("Please fill out all required fields.");
    }
    else {
        addNewTask(taskNameField.value, taskDescField.value, taskDueField.value, taskPriorityField.value);
        selectedTask = findLastUndeletedTask();
        TaskMenu.close();
        updateDOM();
    }
    
});

//Uses task form field to run editTask() on selected task, closes form
taskEdit.addEventListener("click", function() {
    if (!taskForm.checkValidity()) {
        alert("Please fill out all required fields.");
    }
    else {
        editTask(taskNameField.value, taskDescField.value, taskDueField.value, taskPriorityField.value);;
        TaskMenu.close();
        updateDOM();
    }
    
});


//test data
//creates 2 projects with 2 tasks in the default project and 1 task in the 2nd project



// const defaultProjectList = new ProjectList();
// const defaultProject = new Project("Default Project");
// defaultProjectList.addProject(defaultProject);
// const project2 = new Project("Project 2");
// defaultProjectList.addProject(project2);
// const defaultTask = new Task("Task 1", "Some info", "2026-01-21", "high");
// defaultProject.addTask(defaultTask);
// const task2 = new Task("Task 2", "Second Task", "", "medium");
// defaultProject.addTask(task2);
// const task3 = new Task("Task 3", "Third Task", "2026-05-21", "low");
// project2.addTask(task3);


const defaultProjectList = getLocalData();
console.log("fadsfsdfas");
console.log(defaultProjectList);

let selectedProject = findFirstUndeletedProject();
let selectedTask = findFirstUndeletedTask();

updateDOM();


function updateDOM() {
    //Clear existing entries
    projectList.replaceChildren();
    taskList.replaceChildren();

    //Check if project list is empty
    if (defaultProjectList.projects.filter(proj => proj.isDeleted === false).length === 0) {
            const noProjectsMsg = document.createElement("div");
            noProjectsMsg.classList.add("projectEntry");
            noProjectsMsg.textContent = "No projects available. Please add a new project.";
            projectList.appendChild(noProjectsMsg);
    }

    //Generate list of undeleted projects
    for (const project in defaultProjectList.projects) {
        if (defaultProjectList.projects[project].isDeleted === false) {
            //create project box for each project
            const projectBox = document.createElement("div");
            projectBox.classList.add("projectEntry");

            //change colour if selected
            if (project == selectedProject) {
                projectBox.classList.add("selected");
            }

            const projectTitle = document.createElement("h3");
            projectTitle.textContent = defaultProjectList.projects[project].name;
            projectBox.appendChild(projectTitle);

            //add icons for edit and delete
            const projectIcons = document.createElement("div");
            projectIcons.classList.add("icons");
            const editIcon = document.createElement("span");
            editIcon.classList.add("editIcon");
            editIcon.textContent = "Edit";
            projectIcons.appendChild(editIcon);
            const deleteIcon = document.createElement("span");
            deleteIcon.classList.add("deleteIcon");
            deleteIcon.textContent = "Del";
            projectIcons.appendChild(deleteIcon);


            //Selects project, unselects task
            projectBox.addEventListener('click', function() {
                selectedProject = project;
                selectedTask = "";
                updateDOM();
            });
            

            //Event listeners for edit, sets project form up to edit selected project
            editIcon.addEventListener("click", function(event) {
                selectedProject = project;
                projectFormTitle.textContent = "Edit Project";
                projectSubmit.style.display = "none";
                projectEdit.style.display = "block";
                projectMenu.showModal();
                projectNameField.value = defaultProjectList.projects[selectedProject].name;
            });

            //Event listeners for delete
            deleteIcon.addEventListener("click", function(event) {
                defaultProjectList.projects[project].deleteThis();
                if (selectedProject == project) {
                    selectedProject = findFirstUndeletedProject();
                };
                event.stopPropagation();
                updateDOM();
            });

            //apend icons to project box and project box to project list
            projectBox.appendChild(projectIcons);
            projectList.appendChild(projectBox);
        }
    }
    
    //add field for adding new project, sets form up to create project on click
    const addProjectBox = document.createElement("div");
    addProjectBox.classList.add("newProjectEntry", "projectEntry");
    addProjectBox.textContent = "+ Add New Project";
    addProjectBox.addEventListener("click", function() {
        projectFormTitle.textContent = "Create Project";
        projectSubmit.style.display = "block";
        projectEdit.style.display = "none";
        projectMenu.showModal();
        //Open window to add new project
    });
    projectList.appendChild(addProjectBox);

    //Update Task List (set to only show tasks of default project)
    if (defaultProjectList.projects[selectedProject].tasks.filter(tsk => tsk.isDeleted === false).length === 0) {
            const noTasksMsg = document.createElement("div");
            noTasksMsg.classList.add("taskEntry");
            noTasksMsg.textContent = "No tasks available. Please add a new task.";
            taskList.appendChild(noTasksMsg);
    }
    for (const task in defaultProjectList.projects[selectedProject].tasks) {
        const thisTask = defaultProjectList.projects[selectedProject].tasks[task];
        if (thisTask.isDeleted === false) {
            const taskBox = document.createElement("div");
            taskBox.classList.add("taskEntry");

            const taskBoxMain = document.createElement("div");
            taskBoxMain.classList.add("taskMain");
            taskBox.appendChild(taskBoxMain);

            //Add extra information if selected
            if (task == selectedTask) {

                const taskDescBox = document.createElement("div");
                taskDescBox.textContent = thisTask.desc;
                taskDescBox.classList.add("taskDescBox");
                taskBox.appendChild(taskDescBox);

                taskBox.classList.add("selected");
                const taskBoxExt = document.createElement("div");
                taskBoxExt.classList.add("taskExt");
                taskBox.appendChild(taskBoxExt);             

                const taskPriority = document.createElement("div");
                taskPriority.textContent = capitalizeFirstLetter(thisTask.priority);
                taskPriority.classList.add(thisTask.priority);
                taskBoxExt.appendChild(taskPriority);
                
                if (thisTask.dueDate) {
                    const taskDueDate = document.createElement("div");
                    taskDueDate.textContent = thisTask.dueDate;
                    taskBoxExt.appendChild(taskDueDate);
                    console.log(thisTask.dueDate);
                }
            }

            const taskCompleteButton = document.createElement("input");
            taskCompleteButton.type = "checkbox";
            taskCompleteButton.checked = thisTask.isDone;

            taskCompleteButton.addEventListener("click", function(event) {
                thisTask.toggleDone();
                console.log(thisTask);
                setLocalData(defaultProjectList);
                event.stopPropagation();
                updateDOM();
            })
            taskBoxMain.appendChild(taskCompleteButton);

            const taskTitle = document.createElement("h3");
            taskTitle.textContent = thisTask.name;
            taskBoxMain.appendChild(taskTitle);

            if (thisTask.isDone == true) {
                taskTitle.classList.add("done");
            }

            const taskIcons = document.createElement("div");
            taskIcons.classList.add("icons");

            //To replace "del" and "edit" text with icons later
            const editIcon = document.createElement("span");
            editIcon.classList.add("editIcon");
            editIcon.textContent = "Edit";
            taskIcons.appendChild(editIcon);
            const deleteIcon = document.createElement("span");
            deleteIcon.classList.add("deleteIcon");
            deleteIcon.textContent = "Del";
            taskIcons.appendChild(deleteIcon);
            taskBoxMain.appendChild(taskIcons); 

            //Select task
            taskBox.addEventListener('click', function() {
                selectedTask = task;
                updateDOM();
            });

            //Opens task menu, sets as edit and prefills fields with existing data
            editIcon.addEventListener("click", function(event) {
                console.log("edit button clicked")
                selectedTask = task;
                taskFormTitle.textContent = "Edit Task";
                taskSubmit.style.display = "none";
                taskEdit.style.display = "block";
                TaskMenu.showModal();
                taskNameField.value = thisTask.name;
                taskDescField.value = thisTask.detail;
                taskDueField.value = thisTask.dueDate;
                taskPriorityField.value = thisTask.priority;
                event.stopPropagation();
                updateDOM();
            });

            //Deletes currently selected task
            //TODO: need to add confirmation dialog
            deleteIcon.addEventListener("click", function(event) {
                if (confirm(`Are you sure you want to delete task ${thisTask.name}?`)) {
                    thisTask.deleteThis();
                    selectedTask = null;
                }
                event.stopPropagation();
                updateDOM();
            });

            taskList.appendChild(taskBox);
        }
    }

    //add field for adding new task
    const addTaskBox = document.createElement("div");
    addTaskBox.classList.add("taskEntry", "newTaskEntry");
    addTaskBox.textContent = "+ Add New Task";

    //Opens task form, sets up as create task
    addTaskBox.addEventListener("click", function() {
        console.log("Add Task clicked");
        TaskMenu.showModal();
        taskFormTitle.textContent = "Create Task";
        taskSubmit.style.display = "block";
        taskEdit.style.display = "none";
    });

    taskList.appendChild(addTaskBox);
}

//Creates new project in defaultProjectList, clears all form fields
function addNewProject(name) {
    const newProject = new Project(name);
    defaultProjectList.addProject(newProject);
    setLocalData(defaultProjectList);
    projectNameField.value = "";
    
}

//Creates new task in currently selected project, clears all form fields
function addNewTask(name, desc, dueDate, priority) {
    console.log(`Adding new task: ${name}, ${desc}, ${dueDate}, ${priority}`);
    const newTask = new Task(name, desc, dueDate, priority);
    defaultProjectList.projects[selectedProject].addTask(newTask);
    setLocalData(defaultProjectList);
    taskNameField.value = "";
    taskDescField.value = "";
    taskDueField.value = "";
    taskPriorityField.value = "low";
}

//Edits currently selected project, clears all form fields
function editProject(newName) {
    defaultProjectList.projects[selectedProject].editName(newName);
    setLocalData(defaultProjectList);
    projectNameField.value = "";
}
//Edits currently selected task, clears all form fields
function editTask(name, desc, dueDate, priority) {
    defaultProjectList.projects[selectedProject].tasks[selectedTask].editTask(name, desc, dueDate, priority);
    setLocalData(defaultProjectList);
    //clear all fields
    taskNameField.value = "";
    taskDescField.value = "";
    taskDueField.value = "";
    taskPriorityField.value = "low";
}

//finds first selected project
function findFirstUndeletedProject() {
    for (const project in defaultProjectList.projects) {
        if (defaultProjectList.projects[project].isDeleted === false) {
            return project;
        }
    }
    return null;
}

//find last project available (used when creating new project)
function findLastUndeletedProject() {
    for (let i = defaultProjectList.projects.length - 1; i >= 0; i--) {
        if (defaultProjectList.projects[i].isDeleted === false) {
            return i;
        }
    }
    return null;
}

//find last task available (used when creating a new task)
function findLastUndeletedTask() {
    const tasks = defaultProjectList.projects[selectedProject].tasks;
    console.log(tasks)
    for (let i = tasks.length - 1; i >= 0; i--) {
        if (tasks[i].isDeleted === false) {
            return i;
            console.log(i)
        }
    }
    return null;
}

//finds first selected task
function findFirstUndeletedTask() {
    for (const task in defaultProjectList.projects[selectedProject].tasks) {
        if (defaultProjectList.projects[selectedProject].tasks.isDeleted === false) {
            return task;
        }
    }
}

//Return capitalised string
function capitalizeFirstLetter(string) {
  if (string.length === 0) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
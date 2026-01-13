class Entry {
    constructor(name, isDeleted = false) {
        this.name = name;
        this.isDeleted = isDeleted;
    }

    deleteThis() {
        console.log("Deleting entry: " + this.name);
        this.isDeleted = true;
    }
}


class Task extends Entry {
    constructor(name, desc, dueDate, priority, isDone = false, isDeleted = false) {
        super(name, isDeleted);
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isDone = isDone;
    }

    toggleDone() {
        this.isDone = !this.isDone;
    }
    
    editTask(name, desc, dueDate, priority) {
        this.name = name;
        this.detail = desc;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

class Project extends Entry {
    constructor(name, isDeleted = false) {
        super(name, isDeleted);
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }
    editName(newName) {
        this.name = newName;
    }   
}

class ProjectList {
    constructor() {
        this.projects = [];
    }
    
    addProject(project) {
        this.projects.push(project);
    }
}

export { Task, Project, ProjectList };
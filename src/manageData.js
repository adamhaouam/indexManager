import { Task, Project, ProjectList } from "./taskData.js";

export function getLocalData() {
    let restoredProjectList;
    if (storageAvailable("localStorage") && localStorage.projectList) {

        const exportedProjectList = JSON.parse(localStorage.projectList);
        console.log(exportedProjectList);
        restoredProjectList = new ProjectList();
        for (let project in exportedProjectList.projects) {
            console.log(`Project ${project}!!!!`);
            let thisProject = exportedProjectList.projects[project];
            const restoredProject = new Project(thisProject.name, thisProject.isDeleted);
            restoredProjectList.addProject(restoredProject);
            for (let task in thisProject.tasks) {
                const thisTask = thisProject.tasks[task];
                const restoredTask = new Task(thisTask.name, thisTask.desc, thisTask.dueDate, thisTask.priority, thisTask.isDone, thisTask.isDeleted);
                restoredProject.addTask(restoredTask);
            }
        }


        // console.log("Exporting test data");
        // defaultProjectList = new ProjectList();
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
    }
    else {
        restoredProjectList = new ProjectList();
        const defaultProject = new Project("Default Project");
        restoredProjectList.addProject(defaultProject);
    }
    return restoredProjectList;
}

export function setLocalData(projectList) {
    console.log(projectList);
    localStorage.projectList = JSON.stringify(projectList);
}

//Check if data is supported and available
//Copied from mdn web storage api page
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}
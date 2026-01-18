import { BasicListing, AdvListing, DataSet } from "./listData.js";


export function getLocalData() {
	let restoredData;
	if (storageAvailable("localStorage") && localStorage.dataSet) {
		//create new array with objects
		// console.log(localStorage.dataSet);
		const rawData = JSON.parse(localStorage.dataSet);
		restoredData = new DataSet();
		for (const lvl1Index in rawData.listings) {
			const thisRawLvl1Listing = rawData.listings[lvl1Index];
			const newLvl1Listing = new BasicListing(thisRawLvl1Listing.name, thisRawLvl1Listing.isDeleted);
			restoredData.addListing(newLvl1Listing);
			for (const lvl2Index in thisRawLvl1Listing.listings) {
				const thisRawLvl2Listing = thisRawLvl1Listing.listings[lvl2Index];
				const newLvl2Listing = new BasicListing(thisRawLvl2Listing.name, thisRawLvl2Listing.isDeleted);
				newLvl1Listing.addListing(newLvl2Listing);
				for (const lvl3Index in thisRawLvl2Listing.listings) {
					const thisRawLvl3Listing = thisRawLvl2Listing.listings[lvl3Index];
					const newLvl3Listing = new AdvListing(thisRawLvl3Listing.name, thisRawLvl3Listing.desc, thisRawLvl3Listing.status, thisRawLvl3Listing.isDeleted);
					newLvl2Listing.addListing(newLvl3Listing);
				}
			}
			//TODO: add conversion for 2nd and 3rd levels. Need to add "add listing" feature first to better test this
		}
	}
	else {
		restoredData = new DataSet();
		const defaultListing = new BasicListing("Default Listing");
		restoredData.addListing(defaultListing);
	}
	return restoredData;
}

export function setLocalData(dataSet) {
	console.log(dataSet);
	localStorage.dataSet = JSON.stringify(dataSet);
}

export function getLocalData1() {
	let restoredProjectList;
	if (storageAvailable("localStorage") && localStorage.projectList) {
		const exportedProjectList = JSON.parse(localStorage.projectList);
		console.log(exportedProjectList);
		restoredProjectList = new ProjectList();
		for (let project in exportedProjectList.projects) {
			console.log(`Project ${project}!!!!`);
			let thisProject = exportedProjectList.projects[project];
			const restoredProject = new Project(
				thisProject.name,
				thisProject.isDeleted,
			);
			restoredProjectList.addProject(restoredProject);
			for (let task in thisProject.tasks) {
				const thisTask = thisProject.tasks[task];
				const restoredTask = new Task(
					thisTask.name,
					thisTask.desc,
					thisTask.dueDate,
					thisTask.priority,
					thisTask.isDone,
					thisTask.isDeleted,
				);
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
	} else {
		restoredProjectList = new ProjectList();
		const defaultProject = new Project("Default Project");
		restoredProjectList.addProject(defaultProject);
	}
	return restoredProjectList;
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

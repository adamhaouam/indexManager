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
			const newLvl1Listing = new BasicListing(
				thisRawLvl1Listing.name,
				String(thisRawLvl1Listing.index),
				thisRawLvl1Listing.isDeleted,
			);
			restoredData.addListing(newLvl1Listing);
			for (const lvl2Index in thisRawLvl1Listing.listings) {
				const thisRawLvl2Listing =
					thisRawLvl1Listing.listings[lvl2Index];
				const newLvl2Listing = new BasicListing(
					thisRawLvl2Listing.name,
					String(thisRawLvl2Listing.index),
					thisRawLvl2Listing.isDeleted,
				);
				newLvl1Listing.addListing(newLvl2Listing);
				for (const lvl3Index in thisRawLvl2Listing.listings) {
					const thisRawLvl3Listing =
						thisRawLvl2Listing.listings[lvl3Index];
					const newLvl3Listing = new AdvListing(
						thisRawLvl3Listing.name,
						String(thisRawLvl3Listing.index),
						thisRawLvl3Listing.desc,
						thisRawLvl3Listing.status,
						thisRawLvl3Listing.isDeleted,
					);
					newLvl2Listing.addListing(newLvl3Listing);
				}
			}
			//TODO: add conversion for 2nd and 3rd levels. Need to add "add listing" feature first to better test this
		}
	} else {
		restoredData = new DataSet();
		const defaultListing = new BasicListing("Default Listing!", "0");
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

let dataSet;
const url = "https://api.jsonbin.io/v3/b/69701f4f43b1c97be93e0785";

//if !masterkey variable use public api else use private api with master key

//run after updating?
export async function fetchData() {
	try {
		const response = await fetch(url + "/latest", {
			method: "GET", // or "PATCH"
			headers: {
				Accept: "application/json",
			},
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const result = await response.json();
		dataSet = result.record;
		console.log("Receving: ", JSON.stringify(dataSet));
		console.log("Inside fetchdata function", dataSet.listings[0].name);
		return formatData(dataSet);
		//return formatData(dataSet);
	} catch (error) {
		console.error(error.message);
	}
}

function formatData(data) {
	const rawData = data;
	const restoredData = new DataSet();
	for (const lvl1Index in rawData.listings) {
		const thisRawLvl1Listing = rawData.listings[lvl1Index];
		const newLvl1Listing = new BasicListing(
			thisRawLvl1Listing.name,
			String(thisRawLvl1Listing.index),
			thisRawLvl1Listing.isDeleted,
		);
		restoredData.addListing(newLvl1Listing);
		for (const lvl2Index in thisRawLvl1Listing.listings) {
			const thisRawLvl2Listing = thisRawLvl1Listing.listings[lvl2Index];
			const newLvl2Listing = new BasicListing(
				thisRawLvl2Listing.name,
				String(thisRawLvl2Listing.index),
				thisRawLvl2Listing.isDeleted,
			);
			newLvl1Listing.addListing(newLvl2Listing);
			for (const lvl3Index in thisRawLvl2Listing.listings) {
				const thisRawLvl3Listing =
					thisRawLvl2Listing.listings[lvl3Index];
				const newLvl3Listing = new AdvListing(
					thisRawLvl3Listing.name,
					String(thisRawLvl3Listing.index),
					thisRawLvl3Listing.desc,
					thisRawLvl3Listing.status,
					thisRawLvl3Listing.isDeleted,
				);
				newLvl2Listing.addListing(newLvl3Listing);
			}
		}
	}
	return restoredData;
}

export async function postJSON(data) {
	try {
		const response = await fetch(url, {
			method: "PUT", // or "PATCH"
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		//get updated data back
		const result = await response.json();
		dataSet = result.record;
		return formatData(dataSet);
	} catch (error) {
		console.error(error.message);
	}
}

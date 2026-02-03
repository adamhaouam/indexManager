"use strict";
import "./styles.css";
import "../node_modules/modern-normalize";
import { BasicListing, AdvListing } from "./listData.js";
import { fetchData, postJSON } from "./manageData.js";

const basicMenu = document.getElementById("basicMenu");
const basicMenuTitle = document.getElementById("basicMenuTitle");
const basicMenuForm = document.getElementById("basicMenuForm");
const basicListingNameField = document.getElementById("basicListingName");
const basicSubmit = document.getElementById("basicSubmit");
const basicEdit = document.getElementById("basicEdit");
const basicCancel = document.getElementById("basicCancel");

const advMenu = document.getElementById("advMenu");
const advMenuTitle = document.getElementById("advMenuTitle");
const advMenuForm = document.getElementById("advMenuForm");
const advListingNameField = document.getElementById("advListingName");
const advListingDescField = document.getElementById("advListingDesc");
const advListingStatusField = document.getElementById("advListingStatus");
const advSubmit = document.getElementById("advSubmit");
const advEdit = document.getElementById("advEdit");
const advCancel = document.getElementById("advCancel");

const showDeletedButton = document.getElementById("showDeleted");
const refreshButton = document.getElementById("refresh");
const searchButton = document.getElementById("search");
const searchBar = document.getElementById("searchBar");


const lv1List = document.getElementById("lv1List");
const lv2List = document.getElementById("lv2List");
const lv3List = document.getElementById("lv3List");

//TODO: implement show deleted toggle
let showDeleted = false;

///Get data from local storage
let dataSet = null;

//get first undeleted
let selectedLvl1 = null;
let selectedLvl2 = null;
let selectedLvl3 = null;

let selectedLevel = 1;

//Initial load

loadPage();

async function loadPage() {
	//dataSet = getLocalData();
	dataSet = await fetchData();
	console.log("Data has been imported! lets update dom", dataSet);
	selectedLvl1 = findFirstUndeletedLvl1();
	updateDOM();
	console.log("DOM updated");
}

async function refreshData() {
	dataSet = await fetchData();
	console.log("Data has been re-imported! ", dataSet);
}

searchBar.addEventListener("keydown", findIndex);
searchButton.addEventListener("click", findIndex);

basicCancel.addEventListener("click", function () {
	basicMenu.close("cancel");
});

advCancel.addEventListener("click", function () {
	advMenu.close();
});

lv1List.addEventListener("click", function () {
	selectedLevel = 1;
});
lv2List.addEventListener("click", function () {
	selectedLevel = 2;
});
lv3List.addEventListener("click", function () {
	selectedLevel = 3;
});

showDeletedButton.addEventListener("change", function () {
	showDeleted = showDeletedButton.checked;
	updateDOM();
});

refreshButton.addEventListener("click", async function () {
	await refreshData();
	updateDOM();
});

advSubmit.addEventListener("click", function () {
	if (advListingNameField.value.trim() === "") {
		advListingNameField.setCustomValidity("Name cannot be empty.");
		advListingNameField.reportValidity();
		return;
	} else {
		advListingNameField.setCustomValidity("");
		addNewAdvListing(
			advListingNameField.value,
			advListingDescField.value,
			advListingStatusField.value,
		);
		advMenu.close();
	}
});

basicSubmit.addEventListener("click", function () {
	if (basicListingNameField.value.trim() === "") {
		basicListingNameField.setCustomValidity("Name cannot be empty.");
		basicListingNameField.reportValidity();
		return;
	} else {
		basicListingNameField.setCustomValidity("");
		addNewBasicListing(basicListingNameField.value);
		basicMenu.close();
	}
});

basicEdit.addEventListener("click", function () {
	if (basicListingNameField.value.trim() === "") {
		basicListingNameField.setCustomValidity("Name cannot be empty.");
		basicListingNameField.reportValidity();
		return;
	} else {
		basicListingNameField.setCustomValidity("");
		editBasicListing(basicListingNameField.value);
		basicMenu.close();
	}
});

advEdit.addEventListener("click", function () {
	if (advListingNameField.value.trim() === "") {
		advListingNameField.setCustomValidity("Name cannot be empty.");
		advListingNameField.reportValidity();
		return;
	} else {
		advListingNameField.setCustomValidity("");
		editAdvListing(
			advListingNameField.value,
			advListingDescField.value,
			advListingStatusField.value,
		);
		advMenu.close();
	}
});

async function addNewBasicListing(name) {
	await refreshData();
	if (selectedLevel == 1) {
		const newBasicListing = new BasicListing(
			name,
			dataSet.listings.length + 1,
		);
		dataSet.addListing(newBasicListing);
		selectedLvl1 = findLastUndeletedLvl1();
		selectedLvl2 = null;
		selectedLvl3 = null;
	} else {
		const newBasicListing = new BasicListing(
			name,
			dataSet.listings[selectedLvl1].listings.length + 1,
		);
		dataSet.listings[selectedLvl1].addListing(newBasicListing);
		selectedLvl2 = findLastUndeletedLvl2();
		console.log("Selected lvl2:", selectedLvl2);
		selectedLvl3 = null;
	}
	console.log("posting json", dataSet);
	postJSON(dataSet);
	updateDOM();
}

async function addNewAdvListing(name, description, status) {
	await refreshData();
	const newAdvListing = new AdvListing(
		name,
		dataSet.listings[selectedLvl1].listings[selectedLvl2].listings.length +
			1,
		description,
		status,
	);
	dataSet.listings[selectedLvl1].listings[selectedLvl2].addListing(
		newAdvListing,
	);
	selectedLvl3 = findLastUndeletedLvl3();
	console.log("posting json", dataSet);
	postJSON(dataSet);
	updateDOM();
}

async function editBasicListing(newName) {
	await refreshData();
	if (selectedLevel == 1) {
		dataSet.listings[selectedLvl1].editName(newName);
	} else if (selectedLevel == 2) {
		dataSet.listings[selectedLvl1].listings[selectedLvl2].editName(newName);
	}
	console.log("posting json", dataSet);
	postJSON(dataSet);
	updateDOM();
}

async function editAdvListing(newName, newDesc, newStatus) {
	await refreshData();
	dataSet.listings[selectedLvl1].listings[selectedLvl2].listings[
		selectedLvl3
	].editTask(newName, newDesc, newStatus);
	console.log("posting json", dataSet);
	postJSON(dataSet);
	updateDOM();
}

function findFirstUndeletedLvl1() {
	for (const listing in dataSet.listings) {
		if (dataSet.listings[listing].isDeleted === false) {
			return listing;
		}
	}
	return null;
}
function findFirstUndeletedLvl2() {
	const lvl1Listings = dataSet.listings[selectedLvl1].listings;
	for (const listing in lvl1Listings) {
		if (lvl1Listings[listing].isDeleted === false) {
			return listing;
		}
	}
	return null;
}
function findFirstUndeletedLvl3() {
	const lvl2Listings =
		dataSet.listings[selectedLvl1].listings[selectedLvl2].listings;
	for (const listing in lvl2Listings) {
		if (lvl2Listings[listing].isDeleted === false) {
			return listing;
		}
	}
	return null;
}

function findLastUndeletedLvl1() {
	for (let i = dataSet.listings.length - 1; i >= 0; i--) {
		if (dataSet.listings[i].isDeleted === false) {
			return i;
		}
	}
	return null;
}
function findLastUndeletedLvl2() {
	const lvl1Listings = dataSet.listings[selectedLvl1].listings;
	for (let i = lvl1Listings.length - 1; i >= 0; i--) {
		if (lvl1Listings[i].isDeleted === false) {
			return i;
		}
	}
	return null;
}
function findLastUndeletedLvl3() {
	const lvl2Listings =
		dataSet.listings[selectedLvl1].listings[selectedLvl2].listings;
	for (let i = lvl2Listings.length - 1; i >= 0; i--) {
		if (lvl2Listings[i].isDeleted === false) {
			return i;
		}
	}
	return null;
}

function toggleDeleteThis(listingItem) {
	listingItem.toggleDelete();
	postJSON(dataSet);
	updateDOM();
}

function updateDOM() {
	//Clear existing entries
	lv1List.replaceChildren();
	lv2List.replaceChildren();
	lv3List.replaceChildren();

	//Generate Level 1

	if (
		dataSet.listings.filter((listing) => listing.isDeleted == false)
			.length === 0
	) {
		const noList = document.createElement("div");
		noList.classList.add("listing");
		noList.textContent = "List empty. Please add a new item.";
		lv1List.appendChild(noList);
	} else {
		for (const listing in dataSet.listings) {
			const thisListing = dataSet.listings[listing];
			if (showDeleted || !thisListing.isDeleted) {
				const thisListingBox = createListing(thisListing, listing);
				if (listing == selectedLvl1) {
					thisListingBox.classList.add("selected");
				}
				thisListingBox.addEventListener("click", function () {
					selectedLvl1 = listing;
					selectedLvl2 = null;
					selectedLvl3 = null;
					updateDOM();
				});
				lv1List.appendChild(thisListingBox);
			}
		}

		//Generate Level 2
		if (
			dataSet.listings[selectedLvl1].listings.filter(
				(listing) => listing.isDeleted == false,
			).length === 0
		) {
			const noList = document.createElement("div");
			noList.classList.add("listing");
			noList.textContent = "List empty. Please add a new item.";
			lv2List.appendChild(noList);
		} else {
			for (const listing in dataSet.listings[selectedLvl1].listings) {
				const thisListing =
					dataSet.listings[selectedLvl1].listings[listing];
				if (showDeleted || !thisListing.isDeleted) {
					const thisListingBox = createListing(thisListing, listing);
					if (listing == selectedLvl2) {
						thisListingBox.classList.add("selected");
					}
					thisListingBox.addEventListener("click", function () {
						selectedLvl2 = listing;
						selectedLvl3 = null;
						updateDOM();
					});
					lv2List.appendChild(thisListingBox);
				}
			}
			if (selectedLvl2 != null) {
				if (
					dataSet.listings[selectedLvl1].listings[
						selectedLvl2
					].listings.filter((listing) => listing.isDeleted == false)
						.length == 0
				) {
					const noList = document.createElement("div");
					noList.classList.add("listing");
					noList.textContent = "List empty. Please add a new item.";
					lv3List.appendChild(noList);
				} else {
					//Generate Level 3
					for (const listing in dataSet.listings[selectedLvl1]
						.listings[selectedLvl2].listings) {
						const thisListing =
							dataSet.listings[selectedLvl1].listings[
								selectedLvl2
							].listings[listing];
						if (showDeleted || !thisListing.isDeleted) {
							const thisListingBox = createListing(
								thisListing,
								listing,
							);
							if (listing == selectedLvl3) {
								thisListingBox.classList.add("selected");
								//TODO show extra details
							}
							thisListingBox.addEventListener(
								"click",
								function () {
									selectedLvl3 = listing;
									updateDOM();
								},
							);
							lv3List.appendChild(thisListingBox);
						}
					}
				}
				lv3List.appendChild(createAddListingBox(3));
			}
		}

		lv2List.appendChild(createAddListingBox(2));
	}

	lv1List.appendChild(createAddListingBox(1));
	// console.log(selectedLvl1, selectedLvl2, selectedLvl3);
	// console.log(dataSet);
}

function createListing(listingItem) {
	const listingBox = document.createElement("div");
	listingBox.classList.add("listing");
	const mainInfo = document.createElement("div");
	const listingTitle = document.createElement("h3");
	listingTitle.textContent = listingItem.name;
	mainInfo.appendChild(listingTitle);

	const index = document.createElement("button");
	index.textContent = "#" + listingItem.index;
	index.classList.add("index");
	index.addEventListener("click", function () {
		console.log("Clicked index:", selectedLvl1, selectedLvl2, selectedLvl3);
		if (listingItem instanceof AdvListing) {
			alert(
				`"${dataSet.listings[selectedLvl1].index}-${dataSet.listings[selectedLvl1].listings[selectedLvl2].index}-${listingItem.index}" copied to clipboard.`,
			);
			navigator.clipboard.writeText(
				`${dataSet.listings[selectedLvl1].index}-${dataSet.listings[selectedLvl1].listings[selectedLvl2].index}-${listingItem.index}`,
			);
		} else if (selectedLevel == 1) {
			alert(`"${listingItem.index}" has been copied to clipboard.`);
			navigator.clipboard.writeText(listingItem.index);
		} else if (selectedLevel == 2) {
			alert(
				`"${dataSet.listings[selectedLvl1].index}-${listingItem.index}" copied to clipboard.`,
			);
			navigator.clipboard.writeText(
				`${dataSet.listings[selectedLvl1].index}-${listingItem.index}`,
			);
		}
	});
	mainInfo.appendChild(index);

	const iconsBox = document.createElement("div");
	iconsBox.classList.add("icons");
	const editIcon = document.createElement("span");
	editIcon.classList.add("editIcon");
	editIcon.textContent = "Edit";
	iconsBox.appendChild(editIcon);
	const deleteIcon = document.createElement("span");
	deleteIcon.classList.add("deleteIcon");
	if (listingItem.isDeleted) {
		deleteIcon.textContent = "Recover";
	} else {
		deleteIcon.textContent = "Del";
	}
	iconsBox.appendChild(deleteIcon);
	mainInfo.appendChild(iconsBox);
	mainInfo.classList.add("mainInfo");
	listingBox.appendChild(mainInfo);

	if (listingItem.isDeleted) {
		listingBox.classList.add("deleted");
	}

	if (listingItem instanceof AdvListing) {
		const extraInfo = document.createElement("div");
		extraInfo.classList.add("extraInfo");
		const listingDesc = document.createElement("div");
		listingDesc.textContent = listingItem.desc;
		listingDesc.classList.add("description");
		extraInfo.appendChild(listingDesc);
		const listingStatus = document.createElement("p");
		listingStatus.classList.add(listingItem.status);
		listingStatus.textContent = {
			notStarted: "Not Started",
			inProgress: "In Progress",
			draftCompleted: "Draft Completed",
			reviewed: "Reviewed",
			sentBack: "Sent Back",
			approved: "Approved",
			completed: "Completed",
		}[listingItem.status];
		if (listingItem.status == "completed")
			listingTitle.classList.add("done");
		//listingStatus.textContent = `Status: ${listingItem.status}`;
		extraInfo.appendChild(listingStatus);
		listingBox.appendChild(extraInfo);
	}

	editIcon.addEventListener("click", function () {
		if (listingItem instanceof AdvListing) {
			advListingNameField.value = listingItem.name;
			advListingDescField.value = listingItem.desc;
			advListingStatusField.value = listingItem.status;
			advMenuTitle.textContent = "Edit Item";
			advEdit.style.display = "block";
			advSubmit.style.display = "none";
			advMenu.showModal();
		} else if (listingItem instanceof BasicListing) {
			basicListingNameField.value = listingItem.name;
			basicMenuTitle.textContent = "Edit Item";
			basicSubmit.style.display = "none";
			basicEdit.style.display = "block";
			basicMenu.showModal();
		}
	});

	deleteIcon.addEventListener("click", async function (event) {
		if (confirm(`Are you sure?`)) {
			if (listingItem.isDeleted) {
				console.log("Deleted item:", listingItem.name);
				if (selectedLevel == 1) {
					selectedLvl1 = findFirstUndeletedLvl1();
					selectedLvl2 = null;
					selectedLvl3 = null;
				} else if (selectedLevel == 2) {
					selectedLvl2 = findFirstUndeletedLvl2();
					selectedLvl3 = null;
				} else if (selectedLevel == 3) {
					selectedLvl3 = findFirstUndeletedLvl3();
				}
			}
			toggleDeleteThis(listingItem);
			event.stopPropagation();
		}
	});

	return listingBox;
}

function createAddListingBox(level) {
	const addListingBox = document.createElement("div");
	addListingBox.classList.add("listing", "addListing");
	addListingBox.textContent = "Add new Item";
	addListingBox.addEventListener("click", function () {
		//Hide edit button, show save button, empty fields
		if (level == 1 || level == 2) {
			basicSubmit.style.display = "block";
			basicEdit.style.display = "none";
			basicListingNameField.value = "";
			basicMenu.showModal();
		} else if (level == 3) {
			advSubmit.style.display = "block";
			advEdit.style.display = "none";
			advListingNameField.value = "";
			advListingDescField.value = "";
			advListingStatusField.value = "notStarted";
			advMenu.showModal();
		}
	});
	return addListingBox;
}

function findIndex(event) {
	if (event.key == "Enter" || event.button == 0) {
		console.log(event.button);
		event.preventDefault();
		console.log("Searching for index:", searchBar.value);
		if (searchBar.validity.patternMismatch) {
			alert("Invalid index format. Please use XX-XX-XX format.");
		} else {
			const indexParts = searchBar.value.split("-");
			selectedLevel = 3;
			if (
				dataSet.listings[parseInt(indexParts[0]) - 1] != undefined &&
				dataSet.listings[parseInt(indexParts[0]) - 1].listings[
					parseInt(indexParts[1]) - 1
				] != undefined &&
				dataSet.listings[parseInt(indexParts[0]) - 1].listings[
					parseInt(indexParts[1]) - 1
				].listings[parseInt(indexParts[2]) - 1] != undefined
			) {
				console.log("Found it!");
				selectedLvl1 = parseInt(indexParts[0]) - 1;
				selectedLvl2 = parseInt(indexParts[1]) - 1;
				selectedLvl3 = parseInt(indexParts[2]) - 1;
			} else alert("Index not found");

			updateDOM();
		}
	}
}

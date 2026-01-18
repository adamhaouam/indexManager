"use strict"
import "./styles.css";
import "../node_modules/modern-normalize";
import { BasicListing, AdvListing, DataSet } from "./listData.js";
import { getLocalData, setLocalData } from "./manageData.js";

const basicMenu = document.getElementById("basicMenu");
const basicMenuTitle = document.getElementById("basicMenuTitle");
const basicMenuForm = document.getElementById("basicMenuForm");
const basicListingNameField = document.getElementById("basicListingName");
const basicSubmit = document.getElementById("basicSubmit");
const basicEdit = document.getElementById("basicEdit");

const advMenu = document.getElementById("advMenu");
const advMenuTitle = document.getElementById("advancedMenuTitle");
const advMenuForm = document.getElementById("advancedMenuForm");
const advListingNameField = document.getElementById("advListingName");
const advListingDescField = document.getElementById("advListingDesc");
const advListingStatusField = document.getElementById("advListingStatus");
const advSubmit = document.getElementById("advSubmit");
const advEdit = document.getElementById("advEdit");

const lv1List = document.getElementById("lv1List");
const lv2List = document.getElementById("lv2List");
const lv3List = document.getElementById("lv3List");


//get first undeleted
let selectedLvl1 = 0;
let selectedLvl2;
let selectedLvl3;
// function findFirstUndeletedLvl1() {
// }


let selectedLevel = 1;
lv1List.addEventListener("click", function () {
    selectedLevel = 1;
})
lv2List.addEventListener("click", function () {
    selectedLevel = 2;
});
lv3List.addEventListener("click", function () {
    selectedLevel = 3;
});


const saveDataButton = document.getElementById("saveData");
saveDataButton.addEventListener("click", function () {
    setLocalData(dataSet);
    console.log("saved!", dataSet);
});


advSubmit.addEventListener("click", function () {
    addNewAdvListing(advListingNameField.value, advListingDescField.value, advListingStatusField.value);
    advMenu.close();
    updateDOM();
});


basicSubmit.addEventListener("click", function () {
    addNewBasicListing(basicListingNameField.value);
    basicMenu.close();
    updateDOM();
});

basicEdit.addEventListener("click", function () {
    editBasicListing(basicListingNameField.value);
    basicMenu.close();
    updateDOM();
});

advEdit.addEventListener("click", function () {
    editAdvListing(advListingNameField.value, advListingDescField.value, advListingStatusField.value);
    advMenu.close();
    updateDOM();
});

function addNewBasicListing(name) {
    const newBasicListing = new BasicListing(name);
    console.log(selectedLvl1, selectedLvl2, selectedLvl3);
    if (selectedLevel == 1) {
        dataSet.addListing(newBasicListing);
        selectedLvl1 = findLastUndeletedLvl1();
        selectedLvl2 = null;
        selectedLvl3 = null;
    } 
    else {
        dataSet.listings[selectedLvl1].addListing(newBasicListing);
        selectedLvl2 = findLastUndeletedLvl2();
        selectedLvl3 = null;
    }
}

function addNewAdvListing(name, description, status) {
    const newAdvListing = new AdvListing(name, description, status);
    console.log(selectedLvl1, selectedLvl2, selectedLvl3);
    dataSet.listings[selectedLvl1].listings[selectedLvl2].addListing(newAdvListing);
    selectedLvl3 = findLastUndeletedLvl3();
}

function editBasicListing(newName) {
    if (selectedLevel == 1) {
        dataSet.listings[selectedLvl1].editName(newName);
    }
    else if (selectedLevel == 2) {
        dataSet.listings[selectedLvl1].listings[selectedLvl2].editName(newName);
    }
}

function editAdvListing(newName, newDesc, newStatus) {
    dataSet.listings[selectedLvl1].listings[selectedLvl2].listings[selectedLvl3].editTask(newName, newDesc, newStatus);
}


///Get data from local storage
const dataSet = getLocalData();

//TODO: implement show deleted toggle
let showDeleted = false;

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
    const lvl2Listings = dataSet.listings[selectedLvl1].listings[selectedLvl2].listings;
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
    const lvl2Listings = dataSet.listings[selectedLvl1].listings[selectedLvl2].listings;
    for (let i = lvl2Listings.length - 1; i >= 0; i--) {
        if (lvl2Listings[i].isDeleted === false) {
            return i;
        }
    }
    return null;
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
				const thisListingBox = createListing(thisListing);
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
					const thisListingBox = createListing(thisListing);
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
            console.log(dataSet.listings[selectedLvl1].listings[0], selectedLvl2);
            if (selectedLvl2) {
                if (
                    dataSet.listings[selectedLvl1].listings[
                        selectedLvl2
                    ].listings.filter((listing) => listing.isDeleted == false)
                        .length === 0
                ) {
                    const noList = document.createElement("div");
                    noList.classList.add("listing");
                    noList.textContent = "List empty. Please add a new item.";
                    lv3List.appendChild(noList);
                } else {
                    //Generate Level 3
                    for (const listing in dataSet.listings[selectedLvl1].listings[
                        selectedLvl2
                    ].listings) {
                        const thisListing =
                            dataSet.listings[selectedLvl1].listings[selectedLvl2]
                                .listings[listing];
                        if (showDeleted || !thisListing.isDeleted) {
                            const thisListingBox = createListing(thisListing);
                            if (listing == selectedLvl3) {
                                thisListingBox.classList.add("selected");
                                //TODO show extra details
                            }
                            thisListingBox.addEventListener("click", function () {
                                selectedLvl3 = listing;
                                updateDOM();
                            });
                            lv3List.appendChild(thisListingBox);
                        }
                    }
                }
                lv3List.appendChild(createAddListingBox(3));
            }
    }
        
        lv2List.appendChild(createAddListingBox(2));
	}
    //TODO add field for adding new project
    
    lv1List.appendChild(createAddListingBox(1));
    console.log(selectedLvl1, selectedLvl2, selectedLvl3);
}

function createListing(listingItem) {
	const listingBox = document.createElement("div");
	listingBox.classList.add("listing");
	const listingTitle = document.createElement("h3");
	listingTitle.textContent = listingItem.name;
	listingBox.appendChild(listingTitle);
	const iconsBox = document.createElement("div");
	iconsBox.classList.add("icons");
	const editIcon = document.createElement("span");
	editIcon.classList.add("editIcon");
	editIcon.textContent = "Edit";
	iconsBox.appendChild(editIcon);
	const deleteIcon = document.createElement("span");
	deleteIcon.classList.add("deleteIcon");
	deleteIcon.textContent = "Del";
	iconsBox.appendChild(deleteIcon);
	listingBox.appendChild(iconsBox);

	editIcon.addEventListener("click", function () {
        if (listingItem instanceof AdvListing) {
            advListingNameField.value = listingItem.name;
            advListingDescField.value = listingItem.desc;
            advListingStatusField.value = listingItem.status;
            advMenuTitle.textContent = "Edit Item";
            advEdit.style.display = "block";
            advSubmit.style.display = "none";
            advMenu.showModal();
        }
        else if (listingItem instanceof BasicListing) {
            basicListingNameField.value = listingItem.name;
            basicMenuTitle.textContent = "Edit Item";
            basicSubmit.style.display = "none";
            basicEdit.style.display = "block";
            basicMenu.showModal();
        }
	});

	deleteIcon.addEventListener("click", function (event) {
		if (
			confirm(`Are you sure you want to delete task ${listingItem.name}?`)
		) {
			listingItem.deleteThis();
            if (selectedLevel == 1) {
                selectedLvl1 = findFirstUndeletedLvl1();
                selectedLvl2 = null;
                selectedLvl3 = null;
            }
            else if (selectedLevel == 2) {
                selectedLvl2 = findFirstUndeletedLvl2();
                selectedLvl3 = null;
            }
            else if (selectedLevel == 3) {
                selectedLvl3 = findFirstUndeletedLvl3();
            }
		}
		event.stopPropagation();
		updateDOM();
	});

	return listingBox;
}


function createAddListingBox(level) {
    const addListingBox = document.createElement("div");
    addListingBox.classList.add("listing", "addListing");
    addListingBox.textContent = "Add new Item"; 
    addListingBox.addEventListener("click", function () {
        console.log("Add Item clicked");
        //Hide edit button, show save button, empty fields
        if (level == 1 || level == 2) {
            basicSubmit.style.display = "block";
            basicEdit.style.display = "none";
            basicListingNameField.value = "";
            basicMenu.showModal();
        }
        else if (level == 3) {
            advSubmit.style.display = "block";
            advEdit.style.display = "none";
            advListingNameField.value = "";
            advListingDescField.value = "";
            advListingStatusField.value = "";
            advMenu.showModal();
        }
    });
    return addListingBox;
}

updateDOM();

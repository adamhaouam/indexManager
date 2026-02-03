import { BasicListing, AdvListing, DataSet } from "./listData.js";

// Load config at runtime
let apiKey = "";
apiKey = prompt("Enter master key (leave blank for public access):");
console.log(apiKey, "is the master key provided.");

//if !apiKey variable use public api else use private api with master key
let url;

// if (dataState) {
// 	console.log("Data state from env is:", dataState);
// }
// else {
// 	console.log("No data state found in env, defaulting to 'dev'.");
// }
if (apiKey != "" && apiKey !== null && apiKey !== undefined) {
	url = "https://api.jsonbin.io/v3/b/697ebec7d0ea881f4097c4ea"; //private api with master key
} else {
	url = "https://api.jsonbin.io/v3/b/697ebf1843b1c97be95c5938"; //public api
}

let dataSet;

export async function fetchData() {
	if (apiKey) {
		try {
			const response = await fetch(url + "/latest", {
				method: "GET", // or "PATCH"
				headers: {
					Accept: "application/json",
					"X-Master-Key":
						"$2a$10$VdvVArXAoaUPHq3wzuP2vOlAinRb4M1DAj0VCU07ptQjTvKNqrpZi",
				},
			});
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			const result = await response.json();
			dataSet = result.record;
			return formatData(dataSet);
		} catch (error) {
			console.error(error.message);
		}
	} else {
		try {
			const response = await fetch(url + "/latest", {
				method: "GET",
				headers: {
					Accept: "application/json",
				},
			});
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			const result = await response.json();
			dataSet = result.record;
			return formatData(dataSet);
		} catch (error) {
			console.error(error.message);
		}
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
	if (apiKey) {
		try {
			const response = await fetch(url, {
				method: "PUT", // or "PATCH"
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"X-Master-Key":
						"$2a$10$VdvVArXAoaUPHq3wzuP2vOlAinRb4M1DAj0VCU07ptQjTvKNqrpZi",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`);
			}

			//get updated data back
			const result = await response.json();
			dataSet = result.record;
			console.log("fadfds", dataSet);
			return formatData(dataSet);
		} catch (error) {
			console.error(error.message);
		}
	} else {
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
			console.log("fadfds", dataSet);
			return formatData(dataSet);
		} catch (error) {
			console.error(error.message);
		}
	}
}

class Listing {
	constructor(name, isDeleted = false) {
		this.name = name;
		this.isDeleted = isDeleted;
	}

	deleteThis() {
		console.log("Deleting entry: " + this.name);
		this.isDeleted = true;
	}
}

class BasicListing extends Listing {
	constructor(name, isDeleted = false) {
		super(name, isDeleted);
		this.listings = [];
	}

	addListing(listing) {
		this.listings.push(listing);
	}
	editName(newName) {
		this.name = newName;
	}
}

class AdvListing extends Listing {
	constructor(name, desc, status, isDeleted = false) {
		super(name, isDeleted);
		this.desc = desc;
		this.status = status;
	}

	editTask(name, desc, status) {
		this.name = name;
		this.desc = desc;
		this.status = status;
	}
}

class DataSet {
	constructor() {
		this.listings = [];
	}

	addListing(listing) {
		this.listings.push(listing);
	}
}

export { BasicListing, AdvListing, DataSet };

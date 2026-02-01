class Listing {
	constructor(name, index, isDeleted = false) {
		this.name = name;
		this.isDeleted = isDeleted;
		this.index = this.formatIndex(index);
	}

	formatIndex(index) {
		const indexStr = String(index);
		return indexStr.length === 1 ? "0" + indexStr : indexStr;
	}

	getIndex() {
		return this.index;
	}

	toggleDelete() {
		console.log("Toggling delete status for entry: " + this.name + " from " + this.isDeleted + " to " + !this.isDeleted);
		this.isDeleted = !this.isDeleted;
		console.log(this.name, " new isDeleted status: ", this.isDeleted);
	}
}

class BasicListing extends Listing {
	constructor(name, index, isDeleted = false, listings = []) {
		super(name, index, isDeleted);
		this.listings = listings;
	}

	addListing(listing) {
		this.listings.push(listing);
	}
	editName(newName) {
		this.name = newName;
	}
}

class AdvListing extends Listing {
	constructor(name, index, desc, status = "notStarted", isDeleted = false) {
		super(name, index, isDeleted);
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

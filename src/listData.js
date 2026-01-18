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

    deleteThis() {
        console.log("Deleting entry: " + this.name);
        this.isDeleted = true;
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
	constructor(name, index, desc, status, isDeleted = false) {
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

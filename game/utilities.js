function random(from, to) {
	return _.random(from, to);
}

function boundify(item) {
	if (typeof item.collisionBox != "undefined") {
		return item.collisionBox();
	} else {
		return item;
	}
}

/**
 * Finds all non self-self pairs with no duplicates
 */
function pairs(items) {
	var pairs = [];

	for (var a = 0; a < items.length; a++) {
		for (var b = a + 1; b < items.length; b++) {
			pairs.push([items[a], items[b]]);
		}
	}

	return pairs;
}

// Find out which items are beside eachother
function findAdjacent(items, border) {

	var adjacent = [];

	var p = pairs(items);

	for (var pair of p) {
		var [itemA, itemB] = pair;

		var boundsA = boundify(itemA);
		var boundsB = boundify(itemB);

		boundsA = expand(boundsA, border);
		boundsB = expand(boundsB, border);

		if (overlap(boundsA, boundsB)) {
			adjacent.push([itemA, itemB]);
		}
	}

	return adjacent;

}

function expand(item, amount) {
	item[0] -= amount;
	item[1] -= amount;
	item[2] += amount;
	item[3] += amount;

	return item;
}

/**
 * Check for overlap
 */
function overlap(itemA, itemB) {

	var [Ax, Ay, Aw, Ah] = itemA;
	var [Bx, By, Bw, Bh] = itemB;
	return !((Ax + Aw) < Bx || Ax > (Bx + Bw) || (Ay + Ah) < By || Ay > (By + Bh));

}

function collides(item, items) {
	var sides = [];

	let [Ax, Ay, Aw, Ah] = boundify(item);

	// Far corners
	var Axx = Ax + Aw;
	var Ayy = Ay + Ah;

	var number = 0;
	for (var itemB of items) {

		let [Bx, By, Bw, Bh] = boundify(itemB);

		// Far corners
		var Bxx = Bx + Bw;
		var Byy = By + Bh;

		// A is to the left of B
		var outsideToLeft = Axx < Bx;

		// A is to the right of B
		var outsideToRight = Ax > Bxx;

		// A is above B or
		var outsideAbove = Ayy < By;

		// A is below B
		var outsideBelow = Ay > Byy;

		var outside = outsideToLeft || outsideToRight || outsideAbove || outsideBelow;

		if (!outside) {

			// Tell the objects
			if (typeof itemB.onCollision != "undefined") {
				itemB.onCollision(item);
			}

			if (typeof item.onCollision != "undefined") {
				item.onCollision(itemB);
			}

			return { item: itemB, number: number };
		}

		number ++;

	}

	return false;

}

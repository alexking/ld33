class Game {

	constructor() {
		this.isOver = false;
	}

	collides(item) {
		return collides(item, this.walls.concat(this.enemies).concat([this.partner]))
	}

	updateBeside() {

		var checks = [this.player].concat(this.enemies).concat([this.partner]);

		for (var item of checks) {
			item.adjacents = [];
		}

		// Basically find in range shit
		var adjacents = findAdjacent(checks, 5);

		for (var item of adjacents) {
			var [itemA, itemB] = item;
			itemA.adjacents.push(itemB);
			itemB.adjacents.push(itemA);
		}

	}

	over() {
		if (this.isOver == false) {
			this.isOver = true;
		}
	}

	tick() {
		this.updateBeside();

		if (this.isOver) {
			this.isOver++;
		}

	}



}
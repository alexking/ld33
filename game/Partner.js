class Partner {

	constructor(sprite) {
		this.tick = 0;

		this.sprite = sprite;
		this.stage = 0;

		this.adjacents = [];

		this.message = 1;
		this.latch = false;
		this.delay = 200;

		this.canHeal = false;
		this.health = 0;
	}

	collisionBox() {
		return [40, 40, 32, 32]
	}

	draw(context, offsetX, offsetY) {
		this.tick++;

		if (this.tick % 30 == 0) {
		//	this.stage = !this.stage;

			this.stage = random(0, 1);
		}


		var inRangeOfPlayer = false;
		for (var adjacent of this.adjacents) {
			if (adjacent.constructor.name == "Player") {
				inRangeOfPlayer = adjacent;
			}
		}

		if (inRangeOfPlayer) {
//			this.stage = 2;

			// Are they helping us?
			if (this.canHeal) {
				this.health = 1;
			} else {

				// Add text?
				this.sprite.draw(context, [0, this.message], 0, 20 - offsetX, 20 - offsetY);
			}

			this.latch = true;

		} else {

			if (this.latch) {
				this.latch = false;
				this.message = this.message == 1 ? 2 : 1;
			}
		}


		// Add partner
		this.sprite.draw(context, this.health == 1 ? 2 : this.stage, 0, 40 - offsetX, 40 - offsetY);

		if (this.health == 1) {
			this.delay --;

			var message = 3;
			if (this.delay < 0) {
				message = 4;
			}
			this.sprite.draw(context, [0, message], 0, 20 - offsetX, 20 - offsetY);

		}

	}

}
class Player {

	constructor(game, keyboard, sprite) {
		this.game = game;

		// Subscribe to all the keyboard events we may want
		keyboard.track("attack.right", ["right"]);
		keyboard.track("attack.left",  ["left"]);
		keyboard.track("attack.up",    ["up"]);
		keyboard.track("attack.down",  ["down"]);

		keyboard.track("move.right", ["d"]);
		keyboard.track("move.left",  ["a"]);
		keyboard.track("move.up",    ["w"]);
		keyboard.track("move.down",  ["s"]);

		this.keyboard = keyboard;

		this.sprite = sprite;

		// Defaults
		this.state = "rest";
		this.stateStage = 0;
		this.direction = "right";
		this.lastState = 0;
		this.playerSpriteWillChange = false;

		this.x = 0;
		this.y = 0;

		this.tick = 0;

		this.health = 5;

		this.attemptingMove = [0, 0];

		this.wasHit = false;
		this.attacking = false;

		this.regeneration = 0;
	}

	tryMove(moveX, moveY) {

		this.attemptingMove = [moveX, moveY];

		if (! this.game.collides(this) ) {
			this.x += moveX;
			this.y += moveY;
		}

	}

	hit(amount) {
		this.health -= amount;
		this.wasHit = true;

		// Reset regeneration progress
		this.regeneration = 0;

		if (this.health <= 0) {
			this.game.over();
		}
	}

	collisionBox() {
		var playerOffset = [190, 96];

		return [this.x + playerOffset[0] + 1 + this.attemptingMove[0], this.y + playerOffset[1] + 16 + this.attemptingMove[1], 29, 13];
	}


	draw(context) {
		this.tick++;


		var tick = this.tick;

		var keyboard = this.keyboard;

		// If we are resting, then we can start a roll
		if (this.state == "rest") {

			// When a key is down, we are trying to initiate a roll
			if (keyboard.any(["attack.right", "attack.left", "attack.up", "attack.down"])) {

				this.state = "roll";

				this.attacking = true;

				if (keyboard.pressed("attack.right")) {
					this.direction = "right";
				} else if (keyboard.pressed("attack.left")) {
					this.direction = "left";
				} else if (keyboard.pressed("attack.up")) {
					this.direction = "up";
				} else if (keyboard.pressed("attack.down")) {
					this.direction = "down";
				}
			}

		}

		// If we are aren't rolling
		if (this.state != "roll") {

			if (keyboard.any(["move.right", "move.left", "move.up", "move.down"])) {

				this.state = "walk";

				if (keyboard.pressed("move.right")) {
					this.direction = "right";
				} else if (keyboard.pressed("move.left")) {
					this.direction = "left";
				} else if (keyboard.pressed("move.up")) {
					this.direction = "up";
				} else if (keyboard.pressed("move.down")) {
					this.direction = "down";
				}
			} else {
				this.state = "rest";
			}

		}

		// Translate the info we have into a sprite to show
		var playerSprite = [0, 0];

		// Rest
		if (this.state == "rest") {
			this.attacking = false;

			// Display the rest sprite
			playerSprite = [0 + this.stateStage, 0];

		// Roll
		} else if (this.state == "roll") {

			var distance = 4; //Math.floor(this.stateStage) > 5 ? 8 : 11;

			if (this.direction == "left") {
				playerSprite = [ Math.floor(this.stateStage) + 1, 2];

				this.tryMove(-distance, 0);

			} else if (this.direction == "right") {
				playerSprite = [ Math.floor(this.stateStage) + 1, 1];

				this.tryMove(distance, 0);
			} else if (this.direction == "up") {
				playerSprite = [ 6 - Math.floor(this.stateStage), 3];

				this.tryMove(0, -distance);

			} else if (this.direction == "down") {
				playerSprite = [ Math.floor(this.stateStage) + 1, 3];

				this.tryMove(0, distance);
			}



		} else if (this.state == "walk") {

			var distance = 3; //Math.floor(this.stateStage) > 5 ? 8 : 11;

			if (this.direction == "left") {
				playerSprite = [ 1, 2 ];

				this.tryMove(-distance, 0);

			} else if (this.direction == "right") {
				playerSprite = [ 1, 1 ];

				this.tryMove(distance, 0);

			} else if (this.direction == "up") {
				playerSprite = [ 1, 1];

				this.tryMove(0, -distance);

			} else if (this.direction == "down") {
				playerSprite = [ 1, 3 ];

				this.tryMove(0, distance);

			}

		}



		// Enter the upkeep phase - states can reset or progress themselves here
		if (this.state == "roll") {

			// Have we reached the end of our roll?
			if (this.stateStage >= 4) {

				// Time to reset
				this.stateStage = 0;
				this.state = "rest";

			// Otherwise
			} else {
				this.stateStage += 0.2; //0.3;
			}

		} else if (this.state == "rest") {

			if (tick % 100 == 0) {
				this.stateStage = random(0, 3);
			}

			if (this.stateStage > 2) {
				this.stateStage = 0;
			}
		}

		this.playerSpriteWillChange = Math.floor(this.lastState) != Math.floor(this.stateStage);
		this.lastState = this.stateStage;



		this.sprite.draw(context, playerSprite, 0, 190, 96);

		if (this.wasHit) {

			this.sprite.draw(context, [7, this.wasHit], 0, 190, 96);

			if (this.tick % 2 == 0) {

				this.wasHit ++;

				if (this.wasHit >= 5) {
					this.wasHit = false;
				}
			}


		}

		var inRangeOfEnemy = false;
		for (var adjacent of this.adjacents) {
			if (adjacent.constructor.name == "Enemy") {
				inRangeOfEnemy = adjacent;
			}
		}

		if (inRangeOfEnemy) {
			var box = this.collisionBox();
		//	context.strokeStyle = "red";
		//	context.strokeRect(box[0] - offsetX + 0.5, 0.5 + box[1] - offsetY, box[2], box[3]);

			if (this.attacking) {

				inRangeOfEnemy.hit(1);

				// We had a hit, so we're not attacking anymore
				this.attacking = false;

			}

			this.colliding = false;
		}

		// Regenerate
		if (this.state != "dead" && this.health > 0) {
			if (this.health < 5) {
				this.regeneration++;

				if (this.regeneration > 200) {
					this.health ++;
					this.regeneration = 0;
				}
			}
		}

	}



}






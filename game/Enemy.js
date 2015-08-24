class Enemy {

	constructor(game, sprite, position) {
		this.game = game;
		this.sprite = sprite;
		[this.x, this.y] = position;  //random(area[0], area[0] + area[2] - 32);
	//	this.y = //random(area[1], area[1] + area[3] - 32);

		this.tick = 0;


		this.direction = "left";

		this.colliding = false;
		this.attacking = true;

		this.health = 3;

		this.adjacents = [];

		this.wasHit = false;
		this.dropped = false;

		this.turnQueue = [];

		this.state = "rest";

		this.attackTimer = 0;
	}

	collisionBox() {
		return [this.x + 8, this.y, 16, 32];
	}


	hit(amount) {
		this.health -= amount;

		if (this.health <= 0) {
			this.state = "dead";
		}

		this.wasHit = true;


	}

	draw(context, offsetX, offsetY) {
		this.tick ++;

		if (this.state != "dead") {

			var flip = false;

			var spriteX = 1;
			var spriteY = 0;

			var aligned = false;

			var player = this.game.player;
			var playerBox = player.collisionBox();
			var usBox = this.collisionBox();

			var [playerX, playerY, playerW, playerH] = playerBox;
			var [usX, usY, usW, usH] = usBox;

			var usXX = usX + usW;
			var usYY = usY + usH;

			var usCenterX = usX + usW / 2;
			var usCenterY = usY + usH / 2;

			var playerXX = playerX + playerW;
			var playerYY = playerY + playerH;

			var playerCenterX = playerX + (playerW / 2);
			var playerCenterY = playerY + (playerH / 2);

			// Find out if they're in the room
			if (player.room && this.room.number == player.room.number) {

				// Try to face towards them
				var direction = false;

				// If the player is higher, then up
				if (usCenterX > playerX && usCenterX < playerXX) {
					if (playerYY < usCenterY) {
						direction = "up";
					} else if (playerY >= usCenterY) {
						direction = "down";
					}
				} else if (playerYY > usY && playerY < usYY) {

					if (playerXX <= usCenterX) {
						direction = "left";
					} else {
						direction = "right";

					}

				}

				if (direction != false) {
					this.turnQueue.push(direction);
				}

				// Lag behind
				if (this.turnQueue.length > 10) {
					this.direction = this.turnQueue.shift();
				}

				// Check if we are aligned with player
				if (this.direction == direction) {
					aligned = true;
					this.attackTimer ++;
				} else {
					this.attackTimer = 0;
				}

				// Are we in range to swing?
				if (overlap(expand(usBox, 5), expand(playerBox, 5))) {

					// Attack done?
					if (this.attackTimer > 10) {
						this.state = "attacking";
					}
				}


			} else {
				this.state = "rest";
			}



			// Translate direction to sprite
			if (this.direction == "up") {
				spriteX = 1;
				spriteY = 1;
				flip = false;
			} else if (this.direction == "down") {
				spriteX = 1;
				spriteY = 2;
				flip = false;
			} else if (this.direction == "right") {
				flip = true;
			} else {
				flip = false;
			}

			if (this.state == "attacking") {
				spriteX = 2 + Math.floor((this.attackTimer - 10) / 10);

				// Ready to damage
				if (this.attackTimer == 30) {

					// Still in range?
					if (overlap(expand(usBox, 5), expand(playerBox, 5))) {

						// Damage
						player.hit(1);

					}
				}

				// Attack done?
				if (this.attackTimer > 30) {
					this.state = "rest";
					this.attackTimer = 0;

				}
			}

		// Dead
		} else {
			spriteX = 5;
			spriteY = 0;
		}


		//context.fillText(spriteX, this.x - offsetX, this.y - offsetY);
		this.sprite.draw(context, [spriteX, spriteY + 4], flip, this.x - offsetX, this.y - offsetY);

		if (this.wasHit) {

		//	context.fillRect(this.x - offsetX, this.y - offsetY, 25, 25 );

			this.sprite.draw(context, [7, this.wasHit], 0, this.x - offsetX, this.y - offsetY);

			if (this.tick % 10 == 0) {

				this.wasHit ++;

				if (this.wasHit >= 5) {
					this.wasHit = false;
				}
			}

		}



	}
}
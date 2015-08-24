

var startGame = function() {

	var canvas = new VirtualCanvas(1200 / 3, 600 / 3);
	var screen = new DomCanvas();

	// Keyboard
	var keyboard = new Keyboard();

	keyboard.track("restart", ["r"]);

	// Setup the game object
	var game = new Game();

	game.enemies = [];

	// Sprite
	var sprites = new FlipSprite("images/sprites.png", 32, 32);
	var tiles = new Sprite("images/tiles.png", 32, 32);
	var large = new Sprite("images/large.png", 64, 64);
	var overlay = new Sprite("images/overlay.png", 400, 200);
	var hud = new Sprite("images/tiny.png", 16, 16);

	// Player
	var player = new Player(game, keyboard, sprites);
	game.player = player;

	// Partner
	var partner = new Partner(large);
	game.partner = partner;

	var tick = 0;


	// Start by drawing the map
	var mapData = TileMaps.map;
	var map = new VirtualCanvas(mapData.width * 32, mapData.height * 32);
	var slimeLayer = new VirtualCanvas(mapData.width * 32, mapData.height * 32);


	// Don't build the map until after the image loads
	tiles.image.addEventListener("load", function() {
		var data = mapData.layers[0].data;

		var tileNumber = 0;

		for (var y = 0; y < mapData.height; y++) {

			for (var x = 0; x < mapData.width; x++) {

				var tileX = (data[tileNumber] - 1) % 6;
				var tileY = Math.floor((data[tileNumber] - 1) / 6);

				tiles.draw(map.context, [tileX, tileY], 0, x * 32, y * 32);
				//map.context.fillStyle = "white";
				tileNumber++;
			}
		}

		var hiddenAreas = mapData.layers[3].objects;
		map.context.fillStyle = "black";

		for (var area of hiddenAreas) {
			map.context.fillRect( area.x, area.y, area.width, area.height )
		}

	});

	// Make a list of obstacles
	game.walls = [];
	var wallLayer = mapData.layers[1].objects;
	for (var wall of wallLayer) {
		game.walls.push([wall.x, wall.y, wall.width, wall.height ]);
	}

	// Make a list of rooms
	game.rooms = [];
	var roomOpacity = [];
	var roomLayer = mapData.layers[2].objects;

	for (var room of roomLayer) {
		game.rooms.push([room.x, room.y, room.width, room.height ]);
		roomOpacity.push(0.8);
	}

	// Plop down enemies
	var enemyLayer = mapData.layers[4].objects;
	for (var enemyPosition of enemyLayer) {

		var enemy = new Enemy(game, sprites, [enemyPosition.x, enemyPosition.y] );
		enemy.room = collides([enemyPosition.x, enemyPosition.y, 32, 32], game.rooms);

		game.enemies.push(enemy);

	}

	// Debug stuff
	//document.body.appendChild(map.element);
	//document.body.appendChild(canvas.element);
	var enemiesKilled = 0;

	var restartCounter = 0;

	function giveItem() {

		if (enemiesKilled == 1 || enemiesKilled % 3 == 0) {

			// Give them a random item that they don't already have
			var tryItems = _.shuffle(["medicine", "bandage", "book"]);

			for (var item of tryItems) {
				if (inventory[item]) {
					continue;
				} else {
					inventory[item] = true;

					if (inventory.bandage && inventory.book && inventory.medicine) {
						partner.canHeal = true;
					}

					return;
				}
			}



		}
	}

	var hideTutorial = false;

	var partnerSprite = 0;

//	var inventory = { medicine : false, bandage : false, book : false };
	var inventory = { medicine : false, bandage : false, book : false };

	// Loop -----------------
	var loop = new Loop(function() {
		var debug = "";

		if (keyboard.pressed("restart") && game.player.health <= 0) {
		//	restartCounter++;

			//if (restartCounter > 100) {
				loop.stop = true;
				startGame();
			//}
		}

		// Wrapping tick
		tick = tick > 1000 ? 0 : tick + 1;

		// Clear the canvas
		canvas.clear();

		game.tick();

		var playerBox = player.collisionBox(); //playerBounds();

		canvas.context.fillStyle = "black";
		canvas.context.fillRect(0, 0, canvas.element.width, canvas.element.height);

		// Add map
		canvas.context.drawImage(map.element, 0 - player.x, 0 - player.y);

		// Draw slimes
		if (player.state != "rest") {
			sprites.draw(slimeLayer.context, [4 + random(0,5), 0], random(0, 1), playerBox[0], playerBox[1] - 16);
		}

		// Draw slime layer
		canvas.context.save();
		canvas.context.globalAlpha = 0.1;
		canvas.context.drawImage(slimeLayer.element, 0 - player.x, 0 - player.y);
		canvas.context.restore();

		partner.draw(canvas.context, player.x, player.y);


		// Now draw each enemy'
		var enemyNumber = 0;
		for (var enemy of game.enemies) {
			debug += enemy.x;
			enemy.draw(canvas.context, player.x, player.y);

			// Remove them if they've died
			if (enemy.health <= 0) {

				if (enemy.health <= -1) {
					game.enemies.splice(enemyNumber, 1);
				}

				if (!enemy.dropped) {
					enemiesKilled ++;
					giveItem();
					enemy.dropped = true;
				}


			}

			enemyNumber++;
		}

		// Draw the player
		player.draw(canvas.context); //, player.x, player.y);


		debug += tick + "\n";
	//	debug += playerSprite.join("x");


		// Find the room that we are in
		var currentRoom = collides(playerBox, game.rooms);
		player.room = currentRoom;

		// Draw the rooms for dimming
		var roomNumber = 0;
		for (var room of game.rooms) {
			let [x, y, w, h] = room;

			// This room, or the next room, or the previous room
			if (!(currentRoom.number == roomNumber
				|| (currentRoom.number - 1) == roomNumber
				|| (currentRoom.number + 1) == roomNumber
			)) {

				canvas.context.save();

				canvas.context.fillStyle = "black";
				canvas.context.globalAlpha = 0.8;
				canvas.context.fillRect(x - player.x, y - player.y, w, h);

				canvas.context.restore();
			}

			roomNumber++;

		}

		debug += currentRoom.number;

		// Draw the overlay
		overlay.draw(canvas.context, [0, 0], 0, 0, 0);

		if (keyboard.anyKey && !hideTutorial) {
			hideTutorial = true;
		}

		// If show tutorial is on...
		if (hideTutorial < 50) {

			canvas.context.save();
			canvas.context.globalAlpha = hideTutorial == false ? 1 : (1 / 50) * (50 - hideTutorial) ;
			overlay.draw(canvas.context, [0, 1], 0, 0, 0);
			canvas.context.restore();

			if (hideTutorial) {
				hideTutorial++;
			}
		}


		debug =  restartCounter; //this.fps;

		if (game.isOver) {
			//debug += "You've died" + game.isOver;

			canvas.context.save();
			canvas.context.fillStyle = "black";
			canvas.context.globalAlpha = game.isOver > 50 ? 1 : game.isOver * (1 / 50);
			canvas.context.fillRect(0, 0, canvas.width(), canvas.height());
			canvas.context.restore();

			if (game.isOver > 50) {
				overlay.draw(canvas.context, [0, 2], 0, 0, 0);
			}

		}

		// Draw HUD
		var hudPosition = canvas.width();
		hudPosition -= 16;
		if (inventory.medicine) {
			hud.draw(canvas.context, 0, 0, hudPosition, 16);
		} else {
			hud.draw(canvas.context, 5, 0, hudPosition, 16);
		}

		hudPosition -= 16;
		if (inventory.bandage) {
			hud.draw(canvas.context, 1, 0, hudPosition, 16);
		} else {
			hud.draw(canvas.context, 6, 0, hudPosition, 16);
		}

		hudPosition -= 16;
		if (inventory.book) {
			hud.draw(canvas.context, 2, 0, hudPosition, 16);
		} else {
			hud.draw(canvas.context, 7, 0, hudPosition, 16);
		}

		// Hearts
		hudPosition = 0;

		var hearts = player.health; // Math.ceil(player.health / 20);

		for (var i = 0; i < 5; i ++) {

			hudPosition += 14;
			hud.draw(canvas.context, (i >= hearts ? 4 : 3), 0, hudPosition, 16);

		}


		// Draw the canvas to the onscreen canvas
		screen.clear();

		screen.context.drawImage(canvas.element, 0, 0, 1200, 600);

		// Debug info right to the screen
		screen.context.fillStyle = "rgba(255, 255, 255, 0.2)";
		screen.context.font = "36px monospace";
	//	screen.context.fillText(debug, screen.width() - 56, screen.height() - 32);


	});

};

window.addEventListener("load", startGame);

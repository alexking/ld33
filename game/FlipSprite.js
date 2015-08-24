// Just a sprite that flips instead of rotating - excellent design
class FlipSprite extends Sprite {

	draw(context, sprite, flip, x, y) {

		var spriteX, spriteY = 0;
		if (typeof sprite[0] !== "undefined") {
			[spriteX, spriteY] = sprite;
		} else {
			spriteX = sprite;
		}

		// Draw to our canvas
		this.canvas.clear()
				   .flip(flip, this.width / 2, this.height / 2)
				   .sprite(this.image, this.width, this.height, spriteX, spriteY)
				   .reset();

		// Draw our canvas to the context
		context.drawImage(this.canvas.element, x, y);

	}

}

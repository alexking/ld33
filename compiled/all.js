"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = (function () {
	function Sprite(image, width, height) {
		_classCallCheck(this, Sprite);

		// Load the image
		this.image = new Image();
		this.image.src = image;

		// Keep the width / height
		this.width = width;
		this.height = height;

		// We need a canvas to provide rotation
		this.canvas = new VirtualCanvas(width, height);
	}

	_createClass(Sprite, [{
		key: "draw",
		value: function draw(context, sprite, rotation, x, y) {

			var spriteX,
			    spriteY = 0;
			if (typeof sprite[0] !== "undefined") {
				var _sprite = _slicedToArray(sprite, 2);

				spriteX = _sprite[0];
				spriteY = _sprite[1];
			} else {
				spriteX = sprite;
			}

			// Draw to our canvas
			this.canvas.clear().rotate(rotation, this.width / 2, this.height / 2).sprite(this.image, this.width, this.height, spriteX, spriteY).reset();

			// Draw our canvas to the context
			context.drawImage(this.canvas.element, x, y);
		}
	}]);

	return Sprite;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Canvas = (function () {
	function Canvas(element) {
		_classCallCheck(this, Canvas);

		var self = this;

		this.element = element;

		// Fetch a context
		this.context = this.element.getContext("2d");

		// Turn off scaling so that pixels!
		this.context.imageSmoothingEnabled = false;

		var _arr = ["ms", "webkit", "moz"];
		for (var _i = 0; _i < _arr.length; _i++) {
			var prefix = _arr[_i];
			this.context[prefix + "ImageSmoothingEnabled"] = false;
		}
	}

	_createClass(Canvas, [{
		key: "width",
		value: function width() {
			return this.element.width;
		}
	}, {
		key: "height",
		value: function height() {
			return this.element.height;
		}
	}, {
		key: "clear",
		value: function clear() {
			this.context.clearRect(0, 0, this.element.width, this.element.height);
			return this;
		}
	}, {
		key: "rotate",
		value: function rotate(degrees, originX, originY) {
			this.context.save();
			this.context.translate(originX, originY);
			this.context.rotate(degrees * (Math.PI / 180));
			this.context.translate(-originX, -originY);

			return this;
		}

		// @edit Added flip method
	}, {
		key: "flip",
		value: function flip(_flip, originX, originY) {
			if (!_flip) {
				return this;
			}

			this.context.save();
			this.context.translate(originX, originY);
			this.context.scale(-1, 1);
			this.context.translate(-originX, -originY);

			return this;
		}
	}, {
		key: "reset",
		value: function reset() {
			this.context.restore();
			return this;
		}
	}, {
		key: "sprite",
		value: function sprite(image, width, height) {
			var spriteX = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
			var spriteY = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
			var positionX = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
			var positionY = arguments.length <= 6 || arguments[6] === undefined ? 0 : arguments[6];

			this.context.drawImage(image, width * spriteX, height * spriteY, width, height, positionX, positionY, width, height);

			return this;
		}
	}]);

	return Canvas;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Keyboard = (function () {

    /**
     * Setup events
     */

    function Keyboard() {
        _classCallCheck(this, Keyboard);

        this.keycodes = new Map();

        this.anyKey = false;

        this.namedKeys = {
            up: 38,
            down: 40,
            left: 37,
            right: 39,
            space: 32
        };

        this.keys = new Set();

        this.latest = false;

        var self = this;

        window.onkeydown = function (event) {

            self.anyKey = true;

            if (self.keycodes.has(event.which)) {
                var name = self.keycodes.get(event.which);

                // Add the key
                self.keys.add(name);

                // Set as the latest
                self.latest = name;

                return false;
            }
        };

        window.onkeyup = function (event) {
            self.anyKey = false;

            if (self.keycodes.has(event.which)) {
                var name = self.keycodes.get(event.which);

                // Remove the key
                self.keys["delete"](name);

                // Recalculate latest
                if (self.keys.size == 0) {
                    self.latest = false;
                } else {
                    self.latest = Array.from(self.keys).pop();
                }

                return false;
            }
        };

        window.onblur = function (event) {
            self.anyKey = false;

            // No keys can be held down while we're not in the window
            self.keys.clear();

            self.latest = false;
        };
    }

    _createClass(Keyboard, [{
        key: "pressed",
        value: function pressed(name) {
            return this.keys.has(name);
        }

        /**
         * True if any of the keys are pressed
         * @param Array     names of keys
         * @return bool
         */
    }, {
        key: "any",
        value: function any(names) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var name = _step.value;

                    if (this.keys.has(name)) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "filter",
        value: function filter(names) {
            var keys = new Set(this.keys.values());

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var key = _step2.value;

                    if (names.indexOf(key) == -1) {
                        keys["delete"](key);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return keys;
        }

        /**
         * What keys should we track?
         */
    }, {
        key: "track",
        value: function track(name, keys) {

            this[name] = false;

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var key = _step3.value;

                    // Single characters
                    if (key.length == 1) {
                        this.keycodes.set(key.toUpperCase().charCodeAt(), name);

                        // Named keys
                    } else if (key in this.namedKeys) {
                            this.keycodes.set(this.namedKeys[key], name);
                        }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                        _iterator3["return"]();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }]);

    return Keyboard;
})();
"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DomCanvas = (function (_Canvas) {
	_inherits(DomCanvas, _Canvas);

	function DomCanvas() {
		_classCallCheck(this, DomCanvas);

		// Find the element
		var elements = document.getElementsByTagName("canvas");
		var element = elements[0];

		_get(Object.getPrototypeOf(DomCanvas.prototype), "constructor", this).call(this, element);
	}

	return DomCanvas;
})(Canvas);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Font = (function (_Sprite) {
	_inherits(Font, _Sprite);

	function Font(sprite, width, height, extras) {
		_classCallCheck(this, Font);

		_get(Object.getPrototypeOf(Font.prototype), "constructor", this).call(this, sprite, width, height);

		this.extras = extras;
	}

	_createClass(Font, [{
		key: "draw",
		value: function draw(context, text, x, y) {

			// Cast to string
			text += "";

			// Line height (from height)
			var lineHeight = this.height + 1;
			var charWidth = this.width - 2;

			// Split into lines
			var lines = text.split("\n");

			// Keep track of initial x
			var initialX = x;

			// Each line
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var line = _step.value;

					// Separate into characters
					var characters = line.split("");

					// Each character
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = characters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var character = _step2.value;

							var code = character.charCodeAt(0);

							var col,
							    row = 0;

							// Check for numerics (48 is 0, 57 is 9)
							if (code >= 48 && code <= 57) {
								col = code - 48;
								row = 0;

								// Check for alpha (65 is A, 90 is Z)
							} else if (code >= 65 && code <= 90) {

									col = code - 65;
									row = 1;

									// Check for extras
								} else if (this.extras.indexOf(character) != -1) {

										col = this.extras.indexOf(character);
										row = 2;
									}

							if (character != " ") {
								_get(Object.getPrototypeOf(Font.prototype), "draw", this).call(this, context, [col, row], 0, x, y);
							}

							x += charWidth;
						}

						// Move down another line
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
								_iterator2["return"]();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					y += lineHeight;
					x = initialX;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}]);

	return Font;
})(Sprite);
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeyboardMovement = (function () {

	/**
  * @param Keyboard
  */

	function KeyboardMovement(keyboard) {
		_classCallCheck(this, KeyboardMovement);

		// Track movement keys
		keyboard.track("up", ["w", "up"]);
		keyboard.track("down", ["s", "down"]);
		keyboard.track("left", ["a", "left"]);
		keyboard.track("right", ["d", "right"]);

		// Save the keyboard for later
		this.keyboard = keyboard;

		this.degrees = 0;
	}

	_createClass(KeyboardMovement, [{
		key: "direction",
		value: function direction() {

			// If anything is pressed
			if (this.keyboard.latest) {

				if (this.keyboard.latest == "up") {
					this.degrees = 0;
				} else if (this.keyboard.latest == "down") {
					this.degrees = 180;
				} else if (this.keyboard.latest == "left") {
					this.degrees = 270;
				} else if (this.keyboard.latest == "right") {
					this.degrees = 90;
				}
			}

			// Always return the degrees
			return this.degrees;
		}
	}, {
		key: "moving",
		value: function moving() {
			return this.keyboard.any(["up", "down", "left", "right"]);
		}
	}, {
		key: "name",
		value: function name() {
			return this.keyboard.latest;
		}

		/**
   * Provides an x, y delta
   * @return Array
   */
	}, {
		key: "delta",
		value: function delta() {

			var delta = [0, 0];

			// If anything is pressed
			if (this.keyboard.latest) {

				if (this.keyboard.latest == "up") {
					delta = [0, -1];
				} else if (this.keyboard.latest == "down") {
					delta = [0, 1];
				} else if (this.keyboard.latest == "left") {
					delta = [-1, 0];
				} else if (this.keyboard.latest == "right") {
					delta = [1, 0];
				}
			}

			// Always return the degrees
			return delta;
		}
	}]);

	return KeyboardMovement;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loop = (function () {
	function Loop(callback) {
		_classCallCheck(this, Loop);

		var self = this;

		self.lastTime = Date.now();
		self.ellapsed = 0;
		self.frames = 0;
		self.fps = 0;
		self.cap = 100;
		self.stop = false;

		// We use a wrapper so we can automatically ask for another frame
		var wrapper = function wrapper() {

			// Enforce the frame cap
			if (self.fps < self.cap) {

				// Run the callback
				callback.apply(self);

				// Count as a frame
				self.frames++;
			}

			// Update the timing info
			self.ellapsed = Date.now() - self.lastTime;
			self.fps = Math.floor(self.frames / (self.ellapsed / 1000));

			// Reset every second so we don't get big numbers
			if (self.ellapsed > 1000) {
				self.frames = 0;
				self.lastTime = Date.now();
			}

			if (!self.stop) {
				// Request the next animation frame
				window.requestAnimationFrame(wrapper);
			}
		};

		// Ask for an animation frame
		window.requestAnimationFrame(wrapper);
	}

	_createClass(Loop, [{
		key: "setCap",
		value: function setCap(cap) {
			this.cap = cap;
		}
	}]);

	return Loop;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mouse = (function () {
	function Mouse(canvas) {
		_classCallCheck(this, Mouse);

		this.canvas = canvas;

		this.resize();
		this.addEvent("resize", this.resize);
		this.addEvent("mousemove", this.move);
		this.addEvent("mousedown", this.down);
		this.addEvent("mouseup", this.up);

		this.addEvent("contextmenu", function (e) {
			e.preventDefault();
		});

		this.scale = 1;
		this.x = 0;
		this.y = 0;
		this.leftButton = false;
		this.rightButton = false;
	}

	/**
  * Add event listener with context
  */

	_createClass(Mouse, [{
		key: "addEvent",
		value: function addEvent(event, callback) {
			var self = this;
			window.addEventListener(event, function (e) {
				return callback.apply(self, [e]);
			});
		}
	}, {
		key: "down",
		value: function down(e) {
			this[e.button == 2 ? "rightButton" : "leftButton"] = true;
		}
	}, {
		key: "up",
		value: function up(e) {
			this[e.button == 2 ? "rightButton" : "leftButton"] = false;
		}
	}, {
		key: "resize",
		value: function resize() {

			this.bounds = this.canvas.element.getBoundingClientRect();
			this.left = this.bounds.left;
			this.top = this.bounds.top;
		}
	}, {
		key: "move",
		value: function move(e) {
			this.x = Math.floor((e.clientX - this.bounds.left) / this.scale);
			this.y = Math.floor((e.clientY - this.bounds.top) / this.scale);
		}
	}]);

	return Mouse;
})();
"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VirtualCanvas = (function (_Canvas) {
	_inherits(VirtualCanvas, _Canvas);

	function VirtualCanvas(width, height) {
		_classCallCheck(this, VirtualCanvas);

		// Create the element
		var element = document.createElement("canvas");

		// Set the size
		element.width = width;
		element.height = height;

		_get(Object.getPrototypeOf(VirtualCanvas.prototype), "constructor", this).call(this, element);
	}

	return VirtualCanvas;
})(Canvas);
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Enemy = (function () {
	function Enemy(game, sprite, position) {
		_classCallCheck(this, Enemy);

		this.game = game;
		this.sprite = sprite;
		//random(area[0], area[0] + area[2] - 32);
		//	this.y = //random(area[1], area[1] + area[3] - 32);

		var _position = _slicedToArray(position, 2);

		this.x = _position[0];
		this.y = _position[1];
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

	_createClass(Enemy, [{
		key: "collisionBox",
		value: function collisionBox() {
			return [this.x + 8, this.y, 16, 32];
		}
	}, {
		key: "hit",
		value: function hit(amount) {
			this.health -= amount;

			if (this.health <= 0) {
				this.state = "dead";
			}

			this.wasHit = true;
		}
	}, {
		key: "draw",
		value: function draw(context, offsetX, offsetY) {
			this.tick++;

			if (this.state != "dead") {

				var flip = false;

				var spriteX = 1;
				var spriteY = 0;

				var aligned = false;

				var player = this.game.player;
				var playerBox = player.collisionBox();
				var usBox = this.collisionBox();

				var _playerBox = _slicedToArray(playerBox, 4);

				var playerX = _playerBox[0];
				var playerY = _playerBox[1];
				var playerW = _playerBox[2];
				var playerH = _playerBox[3];

				var _usBox = _slicedToArray(usBox, 4);

				var usX = _usBox[0];
				var usY = _usBox[1];
				var usW = _usBox[2];
				var usH = _usBox[3];

				var usXX = usX + usW;
				var usYY = usY + usH;

				var usCenterX = usX + usW / 2;
				var usCenterY = usY + usH / 2;

				var playerXX = playerX + playerW;
				var playerYY = playerY + playerH;

				var playerCenterX = playerX + playerW / 2;
				var playerCenterY = playerY + playerH / 2;

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
						this.attackTimer++;
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

					this.wasHit++;

					if (this.wasHit >= 5) {
						this.wasHit = false;
					}
				}
			}
		}
	}]);

	return Enemy;
})();
// Just a sprite that flips instead of rotating - excellent design
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlipSprite = (function (_Sprite) {
	_inherits(FlipSprite, _Sprite);

	function FlipSprite() {
		_classCallCheck(this, FlipSprite);

		_get(Object.getPrototypeOf(FlipSprite.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(FlipSprite, [{
		key: "draw",
		value: function draw(context, sprite, flip, x, y) {

			var spriteX,
			    spriteY = 0;
			if (typeof sprite[0] !== "undefined") {
				var _sprite = _slicedToArray(sprite, 2);

				spriteX = _sprite[0];
				spriteY = _sprite[1];
			} else {
				spriteX = sprite;
			}

			// Draw to our canvas
			this.canvas.clear().flip(flip, this.width / 2, this.height / 2).sprite(this.image, this.width, this.height, spriteX, spriteY).reset();

			// Draw our canvas to the context
			context.drawImage(this.canvas.element, x, y);
		}
	}]);

	return FlipSprite;
})(Sprite);
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = (function () {
	function Game() {
		_classCallCheck(this, Game);

		this.isOver = false;
	}

	_createClass(Game, [{
		key: "collides",
		value: (function (_collides) {
			function collides(_x) {
				return _collides.apply(this, arguments);
			}

			collides.toString = function () {
				return _collides.toString();
			};

			return collides;
		})(function (item) {
			return collides(item, this.walls.concat(this.enemies).concat([this.partner]));
		})
	}, {
		key: "updateBeside",
		value: function updateBeside() {

			var checks = [this.player].concat(this.enemies).concat([this.partner]);

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = checks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var item = _step.value;

					item.adjacents = [];
				}

				// Basically find in range shit
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var adjacents = findAdjacent(checks, 5);

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = adjacents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var item = _step2.value;

					var _item = _slicedToArray(item, 2);

					var itemA = _item[0];
					var itemB = _item[1];

					itemA.adjacents.push(itemB);
					itemB.adjacents.push(itemA);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
						_iterator2["return"]();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}
	}, {
		key: "over",
		value: function over() {
			if (this.isOver == false) {
				this.isOver = true;
			}
		}
	}, {
		key: "tick",
		value: function tick() {
			this.updateBeside();

			if (this.isOver) {
				this.isOver++;
			}
		}
	}]);

	return Game;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Partner = (function () {
	function Partner(sprite) {
		_classCallCheck(this, Partner);

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

	_createClass(Partner, [{
		key: "collisionBox",
		value: function collisionBox() {
			return [40, 40, 32, 32];
		}
	}, {
		key: "draw",
		value: function draw(context, offsetX, offsetY) {
			this.tick++;

			if (this.tick % 30 == 0) {
				//	this.stage = !this.stage;

				this.stage = random(0, 1);
			}

			var inRangeOfPlayer = false;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.adjacents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var adjacent = _step.value;

					if (adjacent.constructor.name == "Player") {
						inRangeOfPlayer = adjacent;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
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
				this.delay--;

				var message = 3;
				if (this.delay < 0) {
					message = 4;
				}
				this.sprite.draw(context, [0, message], 0, 20 - offsetX, 20 - offsetY);
			}
		}
	}]);

	return Partner;
})();
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = (function () {
	function Player(game, keyboard, sprite) {
		_classCallCheck(this, Player);

		this.game = game;

		// Subscribe to all the keyboard events we may want
		keyboard.track("attack.right", ["right"]);
		keyboard.track("attack.left", ["left"]);
		keyboard.track("attack.up", ["up"]);
		keyboard.track("attack.down", ["down"]);

		keyboard.track("move.right", ["d"]);
		keyboard.track("move.left", ["a"]);
		keyboard.track("move.up", ["w"]);
		keyboard.track("move.down", ["s"]);

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

	_createClass(Player, [{
		key: "tryMove",
		value: function tryMove(moveX, moveY) {

			this.attemptingMove = [moveX, moveY];

			if (!this.game.collides(this)) {
				this.x += moveX;
				this.y += moveY;
			}
		}
	}, {
		key: "hit",
		value: function hit(amount) {
			this.health -= amount;
			this.wasHit = true;

			// Reset regeneration progress
			this.regeneration = 0;

			if (this.health <= 0) {
				this.game.over();
			}
		}
	}, {
		key: "collisionBox",
		value: function collisionBox() {
			var playerOffset = [190, 96];

			return [this.x + playerOffset[0] + 1 + this.attemptingMove[0], this.y + playerOffset[1] + 16 + this.attemptingMove[1], 29, 13];
		}
	}, {
		key: "draw",
		value: function draw(context) {
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
						playerSprite = [Math.floor(this.stateStage) + 1, 2];

						this.tryMove(-distance, 0);
					} else if (this.direction == "right") {
						playerSprite = [Math.floor(this.stateStage) + 1, 1];

						this.tryMove(distance, 0);
					} else if (this.direction == "up") {
						playerSprite = [6 - Math.floor(this.stateStage), 3];

						this.tryMove(0, -distance);
					} else if (this.direction == "down") {
						playerSprite = [Math.floor(this.stateStage) + 1, 3];

						this.tryMove(0, distance);
					}
				} else if (this.state == "walk") {

					var distance = 3; //Math.floor(this.stateStage) > 5 ? 8 : 11;

					if (this.direction == "left") {
						playerSprite = [1, 2];

						this.tryMove(-distance, 0);
					} else if (this.direction == "right") {
						playerSprite = [1, 1];

						this.tryMove(distance, 0);
					} else if (this.direction == "up") {
						playerSprite = [1, 1];

						this.tryMove(0, -distance);
					} else if (this.direction == "down") {
						playerSprite = [1, 3];

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

					this.wasHit++;

					if (this.wasHit >= 5) {
						this.wasHit = false;
					}
				}
			}

			var inRangeOfEnemy = false;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.adjacents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var adjacent = _step.value;

					if (adjacent.constructor.name == "Enemy") {
						inRangeOfEnemy = adjacent;
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
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
						this.health++;
						this.regeneration = 0;
					}
				}
			}
		}
	}]);

	return Player;
})();
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var startGame = function startGame() {

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
	tiles.image.addEventListener("load", function () {
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

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = hiddenAreas[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var area = _step.value;

				map.context.fillRect(area.x, area.y, area.width, area.height);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator["return"]) {
					_iterator["return"]();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	});

	// Make a list of obstacles
	game.walls = [];
	var wallLayer = mapData.layers[1].objects;
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = wallLayer[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var wall = _step2.value;

			game.walls.push([wall.x, wall.y, wall.width, wall.height]);
		}

		// Make a list of rooms
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
				_iterator2["return"]();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	game.rooms = [];
	var roomOpacity = [];
	var roomLayer = mapData.layers[2].objects;

	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = roomLayer[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var room = _step3.value;

			game.rooms.push([room.x, room.y, room.width, room.height]);
			roomOpacity.push(0.8);
		}

		// Plop down enemies
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
				_iterator3["return"]();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}

	var enemyLayer = mapData.layers[4].objects;
	var _iteratorNormalCompletion4 = true;
	var _didIteratorError4 = false;
	var _iteratorError4 = undefined;

	try {
		for (var _iterator4 = enemyLayer[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
			var enemyPosition = _step4.value;

			var enemy = new Enemy(game, sprites, [enemyPosition.x, enemyPosition.y]);
			enemy.room = collides([enemyPosition.x, enemyPosition.y, 32, 32], game.rooms);

			game.enemies.push(enemy);
		}

		// Debug stuff
		//document.body.appendChild(map.element);
		//document.body.appendChild(canvas.element);
	} catch (err) {
		_didIteratorError4 = true;
		_iteratorError4 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
				_iterator4["return"]();
			}
		} finally {
			if (_didIteratorError4) {
				throw _iteratorError4;
			}
		}
	}

	var enemiesKilled = 0;

	var restartCounter = 0;

	function giveItem() {

		if (enemiesKilled == 1 || enemiesKilled % 3 == 0) {

			// Give them a random item that they don't already have
			var tryItems = _.shuffle(["medicine", "bandage", "book"]);

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = tryItems[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var item = _step5.value;

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
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
						_iterator5["return"]();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}
		}
	}

	var hideTutorial = false;

	var partnerSprite = 0;

	//	var inventory = { medicine : false, bandage : false, book : false };
	var inventory = { medicine: false, bandage: false, book: false };

	// Loop -----------------
	var loop = new Loop(function () {
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
			sprites.draw(slimeLayer.context, [4 + random(0, 5), 0], random(0, 1), playerBox[0], playerBox[1] - 16);
		}

		// Draw slime layer
		canvas.context.save();
		canvas.context.globalAlpha = 0.1;
		canvas.context.drawImage(slimeLayer.element, 0 - player.x, 0 - player.y);
		canvas.context.restore();

		partner.draw(canvas.context, player.x, player.y);

		// Now draw each enemy'
		var enemyNumber = 0;
		var _iteratorNormalCompletion6 = true;
		var _didIteratorError6 = false;
		var _iteratorError6 = undefined;

		try {
			for (var _iterator6 = game.enemies[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
				var enemy = _step6.value;

				debug += enemy.x;
				enemy.draw(canvas.context, player.x, player.y);

				// Remove them if they've died
				if (enemy.health <= 0) {

					if (enemy.health <= -1) {
						game.enemies.splice(enemyNumber, 1);
					}

					if (!enemy.dropped) {
						enemiesKilled++;
						giveItem();
						enemy.dropped = true;
					}
				}

				enemyNumber++;
			}

			// Draw the player
		} catch (err) {
			_didIteratorError6 = true;
			_iteratorError6 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
					_iterator6["return"]();
				}
			} finally {
				if (_didIteratorError6) {
					throw _iteratorError6;
				}
			}
		}

		player.draw(canvas.context); //, player.x, player.y);

		debug += tick + "\n";
		//	debug += playerSprite.join("x");

		// Find the room that we are in
		var currentRoom = collides(playerBox, game.rooms);
		player.room = currentRoom;

		// Draw the rooms for dimming
		var roomNumber = 0;
		var _iteratorNormalCompletion7 = true;
		var _didIteratorError7 = false;
		var _iteratorError7 = undefined;

		try {
			for (var _iterator7 = game.rooms[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
				var room = _step7.value;

				var _room = _slicedToArray(room, 4);

				var x = _room[0];
				var y = _room[1];
				var w = _room[2];
				var h = _room[3];

				// This room, or the next room, or the previous room
				if (!(currentRoom.number == roomNumber || currentRoom.number - 1 == roomNumber || currentRoom.number + 1 == roomNumber)) {

					canvas.context.save();

					canvas.context.fillStyle = "black";
					canvas.context.globalAlpha = 0.8;
					canvas.context.fillRect(x - player.x, y - player.y, w, h);

					canvas.context.restore();
				}

				roomNumber++;
			}
		} catch (err) {
			_didIteratorError7 = true;
			_iteratorError7 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
					_iterator7["return"]();
				}
			} finally {
				if (_didIteratorError7) {
					throw _iteratorError7;
				}
			}
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
			canvas.context.globalAlpha = hideTutorial == false ? 1 : 1 / 50 * (50 - hideTutorial);
			overlay.draw(canvas.context, [0, 1], 0, 0, 0);
			canvas.context.restore();

			if (hideTutorial) {
				hideTutorial++;
			}
		}

		debug = restartCounter; //this.fps;

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

		for (var i = 0; i < 5; i++) {

			hudPosition += 14;
			hud.draw(canvas.context, i >= hearts ? 4 : 3, 0, hudPosition, 16);
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
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

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

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = p[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var pair = _step.value;

			var _pair = _slicedToArray(pair, 2);

			var itemA = _pair[0];
			var itemB = _pair[1];

			var boundsA = boundify(itemA);
			var boundsB = boundify(itemB);

			boundsA = expand(boundsA, border);
			boundsB = expand(boundsB, border);

			if (overlap(boundsA, boundsB)) {
				adjacent.push([itemA, itemB]);
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator["return"]) {
				_iterator["return"]();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
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
	var _itemA = _slicedToArray(itemA, 4);

	var Ax = _itemA[0];
	var Ay = _itemA[1];
	var Aw = _itemA[2];
	var Ah = _itemA[3];

	var _itemB = _slicedToArray(itemB, 4);

	var Bx = _itemB[0];
	var By = _itemB[1];
	var Bw = _itemB[2];
	var Bh = _itemB[3];

	return !(Ax + Aw < Bx || Ax > Bx + Bw || Ay + Ah < By || Ay > By + Bh);
}

function collides(item, items) {
	var sides = [];

	var _boundify = boundify(item);

	var _boundify2 = _slicedToArray(_boundify, 4);

	var Ax = _boundify2[0];
	var Ay = _boundify2[1];
	var Aw = _boundify2[2];
	var Ah = _boundify2[3];

	// Far corners
	var Axx = Ax + Aw;
	var Ayy = Ay + Ah;

	var number = 0;
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var itemB = _step2.value;

			var _boundify3 = boundify(itemB);

			var _boundify32 = _slicedToArray(_boundify3, 4);

			var Bx = _boundify32[0];
			var By = _boundify32[1];
			var Bw = _boundify32[2];
			var Bh = _boundify32[3];

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

			number++;
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
				_iterator2["return"]();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	return false;
}
/*
 * A game for the flipdot pixel wall.
 * The environment supplys a `setPixel(x, y, [r, g, b])` function to this code.
 * With this, it is possible to set the color of the macroscopic pixels, which are arranged
 * in a matrix with (`WIDTH` * `HEIGHT`).
 */

const shapes = [
  [ // L
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2]
  ],
  [ // T
    [0, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
  ],
  [ // z
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 2]
  ],
  [ // z
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 2]
  ],
  [ // I
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3]
  ],
  [ // box
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
  ]
];

const colors = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 0],
  [0, 1, 1],
  [1, 0, 1]
];

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const drawShape = (offset, pixels, color) => {
  pixels.forEach(pos => {
    setPixel(offset[0] + pos[0], offset[1] + pos[1], color);
  })
}

let i = 0;

let ground = Array(WIDTH).fill(null).map(() => Array(HEIGHT).fill(null));

console.log(ground);

class Shape {
  constructor(pos) {
    this.color = colors[randomInt(colors.length)];
    this.shape = shapes[randomInt(shapes.length)]
    this.pos = pos;
  }

  checkCollision(offset) {
    return this.getPixels().some(pos => {
      const abs = [pos[0] + offset[0], pos[1] + offset[1]];
      return abs[1] >= HEIGHT || ground[abs[0]][abs[1]];
    });
  }

  getPixels() {
    return this.shape.map(pos => [pos[0] + this.pos[0], pos[1] + this.pos[1]]);
  }

  fall() {
    drawShape(this.pos, this.shape, [0, 0, 0]);
    this.pos[1] += 1;
    drawShape(this.pos, this.shape, this.color);
  }

  move(delta) {
    if (this.checkCollision(delta)) return;
    drawShape(this.pos, this.shape, [0, 0, 0]);
    this.pos = [this.pos[0] + delta[0], this.pos[1] + delta[1]];
    drawShape(this.pos, this.shape, this.color);
    draw();
  }
}


clear();
let falling = new Shape([4, 0]);

setInterval(() => {
  if (falling.checkCollision([0, 1])) {
    falling.getPixels().forEach(pos => {
      ground[pos[0]][pos[1]] = falling.color;
      setPixel(pos[0], pos[1], [1, 1, 1]);
    });

    falling = new Shape([4, 0]);
  }
  falling.fall();
  draw();
}, 250);

onButtonDown = (button) => {
  if (button === 'right') {
    falling.move([1, 0]);
  }

  if (button === 'left') {
    falling.move([-1, 0]);
  }
};


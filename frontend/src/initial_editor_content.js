/*
 * A game for the flipdot pixel wall.
 * The environment supplys a `setPixel(x, y, [r, g, b])` function to this code.
 * With this, it is possible to set the color of the macroscopic pixels, which are arranged
 * in a matrix with (`WIDTH` * `HEIGHT`).
 */

let cursor = { x: 0, y: 0 };
let history = [];

// run the main loop 10 times per second
setInterval(() => {
  // move the cursor acording to the last state
  if (buttons.up && cursor.y > 0) cursor.y--;
  if (buttons.down && cursor.y < HEIGHT - 1) cursor.y++;
  if (buttons.left && cursor.x > 0) cursor.x--;
  if (buttons.right && cursor.x < WIDTH - 1) cursor.x++;

  const time = +new Date() / 1000;
  const TAU = 2 * Math.PI;
  const sin = Math.sin;
  if (buttons.B) {
    setPixel(cursor.x, cursor.y, [0, 0, 0]);
  } else {
    setPixel(cursor.x, cursor.y, [
      sin(time) * 0.5 + 0.5,
      sin(time + 0.33 * TAU) * 0.5 + 0.5,
      sin(time + 0.66 * TAU) * 0.5 + 0.5,
    ]);
  }
  draw();
}, 1000 / 10);

onButtonDown = (btn) => {
  if (btn === 'A') {
    clear();
  }
};

let gamepads = [];
let gamepadButtons = {};
let pollInterval = null;

window.addEventListener('gamepadconnected', function({ gamepad }) {
  console.info('[Gamepad] Gamepad connected.', gamepad);
  gamepads = [...gamepads, gamepad.index];
  gamepadButtons[gamepad.index] = gamepad.buttons.map(btn => btn.pressed);
});

window.addEventListener('gamepaddisconnected', function({ gamepad }) {
  console.info('[Gamepad] Gamepad disconnected.', gamepad);
  gamepads = gamepads.filter(gp => gp !== gamepad.index);
});


function mapButton(button) {
  switch (button) {
    case 12: return 'up';
    case 13: return 'down';
    case 14: return 'left';
    case 15: return 'right';
    case 1: return 'A';
    case 0: return 'B';
    case 2: return 'Y';
    case 3: return 'X';
    case 5: case 7: return 'RB';
    case 4: case 6: return 'LB';
    case 9: return 'start';
    case 8: return 'select';
  }
}

export function startListening(onButton) {
  stopListening();

  pollInterval = setInterval(() => {
    gamepads.forEach(index => {
      const gamepad = navigator.getGamepads()[index];
      if (!gamepad) {
        console.debug("[Gamepad] Could not read gamepad data.", { index });
        return;
      }

      const lastButtons = gamepadButtons[index];
      const newButtons = gamepad.buttons;

      if (lastButtons) {
        newButtons.forEach((newButton, i) => {
          if (newButton.pressed != lastButtons[i]) {
            const buttonString = mapButton(i);
            if (buttonString) {
              const e = { button: buttonString, type: newButton.pressed ? 'down' : 'up' };
              console.debug('[Gamepad] Button changed.', e);
              onButton(e);
            } else {
              console.debug('[Gamepad] Unknown button.', { button: i });
            }
            lastButtons[i] = newButton.pressed;
          }
        });
      }
    });
  }, 25);
}

export function stopListening() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

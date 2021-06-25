let gamepads = [];
let gamepadStates = {};
let pollInterval = null;

window.addEventListener('gamepadconnected', function({ gamepad }) {
  console.info('[Gamepad] Gamepad connected.', gamepad);
  gamepads = [...gamepads, gamepad.index];
  gamepadStates[gamepad.index] = {
    buttons: {},
    axesDirection: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
  };
});

window.addEventListener('gamepaddisconnected', function({ gamepad }) {
  console.info('[Gamepad] Gamepad disconnected.', gamepad);
  gamepads = gamepads.filter(gp => gp !== gamepad.index);
});

function mapButton(button) {
  switch (button) {
    case 12:
      return 'up';
    case 13:
      return 'down';
    case 14:
      return 'left';
    case 15:
      return 'right';
    case 1:
      return 'A';
    case 2:
      return 'B';
    case 3:
      return 'Y';
    case 0:
      return 'X';
    case 5:
      return 'R';
    case 4:
      return 'L';
    case 9:
      return 'start';
    case 8:
      return 'select';
  }
}

function getAxesValues(axes) {
  let direction = [axes[0] > 0, axes[0] < 0, axes[1] > 0, axes[1] < 0];

  return direction;
}

function mapAxis(index) {
  switch (index) {
    case 0:
      return 'right';
    case 1:
      return 'left';
    case 2:
      return 'down';
    case 3:
      return 'up';
  }
}

function axisToDigital(value) {
  if (Math.abs(value) > 0.4) {
    return Math.sign(value);
  }
  return 0;
}

export function startListening(onButton) {
  stopListening();

  const notifyListeners = (button, type) => {
    const e = { button, type };
    console.debug('[Gamepad] Button changed.', e);
    onButton(e);
  };

  pollInterval = setInterval(() => {
    gamepads.forEach(index => {
      const gamepad = navigator.getGamepads()[index];
      if (!gamepad) {
        console.debug('[Gamepad] Could not read gamepad data.', { index });
        return;
      }

      const lastGamepadState = gamepadStates[index];
      const newButtons = gamepad.buttons;
      const newAxes = gamepad.axes.map(axisToDigital);

      if (lastGamepadState) {
        const newAxesDirection = getAxesValues(newAxes);
        newAxesDirection.forEach((newDirection, i) => {
          const directionString = mapAxis(i);
          if (newDirection != lastGamepadState.axesDirection[directionString]) {
            notifyListeners(directionString, newDirection ? 'down' : 'up');
            lastGamepadState.axesDirection[directionString] = newDirection;
          }
        });

        newButtons.forEach((newButton, i) => {
          const buttonString = mapButton(i);
          if (buttonString && newButton.pressed != lastGamepadState.buttons[buttonString]) {
            notifyListeners(buttonString, newButton.pressed ? 'down' : 'up');
            lastGamepadState.buttons[buttonString] = newButton.pressed;
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

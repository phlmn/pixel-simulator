let buttons = {
  up: false,
  down: false,
  left: false,
  right: false,
};

let onButtonDown = () => {};
let onButtonUp = () => {};

(function() {
  window.onmessage = e => {
    const { type, payload } = JSON.parse(e.data);
    switch (type) {
      case 'keydown':
        buttons[payload] = true;
        onButtonDown(payload);
        break;
      case 'keyup':
        buttons[payload] = false;
        onButtonUp(payload);
        break;
    }
  };

  const sendMessage = (type, payload) => {
    window.top.postMessage(
      JSON.stringify({
        type,
        payload,
      }),
      '*'
    );
  };

  window.setPixel = (x, y, color) => {
    sendMessage('setPixel', {
      x,
      y,
      color,
    });
  };

  window.clear = (x, y, color) => {
    sendMessage('clear');
  };

  window.draw = () => {
    sendMessage('draw');
  };
})();

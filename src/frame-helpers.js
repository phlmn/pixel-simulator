let keys = {
  up: false,
  down: false,
  left: false,
  right: false,
};

(function() {
  window.onmessage = e => {
    const { type, payload } = JSON.parse(e.data);
    switch (type) {
      case 'keydown':
        keys[payload] = true;
        break;
      case 'keyup':
        keys[payload] = false;
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
})();

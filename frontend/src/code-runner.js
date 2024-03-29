const frameHelpers = require('fs').readFileSync(__dirname + '/frame-helpers.js', 'utf-8');
let frame = null;

export function runCode(code, { setPixel, clear, draw, onError }) {
  stopCode();

  frame = document.createElement('iframe');
  frame.sandbox = 'allow-scripts';
  frame.src = URL.createObjectURL(
    new Blob(
      [
        `
    <!DOCTYPE html>
    <script>
      const WIDTH = 10;
      const HEIGHT = 10;

      ${frameHelpers}

      try {
        eval(${JSON.stringify(code)});
      } catch (e) {
        _reportError(e);
      }
    </script>
  `,
      ],
      { type: 'text/html' }
    )
  );
  frame.width = 0;
  frame.height = 0;
  frame.frameBorder = 0;
  frame.id = 'frame';

  window.onmessage = (e) => {
    if (!frame || e.source !== frame.contentWindow) {
      return;
    }

    const { type, payload } = JSON.parse(e.data); // because security

    switch (type) {
      case 'setPixel':
        if (setPixel) setPixel(payload.x, payload.y, payload.color);
        break;
      case 'clear':
        if (clear) clear();
        break;

      case 'draw':
        if (draw) draw();
        break;

      case 'error':
        if (onError) onError(payload.message);
        break;
    }
  };

  document.body.append(frame);
}

export function stopCode() {
  if (frame) {
    document.body.removeChild(frame);
    frame = null;
  }
}

export function sendMessage(type, payload) {
  if (!frame) return;

  frame.contentWindow.postMessage(
    JSON.stringify({
      type,
      payload,
    }),
    '*'
  );
}

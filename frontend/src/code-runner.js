import frameHelpers from 'raw-loader!./frame-helpers.js';

let frame = null;

export function runCode(code, { setPixel, clear, draw }) {
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
      const HEIGHT = 20;

      ${frameHelpers}
      ${code}
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

  window.onmessage = e => {
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

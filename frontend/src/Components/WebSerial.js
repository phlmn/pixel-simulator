import React, { useState } from 'react';

class LineBreakTransformer {
  constructor() {
    this.container = '';
  }

  transform(chunk, controller) {
    this.container += chunk;
    const lines = this.container.split('\r\n');
    this.container = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    controller.enqueue(this.container);
  }
}

async function initializePort(port) {
  await port.open({ baudRate: 115200 });
  window.port = port;

  // setup the read pipeline
  setTimeout(async () => {
    const lineReader = port.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TransformStream(new LineBreakTransformer()))
      .getReader();

    while (true) {
      const { value, done } = await lineReader.read();
      if (value) {
        console.info('serial: ', value);
      }
      if (done) {
        console.log('[readLoop] DONE', done);
        lineReader.releaseLock();
        break;
      }
    }
  }, 0);

  // setup the write pipeline
  setTimeout(async () => {
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    const write = (cmd) => writer.write(encoder.encode(`${cmd}\r\n`));
    window.write = write;

    write('print("starting...")');
    write('import neopixel');
    write('print("hello world")');
  }, 0);

  return port;
}

export function WebSerial({}) {
  const [port, setPort] = useState(null);

  if (!navigator.serial || port) {
    return <></>;
  }

  setTimeout(async () => {
    let ports = await navigator.serial.getPorts();
    if (ports[0]) {
      const port = await initializePort(ports[0]);
      setPort(port);
    }
  }, 0);

  return (
    <button
      onClick={async () => {
        const requested = await navigator.serial.requestPort();
        const port = await initializePort(requested);
        setPort(port);
      }}
    >
      connect to serial port
    </button>
  );
}

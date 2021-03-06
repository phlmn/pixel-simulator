const { chunk, flatten } = require('lodash');
const SerialPort = require('serialport');
const promisify = require('promisify');

function toHex(number) {
  const clamped = Math.round(Math.max(0, Math.min(number * 256, 255)));
  let hex = clamped.toString(16);
  return clamped < 16 ? `0${hex}` : hex;
}

let coms = [];

async function init() {
  const ports = await SerialPort.list();
  coms = ports
    .filter(
      port =>
        port.comName.startsWith('/dev/tty.wchusbserial') || port.comName.startsWith('/dev/ttyUSB')
    )
    .map(
      port =>
        new SerialPort(port.comName, {
          baudRate: 2000000,
        })
    );
}

let in_use = false;
async function sendPixels(pixels) {
  if (in_use) return;
  in_use = true;
  const flatPixels = flatten(pixels);
  const chunks = chunk(flatPixels, 5);

  const first = chunks.filter((_, i) => i % 2 === 0);
  const second = chunks.filter((_, i) => i % 2 === 1);
  await Promise.all([
    promisify(coms[0].write)(
      `SET${flatten(first)
        .map(color => `${toHex(color[0])}${toHex(color[1])}${toHex(color[2])}`)
        .join('')};`
    ),
    promisify(coms[1].write)(
      `SET${flatten(second)
        .map(color => `${toHex(color[0])}${toHex(color[1])}${toHex(color[2])}`)
        .join('')};`
    ),
  ]);
  in_use = false;
}

module.exports = {
  init,
  sendPixels,
};

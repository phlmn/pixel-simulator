console.log("asd");
clear();

setInterval(() => {
  setPixel(2, 2, [0, 1, 0]);
}, 1000);

console.log(window.top.postMessage);

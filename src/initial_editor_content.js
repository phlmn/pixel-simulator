console.log("asd");
clear();

setInterval(() => {
  setPixel(10, 10, 'ff00aa');
}, 1000);

console.log(window.top.postMessage);

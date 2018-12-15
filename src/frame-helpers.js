(function() {
  const sendMessage = (type, payload) => {
    window.top.postMessage(
      JSON.stringify({
        type,
        payload
      }),
      "*"
    );
  };

  window.setPixel = (x, y, color) => {
    sendMessage("setPixel", {
      x,
      y,
      color
    });
  };

  window.clear = (x, y, color) => {
    sendMessage("clear");
  };
})();

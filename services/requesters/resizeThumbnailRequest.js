const { Requester } = require("cote");

const requester = new Requester({ name: "imageResizerRequester" });

const sendOrderToResizeEvent = (filePath, callback) => {
  const event = {
    type: "resize-to-thumbnail",
    filePath,
  };
  requester.send(event, (error, result) => {
    if (error) {
      console.log("Error in resize event: ", error);
      return callback(error);
    }
    callback(null, result);
  });
};

module.exports = sendOrderToResizeEvent;

const { Responder } = require("cote");
const path = require("node:path");
const Jimp = require("jimp");

const responder = new Responder({ name: "thumbnailResizerResponder" });

responder.on("resize-to-thumbnail", async (req, done) => {
  const filePath = req.filePath;

  try {
    const image = await Jimp.read(filePath);
    const outputFilePath = path.join(path.dirname(filePath), "thumbnail_" + path.basename(filePath));

    await image.resize(100, 100).writeAsync(outputFilePath);

    done(null, { message: "Resize successful! ", outputFilePath: outputFilePath });
  } catch (error) {
    console.error("Error resizing thumbnail: ", error);
    done(error);
  }
});

module.exports = responder;

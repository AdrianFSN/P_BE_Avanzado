class ImageRouteController {
  setImageRoute(req, res, next) {
    const filename = req.params.filename;

    const filePath = path.join(__dirname, "uploads", "adImages", filename);

    res.sendFile(filePath);
  }
}

module.exports = ImageRouteController;

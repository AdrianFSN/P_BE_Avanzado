"use strict";

var createError = require("http-errors");
var express = require("express");
var helmet = require("helmet");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const jwtAuth = require("./lib/jwtAuthentication");
const { LoginController, LangController, ImageRouteController } = require("./controllers");
const i18n = require("./lib/i18nConfigure");

const loginController = new LoginController();
const langController = new LangController();
const imageRouteController = new ImageRouteController();

require("./lib/connectMongoose");

/* var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users'); */

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/**
 * Middlewares
 */

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Static paths
 */
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * Rutas del API
 */
app.use("/api/adsNodepop", jwtAuth, require("./routes/api/ads"));
app.use("/api/users", jwtAuth, require("./routes/api/users"));
app.use("/api/tags", require("./routes/api/availableTags"));
app.use("/api/insert", jwtAuth, require("./routes/api/insertOneAd"));
app.use("/api/update", jwtAuth, require("./routes/api/updateAd"));
app.use("/api/delete", jwtAuth, require("./routes/api/deleteAds"));
app.post("/api/authenticate", loginController.postApiJWT);

/**
 * Rutas del website
 */
app.use(i18n.init);
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/tags", require("./routes/tags"));
app.get("/change-locale/:locale", langController.changeLocale);
app.get("/adImages/:filename", imageRouteController.setImageRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  // errores de validación
  if (err.array) {
    const errInfo = err.array({})[0]; //Elijo que sea solo el primero en esta ocasión.
    console.log(errInfo); // esto es solo para ver los parámetros del error y usarlos en la línea siguiente:
    err.message = `Not valid - ${errInfo.type} ${errInfo.location} in ${errInfo.path}: ${errInfo.msg}`;
    err.status = 422;
  }

  // Si el fallo es en el API
  // Responder en JSON
  if (req.originalUrl.startsWith("/api/")) {
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.render("error");
});

module.exports = app;

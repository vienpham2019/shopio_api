const express = require("express");
const app = express();

const compression = require("compression");
const { default: helmet } = require("helmet");
const morgan = require("morgan");

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./bds/init.mongodb");
// const { checkOverLoad } = require("./helpers/check.connect");
// checkOverLoad();
// init routes
app.use("", require("./routes"));
// handle error

module.exports = app;

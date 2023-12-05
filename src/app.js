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

// init router

// handle error

module.exports = app;

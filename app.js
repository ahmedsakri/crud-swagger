const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const { notFound, errorHandler } = require("./middlewares");

const app = express();

require("dotenv").config();

app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());

const animals = require("./routes/v1");

app.use("/api/animals", animals);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(notFound);
app.use(errorHandler);

module.exports = app;

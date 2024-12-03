require("dotenv").config();
const apiRouter = require("./routers/api.router");
const morgan = require("morgan");
const express = require("express");
const app = express();

const { PORT } = process.env;

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", apiRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server started at ${PORT} port`);
  });
}

module.exports = app;

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const routes = require("./src/routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.listen(5000, () =>
  console.log(`Server running at http://localhost:${process.env.PORT}`)
);

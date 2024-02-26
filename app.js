const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contactsRouter");
const userRouter = require("./routes/api/usersRouter");
const { error } = require("./validators/contactValidator");

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(express.static('public'));

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Internal Server error " });
});

module.exports = app;

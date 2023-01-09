const mongoose = require("mongoose");
require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const connect = process.env.DB_URI
  ? process.env.DB_URI
  : process.env.DATABASE_LOCAL;

mongoose.connect(connect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => {
  console.log(`Successfully connected to the database!!!`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  db.close(() => {
    process.exit(1);
  });
});

const app = require("./app");
const { chatSocket } = require("./chatSocket");

// chat socket function
chatSocket(app);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});

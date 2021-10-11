const path = require("path");
const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "eventsData.db");

let db = null;
const initializeDbAndRunServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, (response) => {
      console.log("Server is Running at http://localhost:3001");
    });
  } catch (e) {
    console.log(`Db error '${e.message}'`);
    process.exit(1);
  }
};
initializeDbAndRunServer();

"use strict";
require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.DB_URL;

class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    if (type === "mongodb") {
      // Dev
      if (1 === 1) {
        mongoose.set("debug", true);
        mongoose.set("debug", { color: true });
      }

      mongoose
        .connect(uri, {
          maxPoolSize: 50, // default 5
        })
        .then(() => {
          console.log("Connected to MongoDB PRO");
        })
        .catch((err) => {
          console.error("Error connecting to MongoDB:", err);
        });
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;

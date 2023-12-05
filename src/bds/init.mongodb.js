"use strict";

const mongoose = require("mongoose");

const uri =
  "mongodb+srv://vienpham2019:Vp$1721998@cluster0.04sqiqj.mongodb.net/?retryWrites=true&w=majority";

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
        .connect(uri)
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

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require('dotenv').config();

function connectdb() {

  const MONGO_URL = process.env.DATABASE_URL;

  // if (!process.env.DATABASE_URL) {
  //   throw new Error("DATABASE_URL is not defined in the environment variables.");
  // };


  main()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });

  async function main() {
    mongoose.connect(MONGO_URL, {
      family: 4,
    });
  };

  const initDB = async () => {
    try {
      console.log("Initializing data...");
      await Listing.deleteMany({});
      await Listing.insertMany(initData.data);
      console.log("Data initialization complete.");
    } catch (error) {
      console.error("Error initializing data:", error.message);
    }
  };


  initDB();
}
// connectdb();
module.exports = connectdb;
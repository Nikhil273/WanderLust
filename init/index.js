const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

function connectdb() {

  const MONGO_URL = "mongodb://localhost:27017/wanderlust";

  main()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });

  async function main() {
    await mongoose.connect(MONGO_URL);
  }

  const initDB = async () => {
    console.log("data was initialized");
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
  };

  initDB();
}

module.exports = connectdb;
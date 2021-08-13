const mongoose = require("mongoose");
const config = require("config");
const production = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(production, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("mongo database connected..");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");
const config = require("config");
const production = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://abhi17:abhi17@globetrotter.vpuol.mongodb.net/<dbname>?retryWrites=true&w=majority", {
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

const mongoose = require("mongoose");
const env = require("./environment"); 
// connect mongoose to mongodb
mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

db.once("open", function(){
    console.log("Connected to the Database :: MongoDB");
});


module.exports = db;
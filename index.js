const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const db = require("./config/mongoose");
const port = 8000;

const app = express();

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./assets"));
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.use(expressLayouts);
// extract the styles and script from sub-pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// use express router
app.use("/", require("./routes/index"));


app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }

    console.log(`Server is running on the port : ${port}`);
});
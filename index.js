const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const env = require("./config/environment");
const logger = require("morgan");
const port = 8000;
const app = express();
require("./config/view-helpers")(app);

const db = require("./config/mongoose");
// used for session cookies
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");

const MongoStore = require("connect-mongo");
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMiddleware = require("./config/middleware");

// set up the chat server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");
const path = require("path");

if(env.name == "development"){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, "sass"),
        dest: path.join(__dirname, env.asset_path, "css"),
        debug: true,
        outputStyle: "expanded",
        prefix: "/css"
    }));
}

app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(env.asset_path));

// Make the upload path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// extract the styles and script from sub-pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// mongo store is used to store the session cookie in the db
app.use(session({
    name: "All Social",
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store:MongoStore.create({
        mongoUrl: "mongodb://localhost/all_social_development",
        autoRemove: "disabled",
    }, function(err){
        console.log(err || "connect-mongodb setup ok");
    }
    )
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);

// use express router
app.use("/", require("./routes/index"));


app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }

    console.log(`Server is running on the port : ${port}`);
});
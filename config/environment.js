const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log", {
    interval: "1d",
    path: logDirectory
});

const development = {
    name: "development",
    asset_path: "assets",
    session_cookie_key: "blahsomething",
    db: "all_social_development",
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "yadavrishikesh53@gmail.com",
            pass: "ykabqtbzuuthheuq"
        }
    },
    google_client_id: "146213907743-sql73ibph7aq5adji7l6g98vspo5vpcc.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: "codiel",
    morgan: {
        mode: "dev",
        options: {stream: accessLogStream}
    }
}


const production = {
    name: "production",
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIALSESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALL_BACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: "combined",
        options: { stream: accessLogStream }
    }
}


module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);
// module.exports = development;
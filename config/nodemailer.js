const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");


// define the transporter
let transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "yadavrishikesh53@gmail.com",
        pass: "ykabqtbzuuthheuq"
    }
});


// define the function which render the template of gmail
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, "../views/mailers", relativePath),      
        data,
        function(err, template){
            if(err){console.log("Error in rendering template"); return;}

            mailHTML = template;
        }
    )

    return mailHTML;
}


module.exports = {
    transport: transport,
    renderTemplate: renderTemplate,
}
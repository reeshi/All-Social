const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const env = require("./environment");


// define the transporter
let transport = nodemailer.createTransport(env.smtp);


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
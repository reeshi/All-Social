const User = require("../models/user");

module.exports.profile = function(req, res){
    return res.render("user_profile", {
        title: "User Profile"
    });
}

module.exports.posts = function(req, res){
    return res.end("<h1>Users Post</h1>");
}

module.exports.signUp = function(req, res){
    return res.render("user_sign_up", {
        title: "All Social | Sign Up"
    });
}

module.exports.signIn = function (req, res) {
    return res.render("user_sign_in", {
        title: "All Social | Sign In"
    });
}


// get create a user accounts
module.exports.create = function(req, res){
    // passowrd and confirm password should be same
    if(req.body.password != req.body.confirm_password){
        return res.redirect("back"); // redirect to sign up page
    }

    // email should be unique in database
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log("Error while finding the email in database");
            return;
        }

        if(!user){
            // create the account using this email
            User.create(req.body, function(err, user){
                if (err) {
                    console.log("Error while creating the account in database");
                    return;
                }
        
                return res.redirect("/users/sign-in");
            });
        }else{
            return res.redirect("back");
        }

    });
}

// user login and creating sesion for the user
module.exports.createSession = function(req, res){
    // TODO
};

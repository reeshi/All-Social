const User = require("../models/user");

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){console.log("Error in finding the user"); return;}

        return res.render("user_profile", {
            title: "User Profile", 
            profile_user: user
        });
    });
}

// update a profile 
module.exports.update = function(req, res){
    // check the authorized
    if(req.user.id == req.params.id){
        // update the profile information
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            if(err){console.log("Error in updating the profile"); return;}
            req.flash("Success", "Profile Updated Successfully!")
            return res.redirect("back");
        });

    }else{
        // the user is not authorized to update the profile
        req.flash("Error", "Your are not authorized to update this profile");
        return res.status(401).send("Unauthorized");
    }
}


module.exports.posts = function(req, res){
    return res.end("<h1>Users Post</h1>");
}

module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect("/users/profile");
    }

    return res.render("user_sign_up", {
        title: "All Social | Sign Up"
    });
}

module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/profile");
    }

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
    req.flash("Success", "Logged in Successfully");
    return res.redirect("/");
};


module.exports.destroySession = function(req, res){
    req.flash("Success", "You Have Logged Out");
    req.logout();
    
    return res.redirect("/");
}
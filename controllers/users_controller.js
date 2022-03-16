const User = require("../models/user");
const fs = require("fs");
const path = require("path");

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
module.exports.update = async function(req, res){
    // check the authorized
    if(req.user.id == req.params.id){
        // update the profile information
       try{

            let user = await User.findById(req.params.id);
           User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log("*****Multer Error: ",err);
                    return;
                }

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    // if profile already exist remove that and then update it
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, "..", user.avatar));
                    }

                    // this is saving the path of the uploaded file into the avatar field in the user.
                    user.avatar = User.avatarPath + "/" + req.file.filename;
                }

                user.save();

                req.flash("Success", "Profile Updated");
                return res.redirect("back");
            });

       }catch(err){
           console.log(err);
           req.flash("Error", err);
           return res.redirect("back");
       }

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
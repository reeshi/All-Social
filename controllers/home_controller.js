const Post = require("../models/post");
const User = require("../models/user");

// home controller
module.exports.home = function(req, res){
    // fetch all post from database
    // and populate the user
    Post.find({})
        .populate("user")
        .populate({
            path: "comments", 
            populate: {
                path: "user"
            }
        })
        .exec(function(err, posts){
            if(err){
                console.log("Error in fetching the posts", err);
                return;
            }

            User.find({}, function(err, all_users){
                if(err){console.log("Error in finding all the user"); return;}
                res.render("home", {
                    title: "All Social | Home",
                    posts: posts,
                    all_users: all_users
                });
            });
        });
}
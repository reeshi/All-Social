const Post = require("../models/post");

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

            res.render("home", {
                title: "All Social | Home",
                posts: posts
            })
        });
}
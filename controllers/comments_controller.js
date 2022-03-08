const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = function(req, res){
    // check if a post exist
    Post.findById(req.body.post, function(err, post){
        if(err){
            console.log("Error in the fetching post while commenting");
            return;
        }

        // if post exist
        if(post){
            // create a comment 
            Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            }, function(err, comment){
                if(err){
                    console.log("Error in creating the comment");
                    return;
                }

                // now save that comment in that post
                post.comments.push(comment);
                // whenever you updated something call save() so that it will update in the database
                post.save();

                res.redirect("/");
            });
        }
    });
}
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

                res.redirect("back");
            });
        }
    });
}

// deleting a comment
module.exports.destroy = function(req, res){
    // check comment exist in database
    Comment.findById(req.query.commentId, function(err, comment){
        if(err){console.log("Error in finding the comment"); return;}

        if(comment){
            // check whether the user is authorize to delete this comment
            if(comment.user == req.user.id || req.query.postUserId == req.user.id){
                let postId = comment.post;
                comment.remove();
                // deleting from the post model
                Post.findByIdAndUpdate(postId, {$pull: {comments: req.query.commentId}}, function(err, post){
                    return res.redirect("back");
                });

            }else{
                return res.redirect("back");
            }
        }
    });
}
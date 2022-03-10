const Post = require("../models/post");
const Comment = require("../models/comment");

// creating a new post
module.exports.create = function (req, res) {
    Post.create({
        content: req.body.content,
        user: req.user.id
    }, function (err, newPost) {
        if (err) {
            console.log("Error in creating a new Post");
            return;
        }
        
        return res.redirect("/");
    });
}


// deleting a post
module.exports.destroy = function(req, res){
    // check, whether a post is exist in database
    Post.findById(req.params.id, function(err, post){
        if(err){console.log("error in finding the post"); return;}

        //post exist
        if(post){
            // check whether a user is authorize to delete this post
            if(post.user == req.user.id){
                post.remove();

                // deleting the comment of this post also
                Comment.deleteMany({post: req.params.id}, function(err){
                    if(err){
                        console.log("error in deleting the comment");
                        return;
                    }
                });

                // back to the previous page
                return res.redirect("back");
            }else{
                return res.redirect("back");
            }
        }
    });
}
const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");

// creating a new post
module.exports.create = async function (req, res) {
    try{

        let post = await Post.create({
            content: req.body.content,
            user: req.user.id
        });

        let popPost = await Post.findById(post._id).populate("user", "-password");

        if(req.xhr){
            return res.status(200).json({
                data:{
                    post: popPost
                },
                message: "Post Created"
            });
        }

        req.flash("Success", "Post Published!");
        return res.redirect("back");

    }catch(err){
        req.flash("Error", err);
        return res.redirect("back");
    }
}


// deleting a post
module.exports.destroy = async function(req, res){
    try{
        // check, whether a post is exist in database
        let post = await Post.findById(req.params.id);
        //post exist
        if (post) {
            // check whether a user is authorize to delete this post
            if (post.user == req.user.id) {

                // delete the associated likes for the post and all it comments likes to
                await Like.deleteMany({likeable: post, onModel: "Post"});
                await Like.deleteMany({_id: {$in: post.comments}});

                post.remove();

                // deleting the comment of this post also
                await Comment.deleteMany({ post: req.params.id });

                if(req.xhr){
                    return res.status(200).json({
                        data: {
                            post_id : req.params.id
                        },
                        message: "Post Deleted"
                    });
                }

                // back to the previous page
                req.flash("Success", "Post and associate comments are deleted");
                return res.redirect("back");
            } else {
                req.flash("Error", "You are not authorized to delete this Post")
                return res.redirect("back");
            }
        }

    }catch(err){
        req.flash("Error", err);
        return res.redirect("back");
    }
    
}
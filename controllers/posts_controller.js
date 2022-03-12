const Post = require("../models/post");
const Comment = require("../models/comment");

// creating a new post
module.exports.create = async function (req, res) {
    try{

        await Post.create({
            content: req.body.content,
            user: req.user.id
        });

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
                post.remove();

                // deleting the comment of this post also
                await Comment.deleteMany({ post: req.params.id });

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
const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments_mailer");

module.exports.create = async function(req, res){
   try{
       // check if a post exist
       let post = await Post.findById(req.body.post);
       // if post exist
       if (post){
           // create a comment 
           let comment = await Comment.create({
               content: req.body.content,
               user: req.user._id,
               post: req.body.post
           });

           // now save that comment in that post
           post.comments.push(comment);
           // whenever you updated something call save() so that it will update in the database
           post.save();

           let popComment = await Comment.findById(comment._id).populate("user", "-password").populate("post");
           commentsMailer.newComment(popComment);

           if(req.xhr){
               return res.status(200).json({
                   data: {
                       comment: popComment
                   },
                   message: "Comment is created"
               });
           }

           req.flash("Success", "Comment added");
           res.redirect("back");
       }
   }catch(err){
        req.flash("Error", err);
        return res.redirect("back");
   }
}

// deleting a comment
module.exports.destroy = async function(req, res){
    try{
        // check comment exist in database
        let comment = await Comment.findById(req.query.commentId);
        if (comment) {
            // check whether the user is authorize to delete this comment
            if (comment.user == req.user.id || req.query.postUserId == req.user.id) {
                let postId = comment.post;
                comment.remove();
                // deleting from the post model
                await Post.findByIdAndUpdate(postId, { $pull: { comments: req.query.commentId } });

                if (req.xhr) {
                    return res.status(200).json({
                        data: {
                            comment_id: req.query.commentId
                        },
                        message: "Comment is deleted"
                    });
                }

                req.flash("Success", "Comment Deleted")
                return res.redirect("back");
            } else {
                req.flash("Error", "Your are not authorized to delete this comment");
                return res.redirect("back");
            }
        }
        
    }catch(err){
        req.flash("Error", err);
        return res.redirect("back");
    }
}
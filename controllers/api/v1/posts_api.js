const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function(req, res){

    let posts = await Post.find({})
        .sort("-createdAt")
        .populate("user")
        .populate({
            path: "comments",
            options: { sort: "-createdAt" },
            populate: {
                path: "user"
            },
        });

    return res.status(200).json({
        message: "Api successfull",
        post: posts
    });
}


// deleting a post
module.exports.destroy = async function (req, res) {
    try {
        // check, whether a post is exist in database
        let post = await Post.findById(req.params.id);
        //post exist
        if (post) {
            // check whether a user is authorize to delete this post
            if (post.user == req.user.id) {
                post.remove();

                // deleting the comment of this post also
                await Comment.deleteMany({ post: req.params.id });

            
                return res.status(200).json({
                    message: "Post and associated comments are deleted"
                });

            } else {
                return res.status(401).json({
                    message: "You are not authorized to delete this Post"
                });
            }
        }

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

}
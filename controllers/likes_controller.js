const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");


module.exports.toggleLike = async function(req, res){
    try{
        // url --> like/toggleLike/?id=abcdef&type=Post_OR_Comment
        let likeable;
        let deleted = false;

        if(req.query.type == "Post"){
            likeable = await Post.findById(req.query.id).populate("likes");
        }else{
            likeable = await Comment.findById(req.query.id).populate("likes");
        }

        // check if a like already exist
        let existingLike = await Like.findOne({
            user: req.user._id,
            likeable: req.query.id,
            onModel: req.query.type
        });

        // if a like already exist then deleted it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            deleted = true;
        }else{
            // else make a new like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type       
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }
        
        return res.status(200).json({
            message: "Request Successfull",
            data: {
                deleted: deleted
            }
        });


    }catch(err){
        console.log("Error in toggle Like", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
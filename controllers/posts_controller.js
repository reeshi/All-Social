const Post = require("../models/post");

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
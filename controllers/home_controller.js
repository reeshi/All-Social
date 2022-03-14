const Post = require("../models/post");
const User = require("../models/user");

// home controller
// convert the code into asyn / await
module.exports.home = async function(req, res){
    // fetch all post from database
    // and populate the user
    try {
        let posts = await Post.find({})
            .sort("-createdAt")
            .populate("user")
            .populate({
                path: "comments",
                options: {sort: "-createdAt"},
                populate: {
                    path: "user"
                },
            });

        let users = await User.find({});
        
        return res.render("home", {
            title: "All Social | Home",
            posts: posts,
            all_users: users
        });

    } catch (err) {
        console.log(`Error ${err}`);
        return;
    }
}
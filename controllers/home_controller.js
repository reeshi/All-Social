const Post = require("../models/post");
const User = require("../models/user");

// home controller
// convert the code into asyn / await
module.exports.home = async function (req, res) {
    // fetch all post from database
    // and populate the user
    try {
        let posts = await Post.find({})
            .sort("-createdAt")
            .populate([
                { path: "user" },
                {
                    path: "comments",
                    populate: [
                        { path: "user" },
                        { path: "likes" }
                    ],
                    options: { sort: "-createdAt" }
                },
                { path: "likes" }
            ]);

        // let currentUser = await User.findById(req.user.id).populate("friendships");

        let users = await User.find({});
        
        let allFriends = [];

        if(req.user != undefined){
            let currUserFriends = await User.findById(req.user.id)
                .populate([
                    {
                        path: "friendships",
                        populate: [
                            { path: "from_user" },
                            { path: "to_user" }
                        ]
                    }
                ]);



            currUserFriends.friendships.find((value) => {
                if (value.to_user._id != req.user.id) {
                    allFriends.push(value.to_user);
                } else {
                    allFriends.push(value.from_user);
                }
            });
        }
        

        return res.render("home", {
            title: "All Social | Home",
            posts: posts,
            all_users: users,
            friends: allFriends
        });

    } catch (err) {
        console.log(`Error ${err}`);
        return;
    }
}
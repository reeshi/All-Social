module.exports.profile = function(req, res){
    return res.render("user_profile", {
        title: "User Profile"
    });
}

module.exports.posts = function(req, res){
    return res.end("<h1>Users Post</h1>");
}
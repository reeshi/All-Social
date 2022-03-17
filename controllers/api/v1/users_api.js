const User = require("../../../models/user");
const jwt = require("jsonwebtoken");


// user login and creating sesion for the user
module.exports.createSession = async function (req, res) {
    try{

        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: "Invalid Username or password"
            });
        }

        return res.status(200).json({
            message: "Sign in successful, here is your token, please keep it safe ",
            data: {
                token: jwt.sign(user.toJSON(), "codiel", {expiresIn: "1000000"})
            }
        });

    }catch(err){
        console.log("******", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
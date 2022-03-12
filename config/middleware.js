module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        "Success": req.flash("Success"),
        "Error": req.flash("Error")
    }

    next();
}
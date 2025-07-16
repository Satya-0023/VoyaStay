const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js");


module.exports.rendersignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const registeredUser = await User.register(newuser, password);
        console.log(registeredUser);
        // Automatically log in the user after registration

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            // After successful registration, redirect to the listings page or any other page
            req.flash("success", "Welcome to the application!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // Default redirect URL
    res.redirect(redirectUrl); // Redirect to a specific page after login
}

module.exports.logout = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You are not logged in!");
        return res.redirect("/login");
    }
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
}
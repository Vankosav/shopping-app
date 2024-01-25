const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

const bodyParser = require("body-parser");
bodyParser.urlencoded({ extended: false });

const User = require("../models/User.model");
const Profile = require("../models/Profile.model");




const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
/* GET home page */

router.get("/signup", isLoggedOut,  (req, res, next) => {
  res.render("signup.hbs");
});

router.post("/signup", isLoggedOut, async (req, res, next) => {
    const { username, email, password, password2 } = req.body;

    if(username === "" || email === "" || password === "" || password2 === ""){
        res.render("signup.hbs", { errorMessage: "Please fill in all the fields" });
        return;
    }

    if(password !== password2){
        res.render("signup.hbs", { errorMessage: "Passwords don't match" });
        return;
    }

    if(password.length < 8){
        res.render("signup.hbs", { errorMessage: "Password must be at least 8 characters" });
        return;
    }
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            // User with the same username already exists
            res.render("signup.hbs", { errorMessage: "Username already taken. Please choose a different username." });
            return;
        }

        // Continue with user creation if the username is unique
        const newUser = await User.create(req.body);

        req.session.currentUser = {
            _id: newUser._id,
            username: newUser.username,
        };
        //console.log("User created:", newUser);
        res.redirect(`/profile/create-profile?name=${newUser.username}`);
        console.log(newUser.username);
    } catch (error) {   
        console.log(error);

        // Handle other errors (e.g., validation errors) by rendering the signup view with an error message
        res.render("signup.hbs", { errorMessage: error.message || "An error occurred during user creation." });
    }
});




router.get("/login", isLoggedOut, (req, res, next) => {
    res.render("login.hbs");
});


router.post("/login", isLoggedOut, async (req, res, next) => {
    const { username, password } = req.body;

    if (username === "" || password === "") {
        res.render("login.hbs", { errorMessage: "Please fill in all the fields" });
        return;
    }
    if (password.length < 8) {
        return res.status(400).render("user/login", {
            errorMessage: "Your password needs to be at least 8 characters long.",
        });
    }

    try {
        const user = await User.findOne({ username });

        // If the user isn't found, send an error message that the user provided wrong credentials
        if (!user) {
            res.status(400).render("user/login", { errorMessage: "Wrong credentials." });
            return;
        }

        req.session.currentUser = user.toObject();
        // Remove the password field
        delete req.session.currentUser.password;

        console.log("User logged in:", req.session.currentUser);

        const profile = await Profile.findOne({ user: user._id });

        if (profile) {
            console.log("Profile exists for the user");
            req.session.currentUser.profile = profile;
            res.redirect(`/profile/profile-page?id=${user._id}`);
        } else {
            console.log("Profile does not exist for the user");
            res.redirect(`/profile/create-profile?name=${user.username}`);
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});





  router.get("/logout", isLoggedIn, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).render("user/logout", { errorMessage: err.message, isLoggedIn: req.isLoggedIn });
        return;
      }
  
      res.redirect("/");
    });
  });
  

module.exports = router;

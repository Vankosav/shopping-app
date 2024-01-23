const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");

const bodyParser = require("body-parser");
bodyParser.urlencoded({ extended: false });

const User = require("../models/User.model");
const Profile = require("../models/Profile.model");


const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");



router.get("/create-profile", isLoggedIn, async (req, res, next) => {
    try {
        const userId = req.session.currentUser ? req.session.currentUser._id : null;
    
        if (!userId) {
          // Handle the case where _id is not found in the session
          res.send("User not found in session");
          return;
        }
    

        const user = await User.findById(req.session.currentUser._id);
        console.log(user)
        const name = user.name;
        console.log(name)
        res.render("profile/create-profile", { name, isLoggedIn: req.isLoggedIn });
      } catch (error) {
        console.log(error);
        res.send("Error");
      }
  });
  
  
  router.post("/create-profile", isLoggedIn, async (req, res, next) => {
    try {
      const { name, lastName, country, address, phoneNumber, postalCode, city, bankAccount } = req.body;
  
      // Create a new profile with the user association
      const newProfile = await Profile.create({
        user: req.session.currentUser._id,
        name,
        lastName,
        country,
        address,
        phoneNumber,
        postalCode,
        city,
        bankAccount,
      });
  
      // Update the session with the new profile's details
      req.session.currentUser = {
        _id: newProfile.user,
        name: newProfile.name,
      };
  
      console.log("Redirecting to the profile page");
      res.redirect(`/profile/profile-page?name=${newProfile.name}`);
  
    } catch (error) {
      console.error(error);
      res.send("Error");
    }
  });
  
router.get("/profile-page/:id", isLoggedIn, async (req, res, next) => {
    try {
      const userId = req.session.currentUser ? req.session.currentUser._id : null;
  
      if (!userId) {
        // Handle the case where _id is not found in the session
        res.send("User not found in session");
        return;
      }
  
      const user = await User.findById(req.session.currentUser._id);
      const profile = await Profile.findOne({ user: req.session.currentUser._id });
  
      res.render("profile/profile-page", { user, profile, isLoggedIn: req.isLoggedIn });
    } catch (error) {
      console.log(error);
      res.send("Error");
    }
  } );


  module.exports = router;
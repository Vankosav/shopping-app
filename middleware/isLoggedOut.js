const User = require("../models/User.model");


module.exports = (req, res, next) => {
  

  const { username, password } = req.body;
  const user = User.findOne({ username, password });

    // checks if the user is logged in when trying to access a specific page
    if (!user) {
      req.session.currentUser = {
        _id: user._id,
        username: user.username,
      password: user.password,
      };
    req.isLoggedIn = true;  // User is logged in
  } else {
    req.isLoggedIn = false;  // User is not logged in
  }
  next();
};

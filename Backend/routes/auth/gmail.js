const router = require("express").Router();
const passport = require("passport");
const { requireQueryUserId } = require("../../middleware/auth");
const UserModel = require("../../models/user");


router.get('/', requireQueryUserId, (req, res, next) => {
  req.session.service_name = 'gmail';
  next()
}, passport.authenticate('google', {
  scope: [
      'email',
      'profile',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.labels'
  ],
  accessType: 'offline'
}));

router.get('/save', (req, res) => {

  if (!req.user || !req.session.user)
  {
    return res.status(401).json({message: "Google Gmail link account failed"});
  }

  // Save to User
  console.log("Save Gmail Token!!");
  

  let account = req.session.user;
  UserModel.updateOne(
      { _id: account._id },
      {
          $set: {
            gmail: {
              user_id: req.user,
              email: req.session.google.email,
              token: req.session.google.token,
              refresh_token: req.session.google.refresh_token,
              expiry_date: Math.floor((Date.now()) / 1000) + req.session.google.expires_in,
            },
          },
      },
      (err, data) => {
          if (err)
          {
              return next(err);
          }
        
          return res.status(200).send("You can close the window");
      }
  );
});

module.exports = router;
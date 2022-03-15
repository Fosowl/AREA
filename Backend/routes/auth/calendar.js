const router = require("express").Router();
const passport = require("passport");
const UserModel = require("../../models/user");
const { requireQueryUserId } = require("../../middleware/auth");


router.get('/', requireQueryUserId, (req, res, next) => {
  req.session.service_name = 'calendar';
  next()
}, passport.authenticate('google', {
  scope: [
      'email',
      'profile',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
  ],
  accessType: 'offline'
}));

router.get('/save', (req, res) => {

  if (!req.user || !req.session.user)
  {
    return res.status(401).json({message: "Google Calendar link account failed"});
  }

  console.log("Save Calendar Token!!");

  // Save to User

  let account = req.session.user;
  UserModel.updateOne(
      { _id: account._id },
      {
          $set: {
            calendar: {
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
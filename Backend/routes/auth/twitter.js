const router = require("express").Router();
const passport = require("passport");
const { requireUserId, requireQueryUserId } = require("../../middleware/auth");
const UserModel = require("../../models/user");

router.get('/', requireQueryUserId, passport.authenticate('twitter'));

router.get('/callback',
  passport.authenticate('twitter',
  {
    successRedirect: '/auth/twitter/success',
    failureRedirect: '/auth/twitter/failure',
    session: true,
  })
);

router.get('/success', (req, res) => {

  if (!req.user || !req.session.user)
  {
    return res.status(401).json({message: "Twitter link account failed"});
  }

  let account = req.session.user;
  UserModel.updateOne(
      { _id: account._id },
      {
          $set: {
              twitter: {
                user_id: req.user,
                token: req.session.twitter.token,
                token_secret: req.session.twitter.token_secret,
                timestamp: Math.floor((Date.now()) / 1000).toString(),
              },
          },
      },
      (err, data) => {
          if (err)
          {
              next(err);
              return;
          }
        
          return res.status(200).send("You can close the window");
      }
  );
});

router.get('/failure', (req, res) => {

});

// router.post('/save', requireUserId, async (req, res) => {

//   if (!req.user)
//   {
//     return res.status(401).json({message: "Twitter link account failed"});
//   }

//   let account = req.session.user;

//   // Save to User
//   account.twitter.user_id = req.user;
//   account.twitter.token = req.session.twitter.token;
//   account.twitter.token_secret = req.session.twitter.token_secret;
//   account.twitter.timestamp = Math.floor((Date.now()) / 1000).toString();
//   account.save();

//   res.status(200).json({ message: "Successfully Saved" });
// });

module.exports = router;
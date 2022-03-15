const router = require("express").Router();
const passport = require("passport");

router.get('/success', (req, res) => {
  return res.redirect('/auth/' + req.session.service_name + '/save')
});

router.get('/failure', (req, res) => {
  return res.status(401).send("An error occur! You can close the window");
});

router.get('/callback',
  passport.authenticate('google', {
      successRedirect: '/auth/google/success',
      failureRedirect: '/auth/google/failure'
  })
);

module.exports = router;
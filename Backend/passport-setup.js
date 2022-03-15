
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const TwitterStrategy = require("passport-twitter");
const ServiceController = require('./controllers/service_controller')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    passReqToCallback: true
}, function(req, accessToken, refreshToken, params, profile, done) {
    req.session.google = {
        email: profile.email,
        token: accessToken,
        refresh_token: refreshToken,
        expires_in: params.expires_in
    }

    const scopes = params.scope.split(' ');
    scopes.forEach((scope, idx, array) => {

        try
        {
            // https://www.googleapis.com/auth/<name>.<permission>
            // 'permission' parameter can be 'readonly', 'send', ...
            const name = scope.replace('https://www.googleapis.com/auth/', '').split('.')[0];

            // If the service name exist, this function will not throw a error
            ServiceController.get(name);

            req.session.google_service = name;
            return done(null, profile);
        }
        catch (err)
        {
        }
    });
}));

passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_APP_KEY,
        consumerSecret: process.env.TWITTER_APP_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK,
        passReqToCallback: true
    },
    async function(req, token, tokenSecret, profile, done) {

        req.session.twitter = {
            token,
            token_secret: tokenSecret
        }
        return done(null, profile);
}));

passport.serializeUser((user, done) => {
/*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
*/
    // console.log(user.id);
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
/*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
*/
    done(null, id);

    // UserModel.findById(id)
    //     .then(user => {
    //         done(null, user);
    //     })
    //     .catch(e => {
    //         done(new Error("Failed to deserialize an user"));
    //     });
});
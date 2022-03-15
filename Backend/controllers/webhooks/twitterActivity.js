
const twitterWebhooks = require("twitter-webhooks");

const userActivityWebhook = twitterWebhooks.userActivity({
    serverUrl: process.env.SERVER_URL,
    route: '/webhook/twitter',
    consumerKey: process.env.TWITTER_APP_KEY,
    consumerSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    appBearerToken: process.env.TWITTER_BEARER,
    environment: 'AreaDev',
});

module.exports = userActivityWebhook;
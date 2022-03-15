
const fs = require('fs');
const Twitter = require('twitter-lite');
const twitterWebhooks = require("twitter-webhooks");
const fetch = require('node-fetch');
const { check_if_is_undefined_and_throw, check_if_is_not_typeof_and_throw } = require("../../utils/check");
const { APIError, http_status } = require('../../utils/errors_handle');

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

userActivityWebhook.getWebhooks().then((res) => {

    if (res.environments[0].webhooks.length > 0)
    {
        // console.log("Webhooks: ");
        // console.log(res.environments[0].webhooks);
        if (res.environments[0].webhooks[0].valid === false)
        {
            console.log(`Unregister Webhook: ${res.environments[0].webhooks[0]}`);
            userActivityWebhook.unregister({webhookId: res.environments[0].webhooks[0].id})
        }
    }
    else
    {
        userActivityWebhook.register()
            .then((value) => console.log("Register Webhook... Success"))
            .catch((err) => {console.error("Register Webhook... Failed"); console.error(err)});
    }
})
.catch(console.error);


/**  **/
async function init_webhook(user, action)
{
    if (!user.twitter || !user.twitter.user_id)
    {
        throw new APIError("Account Link", http_status.INTERNAL_SERVER, 'No Twitter Account link with this account');
    }

    console.log("Init Twitter Webhook!!");

    const args = {
        userId: `${user.twitter.user_id}`,
        accessToken: user.twitter.token,
        accessTokenSecret: user.twitter.token_secret,
    }

    const result = await userActivityWebhook.isSubscribed(args);
    if (!result)
    {
        console.log("Subscribe to user!");
        userActivityWebhook.subscribe(args);
    }
}

async function deinit(user)
{
    if (!user.twitter.user_id)
    {
        throw new APIError("Account Link", http_status.INTERNAL_SERVER, 'Twitter Account already unlink to this account');
    }

    console.log("Deinit Twitter Webhook!!");

    const args = {
        userId: `${user.twitter.user_id}`,
        accessToken: user.twitter.token,
        accessTokenSecret: user.twitter.token_secret,
    }

    const result = await userActivityWebhook.isSubscribed(args);
    if (result)
    {
        console.log("Unsubscribe to user!");
        await userActivityWebhook.unsubscribe(args);
    }

    const promise = new Promise((resolve, reject) => {
        user.twitter = undefined
        user.save(() => resolve())
    })
    await promise
}

/**
 *      ACTIONS
 * -----------------------
 * */

// 'actions' is only use to know if an action or not, there is no function execution like reactions
const actions = new Map();
actions.set("on_tweet_create", {
    check_data: no_check_data,
    info: {
        pretty_name: "My Tweet",
        description: "Triggers when you tweet something new"
    }
});
actions.set("on_follow", {
    check_data: no_check_data,
    info: {
        pretty_name: "You Follow",
        description: "Triggers when you follow someone"
    }
});
actions.set("on_unfollow", {
    check_data: no_check_data,
    info: {
        pretty_name: "You Unfollow",
        description: "Triggers when you unfollow someone"
    }
});
actions.set("on_favorite", {
    check_data: no_check_data,
    info: {
        pretty_name: "Liked Tweet",
        description: "Triggers when you like a tweet"
    }
});

function no_check_data(data)
{
}


/**
 *      REACTIONS
 * -----------------------
 * */

const reactions = new Map();
reactions.set("send_tweet", {
    func: send_tweet,
    check_data: check_send_tweet,
    info: {
        pretty_name: "Create Tweet",
        description: "Create a tweet"
    }
});
reactions.set("follow", {
    func: follow,
    check_data: check_follow,
    info: {
        pretty_name: "Follow",
        description: "Follow someone on Twitter"
    }
});
reactions.set("update-profile-image", {
    func: update_profile_image,
    check_data: check_update_profile_image,
    info: {
        pretty_name: "Update Profile Image",
        description: "Update your profile image on Twitter"
    }
});

async function send_tweet(data, user_twitter)
{
    console.log("Send Tweet!");
    try
    {
        const client = new Twitter({
            // subdomain: "api", // "api" is the default (change for other subdomains)
            consumer_key: process.env.TWITTER_APP_KEY,
            consumer_secret: process.env.TWITTER_APP_SECRET,
            access_token_key: user_twitter.token,
            access_token_secret: user_twitter.token_secret,
        });

        if (data.text !== undefined)
        {
            const user_info = await client.get('users/show', { user_id: user_twitter.user_id });
            data.text = data.text.replace('$USERNAME', user_info.screen_name);

            client.post('statuses/update', { status: data.text })
            .then(result => {
                console.log('Tweet send successfully: ' + data.text);
            })
            .catch(console.error);
        }
    }
    catch (err)
    {
        console.error(err);
    }
}

async function follow(data, user_twitter)
{
    console.log("Follow!");

    const client = new Twitter({
        // subdomain: "api", // "api" is the default (change for other subdomains)
        consumer_key: process.env.TWITTER_APP_KEY,
        consumer_secret: process.env.TWITTER_APP_SECRET,
        access_token_key: user_twitter.token,
        access_token_secret: user_twitter.token_secret,
    });

    if (data.user_to_follow !== undefined)
    {
        client.post('friendships/create', { screen_name: data.user_to_follow })
        .then(result => {
            console.log('Followed ' + data.user_to_follow + ' successfully!');
        })
        .catch(console.error);
    }
}

async function update_profile_image(data, user_twitter)
{
    console.log("Update Profile!");

    const client = new Twitter({
        consumer_key: process.env.TWITTER_APP_KEY,
        consumer_secret: process.env.TWITTER_APP_SECRET,
        access_token_key: user_twitter.token,
        access_token_secret: user_twitter.token_secret,
    });

    if (data.image !== undefined)
    {
        var buffer;

        if (data.image.startsWith('https://', 0) || data.image.startsWith('http://', 0))
        {
            const response = await fetch(data.image);
            buffer = await response.buffer();
            fs.writeFileSync('./image.jpg', buffer);
            buffer = fs.readFileSync('./image.jpg', {encoding: 'base64'});
        }
        else
        {
            buffer = fs.readFileSync(data.image, {encoding: 'base64'});
        }

        client.post('account/update_profile_image', { image: buffer })
            .then(result => {
                console.log('Profile Changed successfully!');
            })
            .catch(console.error);
    }
}

function check_send_tweet(data)
{
    check_if_is_undefined_and_throw(data.text, "Missing 'text' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.text, 'string', "'text' field in 'reaction.data' is not a string");
}

function check_follow(data)
{
    check_if_is_undefined_and_throw(data.user_to_follow, "Missing 'user_to_follow' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.user_to_follow, 'string', "'user_to_follow' field in 'reaction.data' is not a string");
}

function check_update_profile_image(data)
{
    check_if_is_undefined_and_throw(data.image, "Missing 'image' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.image, 'string', "'image' field in 'reaction.data' is not a string");

    if (!data.image.startsWith('https://', 0) && !data.image.startsWith('http://', 0))
    {
        throw Error("'image' string in 'reaction.data' is not an url, you must include 'http://' or 'https://'");
    }
}




function execute(reactionName, data, user)
{
    check_if_reaction_event_exist(reactionName);

    const reaction = reactions.get(reactionName);
    reaction.func(data, user.twitter);
}

function check_if_action_event_exist(actionName)
{
    check_if_is_undefined_and_throw(actions.get(actionName), `Unknown action '${actionName}'`);
}

function check_require_action_data(action)
{
    const action_func = actions.get(action.event);
    check_if_is_undefined_and_throw(action_func.check_data, "Unknown action.check_data '" + action.event + "'");

    action_func.check_data(action.data);
}

function check_if_reaction_event_exist(reactionName)
{
    check_if_is_undefined_and_throw(reactions.get(reactionName), `Unknown reaction '${reactionName}'`);
}

function check_require_reaction_data(reaction)
{
    const reaction_func = reactions.get(reaction.event);
    check_if_is_undefined_and_throw(reaction_func.check_data, "Unknown reaction.check_data '" + reaction.event + "'");

    reaction_func.check_data(reaction.data);
}

function get_infos()
{
    let action_infos = [];
    actions.forEach((value, key) => {
        value.info.name = key;
        action_infos.push(value.info);
    });

    let reaction_infos = [];
    reactions.forEach((value, key) => {
        value.info.name = key;
        reaction_infos.push(value.info);
    });
    
    return {
        name: Service.name,
        pretty_name: Service.pretty_name,
        description: Service.description,
        logo_url: Service.logo_url,

        actions: action_infos,
        reactions: reaction_infos
    };
}

const Service = {
    name: "twitter",
    pretty_name: "Twitter",
    description: "Twitter is a free social service that allows registered members to broadcast tweets.",
    logo_url: "http://assets.stickpng.com/images/580b57fcd9996e24bc43c53e.png",

    init_webhook,
    deinit,
    execute,
    check_if_action_event_exist,
    check_if_reaction_event_exist,
    check_require_reaction_data,
    check_require_action_data,

    get_infos,
}
module.exports = Service;
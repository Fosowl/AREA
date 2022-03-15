
const crypto = require('crypto');
const UserModel = require('../../models/user');

const { execute_action } = require("../../utils/execution");

async function get_webhook(req, res)
{
    if (req.query.crc_token)
    {
        console.log({
            response_token: crypto.createHmac('sha256', process.env.TWITTER_APP_SECRET).update(req.query.crc_token).digest('base64')
        });
        return res.status(200).json({
            response_token: 'sha256=' + crypto.createHmac('sha256', process.env.TWITTER_APP_SECRET).update(req.query.crc_token).digest('base64')
        });
    }
}

async function post_webhook(req, res)
{
    console.log("post_webhook_twitter!");

    res.sendStatus(200);

    const payload = req.body;
    if (typeof payload.for_user_id === 'string')
    {
        UserModel.findOne({'twitter.user_id': payload.for_user_id}, (err, user) => {
            if (!err)
            {
                for (let eventName in payload)
                {
                    if (eventName === 'for_user_id')
                    {
                        continue;
                    }

                    const events = payload[eventName];
                    eventName = eventName.replace('_events', '');
                    eventName = 'on_' + eventName;

                    if (eventName == 'on_follow')
                    {
                        eventName = 'on_' + events[0].type;
                    }

                    execute_action(user, {
                        service: "twitter",
                        event: eventName
                    });
                }
            }
        })
    }
}

module.exports = {
    get_webhook,
    post_webhook,
};

const { google } = require('googleapis');
const { check_if_is_undefined_and_throw, check_if_is_not_typeof_and_throw } = require("../../utils/check")
const { get_gmail_auth } = require("../../utils/auth_google")
const { APIError, http_status } = require('../../utils/errors_handle');

/**  **/
async function init_webhook(user, action)
{
    if (!user.gmail.user_id)
    {
        throw new APIError("Account Link", http_status.INTERNAL_SERVER, 'No Gmail Account link with this account');
    }

    console.log("Init Webhook Gmail!!");

    const auth = get_gmail_auth(user);
    const gmail = google.gmail({version: 'v1', auth});

    await gmail.users.watch({ userId: 'me',
          requestBody: {
            topicName: 'projects/lithe-altar-341406/topics/area',
          },
          labelIds: [
            'INBOX',
            'CATEGORY_UPDATES',
            'DRAFT',
            'CATEGORY_PROMOTIONS',
            'CATEGORY_SOCIAL',
            'CATEGORY_FORUMS',
            'TRASH',
            'CHAT',
            'SPAM',
           ],
          labelFilterAction: 'include'
       })
        .then((res) => {
            console.log(res.data);
            user.gmail.history_id = res.data.historyId;
            user.save();
        }).catch((err) => {
            console.log(err);
        });
}

async function deinit(user)
{
    if (!user.gmail)
    {
        throw new APIError("Account Link", http_status.INTERNAL_SERVER, 'Gmail Account already unlink to this account');
    }

    console.log("Deinit Gmail Webhook!!");

    const auth = get_gmail_auth(user);
    const gmail = google.gmail({version: 'v1', auth});

    try {
        await gmail.users.stop({
            userId: 'me'
        })

        let token = auth.credentials.refresh_token;
        const promise = new Promise((resolve, reject) => {
            auth.revokeToken(token, (err, body) => {
                if (!err)
                {
                    user.gmail = undefined;
                    user.save(() => resolve());
                }
                else
                {
                    reject(err)
                }
            });
        })
        await promise
    }
    catch (err) {
        if (err.message == 'invalid_grant')
        {
            user.gmail = undefined;
            user.save();
        }
        throw err
    }
}

/**
 *      ACTIONS
 * -----------------------
 * */

// 'actions' is only use to know if an action or not, there is no function execution like reactions
const actions = new Map();
actions.set("on_receive_new_mail", {
    check_data: check_on_receive_new_mail_data,
    info: {
        pretty_name: "Receive new e-mail",
        description: "Triggers when you receive a new e-mail"
    }
});
actions.set("on_remove_mail", {
    check_data: check_on_receive_new_mail_data,
    info: {
        pretty_name: "Remove e-mail",
        description: "Triggers when you remove an e-mail"
    }
});

actions.set("on_receive_new_mail_from", {
    check_data: check_on_receive_new_mail_from_data,
    info: {
        pretty_name: "Receive new e-mail from",
        description: "Triggers when you receive a new e-mail from the specified sender"
    }
});

actions.set("on_receive_new_mail_label", {
    check_data: check_on_receive_new_mail_label_data,
    info: {
        pretty_name: "Receive new e-mail label",
        description: "Triggers when you receive a new e-mail with the specified label"
    }
});
actions.set("on_remove_mail_with_label", {
    check_data: check_on_receive_new_mail_label_data,
    info: {
        pretty_name: "Remove e-mail with label",
        description: "Triggers when you remove an e-mail with the specified label"
    }
});

actions.set("on_assign_label", {
    check_data: check_on_assign_label_data,
    info: {
        pretty_name: "New Labeled Email",
        description: "Triggers when you label an e-mail"
    }
});
actions.set("on_remove_label", {
    check_data: check_on_assign_label_data,
    info: {
        pretty_name: "Remove Labeled Email",
        description: "Triggers when you delete a label from an e-mail"
    }
});


function check_on_receive_new_mail_data(data)
{
}

function check_on_receive_new_mail_from_data(data)
{
    check_if_is_undefined_and_throw(data, "Missing 'data' object in 'reaction' object");
    check_if_is_undefined_and_throw(data.from, "Missing 'from' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.from, 'string', "'from' field in 'reaction.data' is not a string")
}

function check_on_receive_new_mail_label_data(data)
{
    check_if_is_undefined_and_throw(data, "Missing 'data' object in 'reaction' object");
    check_if_is_undefined_and_throw(data.label, "Missing 'label' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.label, 'string', "'label' field in 'reaction.data' is not a string")
}

function check_on_assign_label_data(data)
{
    check_if_is_undefined_and_throw(data, "Missing 'data' object in 'reaction' object");

    check_if_is_undefined_and_throw(data.label, "Missing 'label' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.label, 'string', "'label' field in 'reaction.data' is not a string")
}



/**
 *      REACTIONS
 * -----------------------
 * */
const reactions = new Map();
reactions.set("send_mail", {
    func: send_mail,
    check_data: check_send_mail,
    info: {
        pretty_name: "Send Email",
        description: "Create and send a new email message"
    }
});
reactions.set("create_draft", {
    func: create_draft,
    check_data: check_create_draft,
    info: {
        pretty_name: "Create Draft",
        description: "Create (but do not send) a new email message"
    }
});
reactions.set("create_label", {
    func: create_label,
    check_data: check_create_label,
    info: {
        pretty_name: "Create Label",
        description: "Creates a new label"
    }
});


/** Creates a very basic email structure
 * @param to Email address to send to
 * @param from Email address to put as sender
 * @param subject The subject of the email [warn: encoding, see comment]
 * @param message The body of the email
 */
function make_email(params)
{
    params.subject = new Buffer.from(params.subject).toString("base64");

    const str = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      "MINE-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      `to: ${params.to} \n`,
      `from: ${params.from} \n`,
      `subject: =?UTF-8?B?${params.subject}?= \n\n`,
      params.message
    ].join("");
    return new Buffer.from(str)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
};

async function send_mail(data, user)
{
    console.log("Send Mail!");

    const auth = get_gmail_auth(user);
    const gmail = google.gmail({version: 'v1', auth});

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            // I'm fairly certain that the raw property is the most sure-fire way of telling the API what you want to send
            // This is actually a whole email, not just the body, see below
            raw: make_email({
                from: user.gmail.email,
                to: data.to,
                subject: data.subject,
                message: data.message
            })
        },
    })
    .catch(console.error);
}

async function create_draft(data, user)
{
    console.log("Create Draft!");

    const auth = get_gmail_auth(user);
    const gmail = google.gmail({version: 'v1', auth});

    await gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
            message: {
                raw: make_email({
                    from: user.gmail.email,
                    to: data.to,
                    subject: data.subject,
                    message: data.message
                })
            }
        },
    })
    .catch(console.error);
}

async function create_label(data, user)
{
    console.log("Create Label!");

    const auth = get_gmail_auth(user);
    const gmail = google.gmail({version: 'v1', auth});

    await gmail.users.labels.create({
        userId : 'me',
        requestBody: {
            labelListVisibility: 'labelShow',
            messageListVisibility : 'show',
            name: data.name,
        }
    })
    .catch(console.error);
}

/**
 *      CHECK DATA
 * -----------------------
 * */

function check_send_mail(data)
{
    check_if_is_undefined_and_throw(data.to, "Missing 'to' field in 'reaction.data' object");
    check_if_is_undefined_and_throw(data.subject, "Missing 'subject' field in 'reaction.data' object");
    check_if_is_undefined_and_throw(data.message, "Missing 'message' field in 'reaction.data' object");


    check_if_is_not_typeof_and_throw(data.to, 'string', "'to' field in 'reaction.data' is not a string")
    check_if_is_not_typeof_and_throw(data.subject, 'string', "'subject' field in 'reaction.data' is not a string")
    check_if_is_not_typeof_and_throw(data.message, 'string', "'message' field in 'reaction.data' is not a string")
}

function check_create_draft(data)
{
    check_if_is_undefined_and_throw(data.to, "Missing 'to' field in 'reaction.data' object");
    check_if_is_undefined_and_throw(data.subject, "Missing 'subject' field in 'reaction.data' object");
    check_if_is_undefined_and_throw(data.message, "Missing 'message' field in 'reaction.data' object");


    check_if_is_not_typeof_and_throw(data.to, 'string', "'to' field in 'reaction.data' is not a string")
    check_if_is_not_typeof_and_throw(data.subject, 'string', "'subject' field in 'reaction.data' is not a string")
    check_if_is_not_typeof_and_throw(data.message, 'string', "'message' field in 'reaction.data' is not a string")
}

function check_create_label(data)
{
    check_if_is_undefined_and_throw(data.name, "Missing 'name' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.name, 'string', "'name' field in 'reaction.data' is not a string")
}



function execute(reactionName, data, user)
{
    check_if_reaction_event_exist(reactionName);

    const reaction = reactions.get(reactionName);
    reaction.func(data, user);
}

function check_if_action_event_exist(actionName)
{
    check_if_is_undefined_and_throw(actions.get(actionName), "Unknown", "Unknown action '" + actionName + "'");
}

function check_require_action_data(action)
{
    const action_func = actions.get(action.event);
    check_if_is_undefined_and_throw(action_func.check_data, "Unknown", "Unknown action.check_data '" + action.event + "'");

    action_func.check_data(action.data);
}

function check_if_reaction_event_exist(reactionName)
{
    check_if_is_undefined_and_throw(reactions.get(reactionName), "Unknown", "Unknown reaction '" + reactionName + "'");
}

function check_require_reaction_data(reaction)
{
    const reaction_func = reactions.get(reaction.event);
    check_if_is_undefined_and_throw(reaction_func.check_data, "Unknown", "Unknown reaction.check_data '" + reaction.event + "'");

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
    name: "gmail",
    pretty_name: "Gmail",
    description: "Gmail is a free email service for individuals provided by Google.",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png",
    
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

const { google } = require('googleapis');
const { check_if_is_undefined_and_throw, check_if_is_not_typeof_and_throw, throw_error } = require("../../utils/check")
const { get_drive_auth } = require("../../utils/auth_google")
const uuid = require('node-uuid');
const { APIError, http_status } = require('../../utils/errors_handle');

const WEBHOOK_CHANGES_URL = process.env.SERVER_URL + "/webhook/drive/changes"

/**  **/
async function init_webhook(user, action)
{
    if (!user.drive.user_id)
    {
        throw new APIError("Account Link", http_status.INTERNAL_SERVER, 'No Drive Account link with this account');
    }

    console.log("Init Webhook Drive!!");

    if (user.drive && !user.drive.changes.channel_id)
    {
        init_watch(user);
    }
    else if (user.drive)
    {
        const expire_time = new Date(user.drive.changes.expiry_date * 1000);
        // console.log(((expire_time.getTime()) - Date.now()))
        if (((expire_time.getTime()) - Date.now()) <= 0)
        {
            console.log("Watch Expire!!!");

            const auth = get_drive_auth(user);
            const drive = google.drive({version: 'v3', auth});
            await drive.channels.stop({
                    requestBody: {
                        address: WEBHOOK_CHANGES_URL,
                        type: 'web_hook',
                        id: user.drive.changes.channel_id,
                        resourceId: user.drive.changes.resource_id
                    }
                }, async (err, result) => {
                    if (err)
                        return;
                    user.drive.changes.resource_id = undefined;
                    user.drive.changes.channel_id = undefined;
                    user.drive.changes.page_token = undefined;
                    await user.save();

                    init_watch(user);
                });
        }
    }
}

async function init_watch(user)
{
    const auth = get_drive_auth(user);
    const drive = google.drive({version: 'v3', auth});

    let start_page_token = (await drive.changes.getStartPageToken()).data.startPageToken;
    let body = await drive.changes.watch({
        pageToken: start_page_token,
        requestBody: {
            id: uuid.v1(),
            address: WEBHOOK_CHANGES_URL,
            type: 'web_hook',
        },
    });

    console.log("Changes Registry: " + body.data);
    user.drive.changes.resource_id = body.data.resourceId;
    user.drive.changes.channel_id = body.data.id;
    user.drive.changes.page_token = start_page_token;
    user.drive.changes.expiry_date = Math.floor((Date.now()) / 1000) + 3600;
    user.drive.changes.files = [];
    await user.save();
}

async function deinit(user)
{
    if (!user.drive)
    {
        throw new APIError("Account Link", http_status.INTERNAL_SERVER, 'Drive Account already unlink to this account');
    }

    console.log("Deinit Drive Webhook!!");

    const auth = get_drive_auth(user);
    const drive = google.drive({version: 'v3', auth});

    try {
        if (user.drive.changes)
        {
            await drive.channels.stop({
                requestBody: {
                    address: WEBHOOK_CHANGES_URL,
                    type: 'web_hook',
                    id: user.drive.changes.channel_id,
                    resourceId: user.drive.changes.resource_id
                }
            })
        }

        let token = auth.credentials.refresh_token;
        const promise = new Promise((resolve, reject) => {
            auth.revokeToken(token, (err, body) => {
                if (!err)
                {
                    user.drive = undefined;
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
            user.drive = undefined;
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

actions.set("on_any_file_created", {
    check_data: check_no_data,
    info: {
        pretty_name: "New File",
        description: "Triggers when any new file is added (inside of any folder)"
    }
});

actions.set("on_any_removed", {
    check_data: check_no_data,
    info: {
        pretty_name: "Any Removed",
        description: "Triggers when any file or folder is removed (inside of any folder)"
    }
});


function check_no_data(data)
{
}



/**
 *      REACTIONS
 * -----------------------
 * */
const reactions = new Map();

reactions.set("create_folder", {
    func: create_folder,
    check_data: check_create_folder,
    info: {
        pretty_name: "Create Folder",
        description: "Creates a new folder"
    }
});

reactions.set("create_file", {
    func: create_file,
    check_data: check_create_file,
    info: {
        pretty_name: "Create File from Text",
        description: "Create a new file from plain text"
    }
});



async function create_folder(data, user)
{
    console.log("Create Folder!");

    const auth = get_drive_auth(user);
    const drive = google.drive({version: 'v3', auth});

    await drive.files.create({
        requestBody: {
            name: data.name,
            mimeType: "application/vnd.google-apps.folder"
        }
    });
}

async function create_file(data, user)
{
    console.log("Create File!");

    const auth = get_drive_auth(user);
    const drive = google.drive({version: 'v3', auth});

    await drive.files.create({
        media: {
            mimeType: 'text/plain',
            body: data.content
        },
        requestBody: {
            name: data.name,
            mimeType: data.convert_to_doc ? 'application/vnd.google-apps.document' : undefined,
        }
    });
}


/**
 *      CHECK DATA
 * -----------------------
 * */


function check_create_folder(data)
{
    check_if_is_undefined_and_throw(data.name, "Missing 'name' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.name, 'string', "'name' field in 'reaction.data' is not a string");
}

function check_create_file(data)
{
    check_if_is_undefined_and_throw(data.name, "Missing 'name' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.name, 'string', "'name' field in 'reaction.data' is not a string");

    check_if_is_undefined_and_throw(data.content, "Missing 'content' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.content, 'string', "'content' field in 'reaction.data' is not a string");

    if (data.convert_to_doc)
    {
        check_if_is_not_typeof_and_throw(data.convert_to_doc, 'boolean', "'convert_to_doc' field in 'reaction.data' is not a boolean");
    }
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
    name: "drive",
    pretty_name: "Drive",
    description: "Google Drive is a cloud-based storage solution that allows you to save files online.",
    logo_url: "https://ssl.gstatic.com/images/branding/product/2x/hh_drive_96dp.png",

    init_webhook,
    deinit,
    execute,
    check_if_action_event_exist,
    check_if_reaction_event_exist,
    check_require_reaction_data,
    check_require_action_data,

    get_infos,
}

module.exports = Service
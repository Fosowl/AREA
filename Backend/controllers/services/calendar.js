
const { google } = require('googleapis');
const { check_if_is_undefined_and_throw, check_if_is_not_typeof_and_throw, throw_error } = require("../../utils/check")
const { get_calendar_auth } = require("../../utils/auth_google")
const uuid = require('node-uuid');
const dayjs = require('dayjs');
const { APIError, http_status } = require('../../utils/errors_handle');

var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)

const WEBHOOK_EVENT_URL = process.env.SERVER_URL + "/webhook/calendar/event"
const WEBHOOK_CALENDARLIST_URL = process.env.SERVER_URL + "/webhook/calendar/calendar_list"

/**  **/
async function init_webhook(user, action)
{
    if (!user.calendar.user_id)
    {
        throw new APIError("Account Link", http_status.INTERNAL_SERVER, 'No Calendar Account link with this account');
    }

    console.log("Init Webhook Calendar!!");

    if (user.calendar && !user.calendar.event.channel_id)
    {
        init_watch(user);
    }
    else if (user.calendar)
    {
        const expire_time = new Date(user.calendar.watch_expiry_date * 1000);
        // console.log(((expire_time.getTime()) - Date.now()))
        if (((expire_time.getTime()) - Date.now()) <= 0)
        {
            console.log("Watch Calendar Event Expire!!!");

            const auth = get_calendar_auth(user);
            const calendar = google.calendar({version: 'v3', auth});
            await calendar.channels.stop({
                    requestBody: {
                        address: WEBHOOK_EVENT_URL,
                        type: 'web_hook',
                        id: user.calendar.event.channel_id,
                        resourceId: user.calendar.event.resource_id
                    }
                }, async (err, result) => {
                    if (err)
                        return;
                    user.calendar.event.resource_id = undefined;
                    user.calendar.event.channel_id = undefined;
                    user.calendar.event.sync_token = undefined;
                    await user.save();
                });

            await calendar.channels.stop({
                    requestBody: {
                        address: WEBHOOK_CALENDARLIST_URL,
                        type: 'web_hook',
                        id: user.calendar.calendar_list.channel_id,
                        resourceId: user.calendar.calendar_list.resource_id
                    }
                }, async (err, result) => {
                    if (err)
                        return;
                    user.calendar.calendar_list.resource_id = undefined;
                    user.calendar.calendar_list.channel_id = undefined;
                    user.calendar.calendar_list.sync_token = undefined;
                    await user.save();
                });
            init_watch(user);
        }
    }
}

async function init_watch(user)
{
    const auth = get_calendar_auth(user);
    const calendar = google.calendar({version: 'v3', auth});

    {
        let body = await calendar.events.watch({
            calendarId: "primary",
            requestBody: {
                id: uuid.v1(),
                address: WEBHOOK_EVENT_URL,
                type: 'web_hook',
            },
        });

        console.log("Event Registry: " + body.data);
        user.calendar.event.resource_id = body.data.resourceId;
        user.calendar.event.channel_id = body.data.id;
        user.calendar.watch_expiry_date = Math.floor((Date.now()) / 1000) + 3600;
        await user.save();
    }
    
    let body = await calendar.calendarList.watch({
        requestBody: {
            id: uuid.v1(),
            address: WEBHOOK_CALENDARLIST_URL,
            type: 'web_hook',
        }
    });

    console.log("Calendar Registry: " + JSON.stringify(body.data, space=3));

    user.calendar.calendar_list.resource_id = body.data.resourceId;
    user.calendar.calendar_list.channel_id = body.data.id;
    await user.save();

    calendar.calendarList.list({}, (err, response) => {

        if (err)
            return;

        user.calendar.calendar_list.calendars = new Array();

        const items = response.data.items;
        items.forEach((item) => {
            user.calendar.calendar_list.calendars.push(item.id);
        });

        // console.log(user.calendar.calendar_list.calendars);
        user.save();
    });
}

async function deinit(user)
{
    if (!user.calendar)
    {
        throw new APIError("Account Link", http_status.INTERNAL_SERVER, 'Calendar Account already unlink to this account');
    }

    console.log("Deinit Calendar Webhook!!");

    const auth = get_calendar_auth(user);
    const calendar = google.calendar({version: 'v3', auth});

    const stop = async (url, obj) => {
        if (!obj)
            return
        await calendar.channels.stop({
            requestBody: {
                address: url,
                type: 'web_hook',
                id: obj.channel_id,
                resourceId: obj.resource_id
            }
        })
    }

    try {
        await stop(WEBHOOK_EVENT_URL, user.calendar.event)
        await stop(WEBHOOK_CALENDARLIST_URL, user.calendar.calendar_list)

        let token = auth.credentials.refresh_token;
        const promise = new Promise((resolve, reject) => {
            auth.revokeToken(token, (err, body) => {
                if (!err)
                {
                    user.calendar = undefined;
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
            user.calendar = undefined;
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
actions.set("on_event_created", {
    check_data: check_on_receive_new_mail_data,
    info: {
        pretty_name: "New Event Created",
        description: "Triggers when an event is created"
    }
});
actions.set("on_event_removed", {
    check_data: check_on_receive_new_mail_data,
    info: {
        pretty_name: "Event Removed",
        description: "Triggers when an event is removed"
    }
});
actions.set("on_calendar_created", {
    check_data: check_on_receive_new_mail_data,
    info: {
        pretty_name: "New Calendar Created",
        description: "Triggers when an calendar is created"
    }
});
actions.set("on_calendar_removed", {
    check_data: check_on_receive_new_mail_data,
    info: {
        pretty_name: "Calendar Removed",
        description: "Triggers when an calendar is removed"
    }
});


function check_on_receive_new_mail_data(data)
{
}



/**
 *      REACTIONS
 * -----------------------
 * */
const reactions = new Map();

reactions.set("create_calendar", {
    func: create_calendar,
    check_data: check_create_calendar,
    info: {
        pretty_name: "Create Calendar",
        description: "Creates a new calendar"
    }
});

reactions.set("quick_add_event", {
    func: quick_add_event,
    check_data: check_quick_add_event,
    info: {
        pretty_name: "Quick Add Event",
        description: "Create an event from a piece of text. (Example: Appointment at Somewhere on June 3rd 10am-10:25am)"
    }
});

reactions.set("add_detailed_event", {
    func: add_detailed_event,
    check_data: check_add_detailed_event,
    info: {
        pretty_name: "Create Detailed Event",
        description: "Create an event by defining each field"
    }
});



async function create_calendar(data, user)
{
    console.log("Create Calendar!");

    const auth = get_calendar_auth(user);
    const calendar = google.calendar({version: 'v3', auth});

    await calendar.calendars.insert({
        requestBody: {
            summary: data.name,
            description: data.description
        }
    })
}

async function quick_add_event(data, user)
{
    console.log("Quick Add Event!");

    const auth = get_calendar_auth(user);
    const calendar = google.calendar({version: 'v3', auth});

    await calendar.events.quickAdd({
        calendarId: "primary",
        text: data.text
    })
}

async function add_detailed_event(data, user)
{
    console.log("Add Detailed Event!");
    
    const auth = get_calendar_auth(user);
    const calendar = google.calendar({version: 'v3', auth});

    await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
            start: {
                dateTime: dayjs(data.start_date).format(),
            },
            end: {
                dateTime: dayjs(data.end_date).format(),
            }
        }
    })
}

// add_detailed_event({}, {})
// 2015-05-28T09:00:00-07:00

// As per your date format

// 2015 = yyyy;
// 05 = mm;
// 28 = dd;
// T  = time separator;
// 09 = h;
// 00 = i;
// 00 = s;

// -07:00 = These values are +/- based on the timezone (ex: +05:30 for Asia/Kolkata)

/**
 *      CHECK DATA
 * -----------------------
 * */


function check_create_calendar(data)
{
    check_if_is_undefined_and_throw(data.name, "Missing 'name' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.name, 'string', "'name' field in 'reaction.data' is not a string");

    if (data.description)
    {
        check_if_is_not_typeof_and_throw(data.description, 'string', "'description' field in 'reaction.data' is not a string");
    }
}

function check_quick_add_event(data)
{
    check_if_is_undefined_and_throw(data.text, "Missing 'text' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.text, 'string', "'text' field in 'reaction.data' is not a string");
}

function check_add_detailed_event(data)
{
    check_if_is_undefined_and_throw(data.start_date, "Missing 'start_date' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.start_date, 'string', "'start_date' field in 'reaction.data' is not a string");

    check_if_is_undefined_and_throw(data.end_date, "Missing 'end_date' field in 'reaction.data' object");
    check_if_is_not_typeof_and_throw(data.end_date, 'string', "'end_date' field in 'reaction.data' is not a string");

    if (!dayjs(data.start_date).isValid)
    {
        throw_error("Invalid", "Invalid date format in 'start_date' field in 'reaction.data' object");
    }

    if (!dayjs(data.end_date).isValid)
    {
        throw_error("Invalid", "Invalid date format in 'end_date' field in 'reaction.data' object");
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
    name: "calendar",
    pretty_name: "Calendar",
    description: "Google Calendar is a calendar that lets you keep track of your own events.",
    logo_url: "https://download.logo.wine/logo/Google_Calendar/Google_Calendar-Logo.wine.png",
    
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
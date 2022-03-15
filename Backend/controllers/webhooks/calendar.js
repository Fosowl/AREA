
const UserModel = require('../../models/user');
const { google } = require('googleapis');
const { execute_action } = require("../../utils/execution");
const { get_calendar_auth } = require("../../utils/auth_google");
const { calendar } = require('googleapis/build/src/apis/calendar');


async function webhook_event(req, res)
{
    console.log('Calendar Event Webhook!!');
    // console.log(req.headers);

    let user = await UserModel.findOne({'calendar.event.resource_id': req.headers["x-goog-resource-id"], 'calendar.event.channel_id':  req.headers["x-goog-channel-id"]});
    if (user)
    {
        if (req.headers["x-goog-resource-state"] == "exists")
        {
            const auth = get_calendar_auth(user);
            const calendar = google.calendar({version: 'v3', auth});

            calendar.events.list({
                calendarId: "primary",
                syncToken: user.calendar.event.sync_token ? user.calendar.event.sync_token : undefined
            }, (err, response) => {
                if (err)
                    return;

                const items = response.data.items;
                items.forEach((item) => {
                    console.log(item);

                    if (item.status == 'confirmed')
                    {
                        execute_action(user, {
                            service: "calendar",
                            event: "on_event_created"
                        });
                    }
                    else if (item.status == 'cancelled')
                    {
                        execute_action(user, {
                            service: "calendar",
                            event: "on_event_removed"
                        });
                    }
                });

                user.calendar.event.sync_token = response.data.nextSyncToken;
                user.save();
            });
        }
    }
    else
    {
        console.log("User not found");
    }
    return res.sendStatus(200);
}

async function webhook_calendar_list(req, res)
{
    console.log('Calendar List Webhook!!');
    // console.log(req.headers);

    let user = await UserModel.findOne({'calendar.calendar_list.resource_id': req.headers["x-goog-resource-id"], 'calendar.calendar_list.channel_id':  req.headers["x-goog-channel-id"]});
    if (user)
    {
        if (req.headers["x-goog-resource-state"] == "exists")
        {
            const auth = get_calendar_auth(user);
            const calendar = google.calendar({version: 'v3', auth});

            calendar.calendarList.list({
                syncToken: user.calendar.calendar_list.sync_token ? user.calendar.calendar_list.sync_token : undefined,
            }, (err, response) => {

                if (err)
                    return;

                // console.log("Calendar Response: " + JSON.stringify(response, space=3));

                const items = response.data.items;
                items.forEach((item) => {
                    console.log(item);
                    
                    if (item.deleted)
                    {
                        execute_action(user, {
                            service: "calendar",
                            event: "on_calendar_removed"
                        });

                        const index = user.calendar.calendar_list.calendars.indexOf(item.id);
                        if (index > -1)
                        {
                            user.calendar.calendar_list.calendars.splice(index, 1); // 2nd parameter means remove one item only
                        }
                    }
                    else if (!user.calendar.calendar_list.calendars.includes(item.id))
                    {
                        execute_action(user, {
                            service: "calendar",
                            event: "on_calendar_created"
                        });

                        user.calendar.calendar_list.calendars.push(item.id);
                    }
                });

                user.calendar.calendar_list.sync_token = response.data.nextSyncToken;
                user.save();
            });
        }
    }
    
    return res.sendStatus(200);
}

module.exports = {
    webhook_event,
    webhook_calendar_list
};

const UserModel = require('../../models/user');
const { google } = require('googleapis');
const { execute_action } = require("../../utils/execution");
const { get_drive_auth } = require("../../utils/auth_google");


async function webhook_changes(req, res)
{
    console.log('Drive Event Webhook!!');

    let user = await UserModel.findOne({'drive.changes.resource_id': req.headers["x-goog-resource-id"], 'drive.changes.channel_id':  req.headers["x-goog-channel-id"]});
    if (user)
    {
        if (req.headers["x-goog-resource-state"] == "sync")
        {
            return;
        }

        const auth = get_drive_auth(user);
        const drive = google.drive({version: 'v3', auth});

        drive.changes.list({
            pageToken: user.drive.changes.page_token
        }, (err, response) => {

            if (err)
                return;

            const changes = response.data.changes;
            changes.forEach((item) => {
                console.log(item);

                drive.files.get({
                    fileId: item.removed ? item.fileId : item.file.id,
                    fields: 'createdTime, mimeType, parents'
                }, async (err, result) => {
                    if (err)
                        return;

                    const is_folder = result.data.mimeType == 'application/vnd.google-apps.folder';

                    if (item.removed == true)
                    {
                        execute_action(user, {
                            service: "drive",
                            event: "on_any_removed",
                        });

                        const index = user.drive.changes.files.indexOf(item.id);
                        if (index > -1)
                        {
                            user.drive.changes.files.splice(index, 1); // 2nd parameter means remove one item only
                        }
                    }
                    else
                    {
                        const created_time = new Date(Date.parse(result.data.createdTime));
                        const time_between = Math.abs(created_time.getTime() - Date.now());
                        const time_in_min = 2;
                        const time_to_not_exced = time_in_min * 60 * 1000;

                        // console.log("Created Time: " + result.data.createdTime);

                        if (!is_folder && time_between <= time_to_not_exced)
                        {
                            if(!user.drive.changes.files.includes(item.file.id))
                            {
                                execute_action(user, {
                                    service: "drive",
                                    event: "on_any_file_created",
                                });

                                user.drive.changes.files.push(item.file.id);
                            }
                        }
                    }

                    await user.save();
                });
            });

            user.drive.changes.page_token = response.data.newStartPageToken;
            user.save();
        });
    }
    else
    {
        console.log("User not found");
    }
    return res.sendStatus(200);
}

module.exports = {
    webhook_changes,
};
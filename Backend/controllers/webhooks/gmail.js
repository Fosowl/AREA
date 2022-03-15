
const UserModel = require('../../models/user');
const { google } = require('googleapis');
const { execute_action } = require("../../utils/execution");
const { get_gmail_auth } = require("../../utils/auth_google")


async function webhook(req, res)
{
    const message = req.body ? req.body.message : null;
	
    if (message)
    {
        const buffer = Buffer.from(message.data, 'base64');
        const dataString = buffer ? buffer : null;
        const data = buffer ? JSON.parse(dataString) : null;

        let user = await UserModel.findOne({'gmail.email': data.emailAddress});
        if (user)
        {
            const auth = get_gmail_auth(user);
            
            const gmail = google.gmail({version: 'v1', auth});
            gmail.users.history.list({
                userId: 'me',
                startHistoryId: user.gmail.history_id,
                // maxResults: 10,
                // historyTypes: [
                //     "messageAdded",
                //     "messageDeleted",
                //     "labelAdded",
                //     "labelRemoved"
                // ],
            }, (err, resp) => {
                if (err)
                    return console.log('The API returned an error: ' + err);

                const history = resp.data.history;
                if (history)
                {
                    history.forEach((value, idx, array) => {
                        const { id, messages, messagesAdded, messagesDeleted, labelsAdded, labelsRemoved } = value;

                        if (messagesAdded)
                        {
                            let from = undefined;

                            execute_action(user, {
                                service: "gmail",
                                event: "on_receive_new_mail"
                            });

                            messagesAdded.forEach((info, idx, array) => {
                                const { message } = info;

                                gmail.users.messages.get({userId: 'me', id: message.id},
                                    function(err, response)
                                    {
                                        // console.log(response);

                                        if (err || !response.data)
                                            return;

                                        const data = response.data;
                                        data.labelIds.forEach((id, idx, array) => {
                                            execute_action(user, {
                                                service: "gmail",
                                                event: "on_receive_new_mail_label",
                                                data: {
                                                    label: `${id}`
                                                }
                                            });
                                        });

                                        if (!data.payload)
                                            return;
                                        const payload = data.payload;
                                        if (!payload.headers)
                                            return;

                                        const headers = payload.headers;
                                        headers.forEach((header, idx, array) => {
                                            if (header.name == 'From')
                                            {
                                                from = header.value.slice(header.value.indexOf('<') + 1, header.value.indexOf('>'));

                                                execute_action(user, {
                                                    service: "gmail",
                                                    event: "on_receive_new_mail_from",
                                                    data: {
                                                        from: `${from}`,
                                                    }
                                                });
                                            }

                                            // if (header.name == 'To')
                                            // {
                                            //     to = header.value.slice(header.value.indexOf('<') + 1, header.value.indexOf('>'));
                                            // }

                                            // if (header.name == 'Subject')
                                            // {
                                            //     subject = header.value;

                                            //     execute_action(user, {
                                            //         service: "gmail",
                                            //         event: "on_receive_new_mail_subject",
                                            //         data: {
                                            //             subject: `${subject}`,
                                            //         }
                                            //     });
                                            // }
                                        });
                                    });
                            });
                        }

                        if (messagesDeleted)
                        {
                            execute_action(user, {
                                service: "gmail",
                                event: "on_remove_mail"
                            });

                            messagesDeleted.forEach((info, idx, array) => {
                                const { message, labelIds } = info;
                                
                                message.labelIds.forEach((id, idx, array) => {
                                    execute_action(user, {
                                        service: "gmail",
                                        event: "on_remove_mail_with_label",
                                        data: {
                                            label: `${id}`
                                        }
                                    });
                                });
                            });
                        }

                        if (labelsAdded)
                        {
                            labelsAdded.forEach((info, index, array) => {
                                const { message, labelIds } = info;

                                labelIds.forEach((id, index, array) => {
                                    execute_action(user, {
                                        service: "gmail",
                                        event: "on_assign_label",
                                        data: {
                                            label: `${id}`
                                        }
                                    });
                                });
                            });

                            execute_action(user, {
                                service: "gmail",
                                event: "on_assign_label",
                                data: {
                                    label: "all"
                                }
                            });
                        }

                        if (labelsRemoved)
                        {
                            labelsRemoved.forEach((info, idx, array) => {
                                const { message, labelIds } = info;

                                labelIds.forEach((id, idx, array) => {
                                    execute_action(user, {
                                        service: "gmail",
                                        event: "on_remove_label",
                                        data: {
                                            label: `${id}`
                                        }
                                    });
                                });
                            });

                            execute_action(user, {
                                service: "gmail",
                                event: "on_remove_label",
                                data: {
                                    label: "all"
                                }
                            });
                        }
                    });

                    user.gmail.history_id = resp.data.historyId;
                    user.save();
                }
            });
        }
        else
        {
            console.log("User not found with email: " + buffer.emailAddress);
        }
        return res.sendStatus(204);
    }
}

module.exports = {
    webhook,
};

const TwitterService = require('./services/twitter');
const GmailService = require('./services/gmail');
const CalendarService = require('./services/calendar');
const DriveService = require('./services/drive');
const SchedulerService = require('./services/scheduler');

const ServiceController = require('./service_controller');
const UserModel = require('../models/user');
const { WidgetModel } = require('../models/widget');


ServiceController.set(TwitterService);
ServiceController.set(GmailService);
ServiceController.set(CalendarService);
ServiceController.set(DriveService);
ServiceController.set(SchedulerService);

WidgetModel.find({}, (err, widgets) => {

    users = new Map();
    widgets.forEach((widget) => {

        const { account_id, action, status } = widget;
        const service = ServiceController.get(action.service);

        if (!status)
            return;

        let user = users[account_id];
        if (!user)
        {
            UserModel.findById(account_id, (err, user_data) => {
                if (err || !user_data)
                    return;

                users[account_id] = user_data;
                service.init_webhook(users[account_id], action)
                    .catch(console.error);
            })
        }
        else
        {
            service.init_webhook(user, action)
                .catch(console.error);
        }
    });
});
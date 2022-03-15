
const { WidgetModel } = require('../models/widget');
const ServiceController = require('../controllers/service_controller');

const execute_action = async function (user, action)
{
    try
    {
        console.log(`Execute '${action.event}' with data '${JSON.stringify(action.data)}'`)

        let widgets = await WidgetModel.find({ account_id: user._id, "action.service": action.service, "action.event": action.event, "action.data": action.data });

        widgets.forEach(widget => {

            console.log("Trigger!");

            if (widget.status)
            {
                const reaction = widget.reaction;
                ServiceController.get(reaction.service).execute(reaction.event, reaction.data, user);
            }
        });
    }
    catch(err)
    {
        console.error(err);
    }
};

module.exports = {
    execute_action
}
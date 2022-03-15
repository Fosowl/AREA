
const UserModel = require("../models/user");
const { WidgetModel, ReactionModel } = require("../models/widget");
const ServiceController = require('./service_controller');
const ObjectId = require("mongoose").Types.ObjectId;
const { check_if_is_undefined_and_throw, check_if_is_not_typeof_and_throw } = require("../utils/check")
const { APIError, http_status, BadRequestError } = require("../utils/errors_handle")


function check_action(action)
{
    check_if_is_undefined_and_throw(action.service, "Missing 'service' string in 'action' object");
    check_if_is_not_typeof_and_throw(action.service, 'string', "'service' field in 'action' is not a string");
    
    check_if_is_undefined_and_throw(action.event, "Missing 'event' string in 'action' object");
    check_if_is_not_typeof_and_throw(action.event, 'string', "'event' field in 'action' is not a string");

    // ServiceController.get check automatically if 'action.service' exist
    const service = ServiceController.get(action.service);
    service.check_if_action_event_exist(action.event);
    service.check_require_action_data(action);
}

function check_reaction(reaction)
{
    check_if_is_undefined_and_throw(reaction.service, "Missing 'service' string in 'reaction' object");
    check_if_is_not_typeof_and_throw(reaction.service, 'string', "'service' field in 'reaction' is not a string");
    
    check_if_is_undefined_and_throw(reaction.event, "Missing 'event' string in 'reaction' object");
    check_if_is_not_typeof_and_throw(reaction.event, 'string', "'event' field in 'reaction' is not a string");
    
    check_if_is_undefined_and_throw(reaction.data, "Missing 'data' string in 'reaction' object");
    check_if_is_not_typeof_and_throw(reaction.data, 'object', "'data' field in 'reaction' is not an object");

    // ServiceController.get check automatically if 'reaction.service' exist
    const service = ServiceController.get(reaction.service);

    service.check_if_reaction_event_exist(reaction.event);
    service.check_require_reaction_data(reaction);
}


async function get_all_widgets(req, res)
{
    const { authorization } = req.headers;
    const account_id = authorization;

    const widgets = await WidgetModel.find({account_id: account_id}).select("-__v -account_id");
    res.status(http_status.OK).json({
        data: { widgets }
    });
}

async function get_widget_info(req, res, next)
{
    const id = req.params.id;
    let user = req.session.user;

    try
    {
        if (!ObjectId.isValid(id))
        {
            throw new BadRequestError('INVALID', 'Invalid widget id: ' + id);
        }

        const widget = await WidgetModel.findById({ account_id: user._id, _id: id }).select("-__v -account_id");
        res.status(http_status.OK).json({
            data: widget
        });
    }
    catch (err)
    {
        next(err);
    }
}


async function delete_widget(req, res, next)
{
    const { authorization } = req.headers;

    const account_id = authorization;
    const id = req.params.id;

    try
    {
        if (!ObjectId.isValid(id))
        {
            throw new BadRequestError('INVALID', 'Invalid widget id: ' + id);
        }

        let user = req.session.user;

        try
        {
            user.widgets.remove(id);
            WidgetModel.deleteOne({ _id: id, account_id: account_id }).exec();

            user.save();

            res.status(http_status.OK).json({ message: "Widget successfully deleted" });
        }
        catch (err)
        {
            next(err);
        }
    }
    catch (err)
    {
        next(err);
    }
}

async function add_widget(req, res, next)
{
    const { action, reaction, name } = req.body;

    try
    {
        let user = req.session.user;

        try
        {
            check_if_is_undefined_and_throw(action, "Missing 'action' object in 'request.body'");
            check_action(action);
            
            check_if_is_undefined_and_throw(reaction, "Missing 'reaction' object in 'request.body'");
            check_reaction(reaction);

            check_if_is_undefined_and_throw(name, "Missing 'name' object in 'request.body'");
            check_if_is_not_typeof_and_throw(name, 'string', 'Widget name is not a string type')

            if (process.env.NODE_ENV !== "test")
            {
                const service = ServiceController.get(action.service);
                await service.init_webhook(user, action);
            }

            WidgetModel.create({
                account_id: user._id,
                name: name,
                action: {
                    service: action.service,
                    event: action.event,
                    data: action.data,
                },
                reaction: {
                    service: reaction.service,
                    event: reaction.event,
                    data: reaction.data,
                }
            }).then((widget) => {
                user.widgets.push(widget);
                user.save(() => {});
                
                res.status(http_status.OK).json({ message: "Widget successfully added"});
            });
        }
        catch (err)
        {
            next(err);
        }
    }
    catch(err)
    {
        next(err);
    }
}

async function update_widget(req, res, next)
{
    const id = req.params.id;

    const { name, action, reaction, status } = req.body;

    try
    {
        if (!ObjectId.isValid(id))
        {
            throw new APIError('INVALID', http_status.BAD_REQUEST, true, 'Invalid widget id: ' + id);
        }

        let user = req.session.user;

        try
        {
            if (action)
            {
                check_action(action);
            }
            if (reaction)
            {
                check_reaction(reaction);
            }

            if (name)
            {
                check_if_is_not_typeof_and_throw(name, 'string', 'Widget name is not a string type')
            }

            if (status)
            {
                check_if_is_not_typeof_and_throw(status, 'boolean', "'status' field in 'widget' is not an boolean")
            }

            WidgetModel.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        status: status,
                        action: action,
                        reaction: reaction,
                        name: name
                    },
                },
                (err, data) => {
                    if (err)
                    {
                        next(err);
                        return;
                    }
                    if (action && data.status)
                    {
                        const service = ServiceController.get(action.service);
                        service.init_webhook(user, action);
                    }
                    return res.status(http_status.OK);
                }
            );
        }
        catch (err)
        {
            next(err);
        }
    }
    catch (err)
    {
        next(err);
    }
}

module.exports = {
    get_all_widgets,
    get_widget_info,
    delete_widget,
    add_widget,
    update_widget
}
'use strict'
const schedule = require('node-schedule');
const { check_if_is_undefined_and_throw, check_if_is_not_typeof_and_throw } = require("../../utils/check");
const { execute_action } = require('../../utils/execution');
const { APIError, http_status } = require('../../utils/errors_handle');

/**  **/
async function init_webhook(user, action)
{
    console.log("Init Scheduler!!");
    init_action(user, action)
}

function init_action(user, action)
{
    const action_func = actions.get(action.event);
    action_func.init(user, action.data);
}

/**
 *      ACTIONS
 * -----------------------
 * */

// 'actions' is only use to know if an action or not, there is no function execution like reactions
const actions = new Map();
actions.set("every_hour", {
    init: every_hour,
    check_data: check_no_data,
    info: {
        pretty_name: "Every Hour",
        description: "Triggers every hour"
    }
});
actions.set("every_day", {
    init: every_day,
    check_data: check_every_day_data,
    info: {
        pretty_name: "Every Day",
        description: "Triggers every day, just choose at what hour of time"
    }
});
actions.set("every_week", {
    init: every_week,
    check_data: check_every_week_data,
    info: {
        pretty_name: "Every Week",
        description: "Triggers every week, just choose what day of the week"
    }
});
actions.set("every_month", {
    init: every_month,
    check_data: check_every_month_data,
    info: {
        pretty_name: "Every Month",
        description: "Triggers every week, just choose what day of the month"
    }
});

const day = {
    "SUN": "0",
    "MON": "1",
    "TUE": "2",
    "WED": "3",
    "THU": "4",
    "FRI": "5",
    "SAT": "6",
}

function every_hour(user, data)
{
    schedule.scheduleJob({ rule: "0 * * * *" }, (fireDate) => {

        execute_action(user, {
            service: "scheduler",
            event: "every_hour"
        });
    });
}

function every_day(user, data)
{
    schedule.scheduleJob({ rule: `0 ${data.hour} * * *` }, (fireDate) => {

        console.log("Execute Date:" + fireDate);

        execute_action(user, {
            service: "scheduler",
            event: "every_day"
        });
    });
}

function every_week(user, data)
{
    schedule.scheduleJob({ rule: `0 ${data.hour} * * ${day[data.day.toUpperCase()]}` }, (fireDate) => {

        console.log("Execute Date:" + fireDate);

        execute_action(user, {
            service: "scheduler",
            event: "every_week"
        });
    });
}

function every_month(user, data)
{
    schedule.scheduleJob({ rule: `0 ${data.hour} ${data.day} * *` }, (fireDate) => {

        console.log("Execute Date:" + fireDate);

        execute_action(user, {
            service: "scheduler",
            event: "every_month"
        });
    });
}

function check_no_data(data)
{
}

function check_every_day_data(data)
{
    check_if_is_undefined_and_throw(data, "Missing 'data' object in 'action' object");
    check_if_is_undefined_and_throw(data.hour, "Missing 'hour' field in 'data' object");
    check_if_is_not_typeof_and_throw(data.hour, 'number', "'hour' field in 'action.data' is not a number");

    if (data.hour < 0 || data.hour > 23)
    {
        throw Error("Invalid range for hour in 'action.data.hour', It's must be between 0 and 23");
    }
}

function check_every_week_data(data)
{
    check_if_is_undefined_and_throw(data, "Missing 'data' object in 'action' object");
    check_if_is_undefined_and_throw(data.hour, "Missing 'hour' field in 'data' object");
    check_if_is_not_typeof_and_throw(data.hour, 'number', "'hour' field in 'action.data' is not a number");

    check_if_is_undefined_and_throw(data.day, "Missing 'day' field in 'data' object");
    check_if_is_not_typeof_and_throw(data.day, 'string', "'day' field in 'action.data' is not a string");

    if (data.hour < 0 || data.hour > 23)
    {
        throw Error("Invalid range for hour in 'action.data.hour', It's must be between 0 and 23");
    }

    if (!day.has(data.day.toUpperCase()))
    {
        throw Error("Unknown day '"+ data.day +"' in 'action.data'");
    }
}

function check_every_month_data(data)
{
    check_if_is_undefined_and_throw(data, "Missing 'data' object in 'action' object");
    check_if_is_undefined_and_throw(data.hour, "Missing 'hour' field in 'data' object");
    check_if_is_not_typeof_and_throw(data.hour, 'number', "'hour' field in 'action.data' is not a number");

    check_if_is_undefined_and_throw(data.day, "Missing 'day' field in 'data' object");
    check_if_is_not_typeof_and_throw(data.day, 'string', "'day' field in 'action.data' is not a string");

    if (data.hour < 0 || data.hour > 23)
    {
        throw Error("Invalid range for hour in 'action.data.hour', It's must be between 0 and 23");
    }
    
    if (data.day < 1 || data.day > 31)
    {
        throw Error("Invalid range for day in 'action.data.day', It's must be between 1 and 31");
    }
}



/**
 *      REACTIONS
 * -----------------------
 * */
const reactions = new Map();



function execute(reactionName, data, user)
{
    check_if_reaction_event_exist(reactionName);
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
    const reaction_func = reaction_check_data[reaction.event];
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

    return {
        name: Service.name,
        pretty_name: Service.pretty_name,
        description: Service.description,
        logo_url: Service.logo_url,
        
        actions: action_infos,
        reactions: []
    };
}

const Service = {
    name: "scheduler",
    pretty_name: "Scheduler",
    description: "Scheduler is a fully managed cron service for scheduling virtually any job.",
    logo_url: "https://storage.googleapis.com/gweb-cloudblog-publish/images/cloud-scheduler-512-color.max-600x600.png",

    init_webhook,
    execute,
    check_if_action_event_exist,
    check_if_reaction_event_exist,
    check_require_reaction_data,
    check_require_action_data,

    get_infos,
}

module.exports = Service;
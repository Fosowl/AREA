
const { APIError, http_status } = require("../utils/errors_handle")

function check_if_is_undefined(field)
{
    if (field === undefined)
    {
        return true;
    }
    return false;
}

function check_if_is_undefined_and_throw(field, name, msg)
{
    if (check_if_is_undefined(field))
    {
        throw new APIError("Missing", http_status.BAD_REQUEST, message=msg);
    }
}

function check_if_is_undefined_and_throw(field, msg)
{
    if (check_if_is_undefined(field))
    {
        throw new APIError("Missing", http_status.BAD_REQUEST, msg, true);
    }
}

function check_if_is_not_typeof_and_throw(field, type, msg)
{
    if (typeof field !== type)
    {
        throw new APIError('Invalid Type', http_status.BAD_REQUEST, msg, true);
    }
}

function throw_error(name, msg)
{
    throw new APIError(name, http_status.BAD_REQUEST, msg, true);
}

module.exports = {
    check_if_is_undefined,
    check_if_is_undefined_and_throw,
    check_if_is_not_typeof_and_throw,
    throw_error,
}
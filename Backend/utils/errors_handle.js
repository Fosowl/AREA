
const http_status = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
}

class BaseError extends Error
{
    constructor(name, http_code, message, is_operational)
    {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
        
        this.name = name;
        this.status = http_code;
        this.is_operational = is_operational;
        
        Error.captureStackTrace(this);
    }
}
   
//free to extend the BaseError
class APIError extends BaseError
{
    constructor(name, http_code = http_status.INTERNAL_SERVER, message = 'internal server error', is_operational = true)
    {
        super(name, http_code, message, is_operational);
    }
}

class BadRequestError extends BaseError
{
    constructor(name, message)
    {
        super(name, http_status.BAD_REQUEST, message, true);
    }
}

class InternalError extends BaseError
{
    constructor(name, message)
    {
        super(name, http_status.INTERNAL_SERVER, message, true);
    }
}

class NotFoundError extends BaseError
{
    constructor(name, message)
    {
        super(name, http_status.NOT_FOUND, message, true);
    }
}

module.exports = {
    BaseError,
    APIError,
    BadRequestError,
    InternalError,
    NotFoundError,
    http_status
}
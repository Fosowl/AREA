const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
const { APIError, BadRequestError, http_status } = require("../utils/errors_handle")

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token)
  {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.cookies("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err)
      {
        console.log(err);

      } else {
        console.log(decodedToken.id);
      }
    });
  } else {
    console.log("No Token");
  }
};

module.exports.requireUserId = async (req, res, next) => {

    try
    {
        const { authorization } = req.headers;
        const account_id = authorization;

        if (!ObjectId.isValid(account_id))
        {
            throw new BadRequestError('INVALID', "Invalid token: " + JSON.stringify(account_id));
        }

        let user = await UserModel.findById(account_id);
        if(!user)
        {
            throw new APIError('NOT FOUND', http_status.NOT_FOUND, "Account not found in database");
        }

        req.session.user = user;
        next();
    }
    catch (err)
    {
        next(err);
    }
};

module.exports.requireQueryUserId = async (req, res, next) => {

  try
  {
      const account_id = req.query.token;

      if (!ObjectId.isValid(account_id))
      {
          throw new BadRequestError('INVALID', "Invalid token: " + JSON.stringify(account_id));
      }

      let user = await UserModel.findById(account_id);
      if(!user)
      {
          throw new APIError('NOT FOUND', http_status.NOT_FOUND, "Account not found in database");
      }

      req.session.user = user;
      next();
  }
  catch (err)
  {
      next(err);
  }
};
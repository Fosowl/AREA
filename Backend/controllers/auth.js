const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/errors");
const { BadRequestError, InternalError, BaseError } = require("../utils/errors_handle");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: `${process.env.GMAIL_USER}`,
    pass: `${process.env.GMAIL_PASS}`,
    clientId: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    refreshToken: `${process.env.GMAIL_REFRESH_TOKEN}`,
  },
});


const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signUp = async (req, res, next) => {
  const { pseudo, email, password, confirm_password, firstName, lastName } = req.body;

  try {
    if (password !== confirm_password)
      throw new BadRequestError("Bad Request", "Les mots de passe ne correspondent pas");
    
    const user = await UserModel.create({ pseudo, email, password, firstName, lastName });

    // async email
    jwt.sign(
      {
        id: user._id,
      },
      process.env.EMAIL_SECRET,
      {
        expiresIn: '1d',
      },
      (err, emailToken) => {
        if (err)
          return next(err)

        const url = `${process.env.SERVER_URL}/api/user/confirmation/${emailToken}`;

        transporter.sendMail({
          to: email,
          subject: '[AREA] Confirmation Email',
          html: `Please click this <a href="${url}" target="_blank">here to confirm your email</a>`,
        }).then(() => {
          res.status(200).json({});
        });
      },
    );
  } catch (err) {
    if (typeof err === typeof BaseError)
    {
      next(err)
    }
    else
    {
      const errors = signUpErrors(err);
      const length = Object.keys(errors).length

      next({
        name: length > 0 ? 'Bad Request' : err.name,
        http_code: length > 0 ? 400 : err.http_code,
        message: length > 0 ? errors : err.message,
      });
    }
  }
};

module.exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    if (!user.emailConfirmed) {
      throw new InternalError('Confirmation', 'Please confirm your email to login');
    }
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ user: user._id });

    // Samuel
    req.session.user = user;

  } catch (err) {
    if (typeof err === 'object' && err instanceof BaseError)
    {
      next(err)
    }
    else
    {
      const errors = signInErrors(err);
      const length = Object.keys(errors).length

      next({
        name: length > 0 ? 'Bad Request' : err.name,
        http_code: length > 0 ? 400 : err.http_code,
        message: length > 0 ? errors : err.message,
      });
    }
  }
};

module.exports.mailConfirmation = async (req, res, next) => {
  const { emailToken } = req.params;

  try {
    const { id } = jwt.verify(emailToken, process.env.EMAIL_SECRET)

    await UserModel.updateOne(
      { _id: id },
      {
        $set: {
          emailConfirmed: true
        },
    })

    
  } catch (err) {
    console.log(err)
    return next(err);
  }

  return res.send("Email confirmed, you can return to the login page.")
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/api/area");
};

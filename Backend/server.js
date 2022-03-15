const express = require("express");
const sessions = require("express-session");
const cors = require("cors");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const requestIp = require('request-ip');


if (process.env.NODE_ENV !== 'production')
{
  // Use Dotenv for complex variable name like ENV=${VAR}/uri/value
  var dotenvExpand = require('dotenv-expand');
  dotenvExpand.expand(require("dotenv").config({ path: "./config/.env" }));
}

require("./config/db");


/** Import Routes **/
const userRoutes = require("./routes/user");
const areaRoutes = require("./routes/area");
const widgetRoutes = require("./routes/widget");
const authRoutes = require("./routes/auth");
const webhookRoutes = require("./routes/webhook");
const serviceRoutes = require("./routes/service");

const { checkUser, requireAuth, requireUserId } = require("./middleware/auth");
const app = express();

// Init ServiceController
require("./controllers/services");
const ServiceController = require('./controllers/service_controller');

// Parse data with BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Parse cookies with CookieParser
app.use(cookieParser());

// app.set('trust proxy', 1);


// Cookie Session
app.use(cookieSession({
  name: "session",
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 100
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  // origin: "http://localhost:3001", // front end url
  origin: true,
  optionsSuccessStatus: 200,
  credentials: true,
}));


// jwt check token
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (err, res) => {
  res.status(200).send("Ok");
});

// Routes
app.use("/api/area", areaRoutes);
app.use("/api/user", userRoutes);
app.use("/api/widget", requireUserId, widgetRoutes);
app.use("/api/services", serviceRoutes);
app.use("/auth", authRoutes);
app.use("/webhook", webhookRoutes);
app.get("/about.json", (req, res) => {

  let services = [];
  ServiceController.for_each((service) => {
    let infos = service.get_infos();
    services.push(infos);
  });

  services.forEach((service) => {
    delete service.logo_url;
    delete service.pretty_name;

    service.actions.forEach((action, idx) => {
      delete action.pretty_name;
    });

    service.reactions.forEach((reaction) => {
      delete reaction.pretty_name;
    });
  });

  const ip = requestIp.getClientIp(req);
  const slitIp = ip.split(':');
  const reformatIp = slitIp[slitIp.length - 1];
  
  res.status(200).json({
    client: {
      host: reformatIp
    },

    server: {
      current_time: Date.now(),
      services: services,
    }
  });
});

// Handle invalid route
app.use((req, res, next) => {
  // req.session = undefined;
  // console.log(req.session)
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);

    if (process.env.NODE_ENV !== "test")
    {
        console.error(error);
    }
    return res.json({
        error: {
            name: error.name,
            message: error.message,
            status: error.http_code,
        }
    });
});

// Server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

module.exports = app;
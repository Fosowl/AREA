const mongoose = require("mongoose");

// Get the current environment, and convert to uppercase (e.g. "PRODUCTION").
const env = process.env.NODE_ENV.toUpperCase();

const dbUri = process.env[`DB_URI_${env}`];
const dbUser = process.env[`DB_USER_${env}`];
const dbPassword = process.env[`DB_PASSWORD_${env}`];
const dbHost = process.env[`DB_HOST_${env}`];
const dbDatabase = process.env[`DB_DATABASE_${env}`];

mongoose
  .connect(
    dbUri,
    // `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbDatabase}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    }
  )
  .then(() => console.log("Connected to MongoDB !"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

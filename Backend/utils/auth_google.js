const { google } = require('googleapis');

function get_gmail_auth(user)
{
    const auth = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_CALLBACK,
    });
    
    auth.on('tokens', (tokens) => {
        console.log("New Token");
        user.gmail.token = tokens.access_token;
        user.gmail.expiry_date = tokens.expiry_date;

        if (tokens.refresh_token)
        {
            user.gmail.refresh_token = tokens.refresh_token;
        }
        user.save(() => console.log("Saved: " + user.gmail));
    });

    auth.setCredentials({
        refresh_token: user.gmail.refresh_token,
        access_token: user.gmail.token,
        expiry_date: user.gmail.expiry_date
    });

    return auth;
}

function get_calendar_auth(user)
{
    const auth = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_CALLBACK,
    });
    
    auth.on('tokens', (tokens) => {
        console.log("New Token");
        user.calendar.token = tokens.access_token;
        user.calendar.expiry_date = tokens.expiry_date;

        if (tokens.refresh_token)
        {
            user.calendar.refresh_token = tokens.refresh_token;
        }
        user.save(() => console.log("Saved: " + user.calendar));
    });

    auth.setCredentials({
        refresh_token: user.calendar.refresh_token,
        access_token: user.calendar.token,
        expiry_date: user.calendar.expiry_date
    });

    return auth;
}

function get_drive_auth(user)
{
    const auth = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_CALLBACK,
    });
    
    auth.on('tokens', (tokens) => {
        console.log("New Token");
        user.drive.token = tokens.access_token;
        user.drive.expiry_date = tokens.expiry_date;

        if (tokens.refresh_token)
        {
            user.drive.refresh_token = tokens.refresh_token;
        }
        user.save(() => console.log("Saved: " + user.drive));
    });

    auth.setCredentials({
        refresh_token: user.drive.refresh_token,
        access_token: user.drive.token,
        expiry_date: user.drive.expiry_date
    });

    return auth;
}

module.exports = {
    get_gmail_auth,
    get_calendar_auth,
    get_drive_auth
}
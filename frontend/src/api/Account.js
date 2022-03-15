
import React from 'react';

const API_URL = process.env.REACT_APP_API_URL;

// ---------------------------
//      ACCOUNT LINK OAUTH
// ---------------------------

function oAuthGeneric(name)
{
    return async (token) => {

        let url = `${API_URL}/auth/${name}?` + new URLSearchParams({
            token: `${token}`,
        })
        let w = window.open(url, "test", "_blank");
        w?.focus();

        // var timer = setInterval(async () => {
        //     if(w.closed)
        //     {
        //         clearInterval(timer);
        //         await fetch(`${API_URL}/auth/${name}/save`, {
        //             method: "POST",
        //             credentials: "include",
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 "Authorization": `${token}`,
        //             }
        //         })
        //     }
        // }, 1000);
    }
}


let oauths = new Map();
oauths['twitter'] = oAuthGeneric('twitter');
oauths['gmail'] = oAuthGeneric('gmail');
oauths['calendar'] = oAuthGeneric('calendar');
oauths['drive'] = oAuthGeneric('drive');

/**
 * @brief Constructor of the Service
 * @note Automatically get actions & reactions from API
 */
class Account
{
    constructor(user_id)
    {
        this.id = user_id;
    }

    delete = () => {
        return fetch(`${API_URL}/api/user`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${this.id}`,
            }
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error)
            {
                throw res.error;
            }
            return true;
        })
        .catch((err) => {
            return false;
        });
    }

    get_info = async() => {
        return fetch(`${API_URL}/api/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${this.id}`,
            }
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error)
            {
                throw res.error;
            }
            return res.data;
        })
    }

    update = async ({
        firstName,
        lastName,
        phoneNumber,
        picture,
        pseudo
    }) => {
        return fetch(`${API_URL}/api/user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${this.id}`,
            },
            body: JSON.stringify({
                firstName,
                lastName,
                phoneNumber,
                picture,
                pseudo
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error)
            {
                throw res.error;
            }
            return res;
        });
    }

    link_account_with = async (name) => {

        const oauth = oauths[name];
    
        if (oauth === undefined)
        {
            throw Error("Unknown oAuth '" + name + "'");
        }
    
        if (this.id === undefined)
        {
            throw Error("Invalid params, must include 'account_id' in 'params'");
        }
    
        return oauth(this.id);
    }

    unlink_account_with = async (name) => {

        return await fetch(`${API_URL}/api/services/${name}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${this.id}`,
            }
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.error)
            {
                throw res.error;
            }
            return res;
        });
    }
}

const OAuth = () => {
}

// ----------------------
//      ACCOUNT
// ----------------------

OAuth.register = async (pseudo, firstName, lastName, email, password, confirm_password) => {

    return fetch(`${API_URL}/api/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pseudo,
            email,
            password,
            confirm_password,
            firstName, lastName
        })
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.error)
        {
            throw res.error;
        }
        return res;
    });
}

OAuth.login = async (email, password) => {

    return await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.error)
        {
            throw res.error;
        }
        return new Account(res.user);
    });
}

export {
    OAuth,
    Account
};
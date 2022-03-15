import React from "react";
import { REACT_APP_API_URL } from "@env";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";

const API_URL = REACT_APP_API_URL;

// ---------------------------
//      ACCOUNT LINK OAUTH
// ---------------------------

function oAuthGeneric(name) {
  return async (account_id) => {
    let acc = account_id;
    let result = await WebBrowser.openAuthSessionAsync(
      `${API_URL}/auth/${name}?token=${acc}`
    );
  };
}

let oauths = new Map();
oauths["twitter"] = oAuthGeneric("twitter");
oauths["gmail"] = oAuthGeneric("gmail");
oauths["calendar"] = oAuthGeneric("calendar");
oauths["drive"] = oAuthGeneric("drive");

/**
 * @brief Constructor of the Service
 * @note Automatically get actions & reactions from API
 */
class Account {
  constructor(user_id) {
    this.id = user_id;
  }

  delete = () => {
    return fetch(`${API_URL}/api/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.id}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.err) {
          throw Error("Error: " + JSON.stringify(res.err));
        }
        console.log(res)
        return res;
      })
      .catch((err) => {
        console.log(err)
        return false;
      });
  };

  update = async ({ firstName, lastName, phoneNumber, picture, pseudo }) => {
    return fetch(`${API_URL}/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.id}`,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phoneNumber,
        picture,
        pseudo
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.err) {
          throw Error("Error: " + JSON.stringify(res.err));
        }
        return res;
      });
  };

  link_account_with = async (name) => {
    const oauth = oauths[name];

    if (oauth === undefined) {
      throw Error("Unknown oAuth '" + name + "'");
    }

    if (this.id === undefined) {
      throw Error("Invalid params, must include 'account_id' in 'params'");
    }

    return oauth(this.id);
  };

  unlink_account_with = async (name) => {
    return await fetch(`${API_URL}/api/services/${name}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.id}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        return res;
      });
  };

  get_infos = async () => {
    return await fetch(`${API_URL}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.id}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        return res;
      });
  };
}

const OAuth = () => {};

// ----------------------
//      ACCOUNT
// ----------------------

OAuth.register = async (pseudo, email, password, confirm_password) => {
  body = JSON.stringify({
    pseudo,
    email,
    password,
    confirm_password,
  })
  console.log(body)
  return fetch(`${API_URL}/api/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.err) {
        throw Error("Error: " + JSON.stringify(res.err));
      }
      console.log(res)
      return res;
    });
};

OAuth.login = async (email, password) => {
  return await fetch(`${API_URL}/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.err) {
        throw Error("Error: " + JSON.stringify(res.err));
      }
      return res;
    });
};

export { OAuth, Account };


import React from 'react';
import {REACT_APP_API_URL} from '@env'

const API_URL = REACT_APP_API_URL;

class Widget
{
    /**
     * @brief Constructor of the Widget
     */
    constructor(token, data)
    {
        this.token = token;
        this.id = data._id;
        this.action = data.action;
        this.reaction = data.reaction;
        this.reaction = data.reaction;
    }

    /**
     * @brief Update widget information
     * @returns true if the widget have been updated successfully
     */
    update = async () => {
        // const { account_id, action, reaction } = params;
    
        return await fetch(`${API_URL}/api/widget/${this.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token,
            },
            body: JSON.stringify({
                action: this.action,
                reaction: this.reaction
            })
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
            console.log(err);
            return false;
        });
    }

    /**
     * @brief Delete the widget from the user account
     * @returns true if the widget have been removed successfully
     */
    delete = async () => {
        // const { account_id, action, reaction } = params;
    
        return await fetch(`${API_URL}/api/widget/${this.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token,
            },
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
            console.log(err);
            return false;
        });
    }
}


const widget = {}

/**
 * @brief Add a new widget in the user account
 * @param account_id The oAuth token
 * @param data The data of the widget
 * @returns true if the widget have been added successfully
 */
 widget.add = async function(token, data) {

    return await fetch(`${API_URL}/api/widget/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
        body: JSON.stringify({
            action: data.action,
            reaction: data.reaction,
            name: data.name
        })
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
        console.log(err);
        return false;
    });
}

widget.delete = async function(token, id) {

    return await fetch(`${API_URL}/api/widget/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
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
        console.log(err);
        return false;
    });
}

/**
 * @brief Get all widgets of a user account
 * @param token The oAuth token
 * @returns array of widgets infos
 */
widget.get_all = async function(token) {

    return await fetch(`${API_URL}/api/widget`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.error)
        {
            throw res.error;
        }

        return res.data.widgets
    })
    .catch((err) => {
        console.log(err);
        return [];
    });
}

export {
    widget
};
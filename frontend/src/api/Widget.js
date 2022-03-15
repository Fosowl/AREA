
import React from 'react';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * @brief GET infos of the service from API
 * @param service_name the name of the service
 */
 async function widget_get_infos(widget_id)
 {
    return await fetch(`${API_URL}/api/widget/${widget_id}`, {
         method: "GET",
         headers: {
             "Content-Type": "application/json",
         },
     })
     .then((res) => res.json())
     .then((res) => {
         if (res.error)
         {
             throw res.error;
         }
 
         return res.data;
     })
     .catch((err) => {
         console.error(err);
         return undefined;
     });
 }

class Widget
{
    /**
     * @brief Constructor of the Widget
     */
    constructor(token, data)
    {
        this.token = token;
        this.id = data._id;
        this.status = data.status;
        this.action = data.action;
        this.reaction = data.reaction;
        this.name = data.name;
    }

    // constructor(widget_id)
    // {
    //     this.id = data.widget_id;
    // }


    /**
     * @brief Re-GET infos of the service from API
     */
     update_info = async () => {
        const info = await widget_get_infos(this.id);
        this.token = info.user;
        this.id = info._id;
        this.status = info.status;
        this.action = info.action;
        this.reaction = info.reaction;
        this.name = info.name;
        return this
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
            console.error(err);
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
            console.error(err);
            return false;
        });
    }
}

const widget = async function(token, widget_id) {

    const widget_data = await fetch(`${API_URL}/api/widget/${widget_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        },
    })
    .then(res => res.json())
    .then(res => {
        if (res.error)
        {
            throw res.error;
        }
        return res.data;
    })
    .catch(err => {
        console.error(err);
        return undefined;
    });

    if (widget_data)
    {
        return new Widget(token, widget_data);
    }
    return widget_data;
}

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
        console.error(err);
        return false;
    });
}

/**
 * @brief Get all widgets of a user account
 * @param token The oAuth token
 * @returns array of Widget class containing info about the widget
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

        return res.data.widgets.map((value) => {
            return new Widget(token, value);
        });
    })
    .catch((err) => {
        console.error(err);
        return [];
    });
}

export {
    widget,
    Widget
};
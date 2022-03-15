
import React from 'react';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * @brief GET infos of the service from API
 * @param service_name the name of the service
 */
async function service_get_infos(service_name)
{
    return await fetch(`${API_URL}/api/services/${service_name}`, {
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


class Service
{
    /**
     * @brief Constructor of the Service
     * @note Automatically get actions & reactions from API
     */
    constructor(name)
    {
        this.name = name;
    }

    /**
     * @brief Re-GET infos of the service from API
     */
    update_info = async () => {
        const info = await service_get_infos(this.name);
        this.pretty_name = info.pretty_name;
        this.actions = info.actions;
        this.reactions = info.reactions;
        this.description = info.description;
        this.logo_url = info.logo_url;
        return this
    }
}


const service = async function(service_name) {

    const service_data = await fetch(`${API_URL}/api/services/${service_name}/check`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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

    if (service_data)
    {
        let service = new Service(service_name);
        return await service.update_info();
    }
    return service_data;
}

/**
 * @brief GET all services avalaible in the server
 */
service.all = async function() {

    const services_data = await fetch(`${API_URL}/api/services`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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
        return [];
    });

    const services = []

    for (const service_data of services_data)
    {
        let service = new Service(service_data.name);
        await service.update_info();
        services.push(service)
    }

    return services;
}

service.get_infos = async function (service_name) {
    return await fetch(`${API_URL}/api/services/${service_name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        return undefined;
    });
};

/**
 * @brief GET all services avalaible in the user account
 * @param token the token
 */
service.available = async (token) => {

    const services_data = await fetch(`${API_URL}/api/services/available`, {
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
        return [];
    });

    const services = []

    for (const service_name of services_data)
    {
        let service = new Service(service_name);
        await service.update_info();
        services.push(service)
    }

    return services;
}

export {
    service
};
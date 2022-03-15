import React from "react";
import { REACT_APP_API_URL } from "@env";

const API_URL = REACT_APP_API_URL;

/**
 * @brief GET infos of the service from API
 * @param service_name the name of the service
 */
async function service_get_infos(service_name) {
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
}

class Service {
  /**
   * @brief Constructor of the Service
   * @note Automatically get actions & reactions from API
   */
  constructor(name) {
    this.name = name;
    service_get_infos(name).then((value) => {
      this.actions = value.actions;
      this.reactions = value.reactions;
    });
  }

  /**
   * @brief Re-GET infos of the service from API
   */
  update_info = () => {
    service_get_infos(this.name).then((value) => {
      this.actions = value.actions;
      this.reactions = value.reactions;
    });
  };
}

const service = async function (service_name) {
  return await fetch(`${API_URL}/api/services/${service_name}/check`, {
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

      return new Service(service_name);
    })
    .catch((err) => {
      return undefined;
    });
};

/**
 * @brief GET all services avalaible in the server
 */
service.all = async function () {
  return await fetch(`${API_URL}/api/services`, {
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
  // const { account_id, action, reaction } = params;

  return await fetch(`${API_URL}/api/services/available`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw res.error;
      }
      return res
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
};

export { service };

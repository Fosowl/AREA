
const { check_if_is_undefined_and_throw } = require("../utils/check")

function ServiceController()
{
    this.services = new Map();
}

ServiceController.prototype.get = function (serviceName) {

    check_if_is_undefined_and_throw(this.services.get(serviceName), "Unknown Service '" + serviceName + "'");
    return this.services.get(serviceName);
}

ServiceController.prototype.for_each = function (func) {

    this.services.forEach(func);
}

ServiceController.prototype.set = function (service) {

    this.services.set(service.name, service);
}

ServiceController.check_if_service_exist = function (serviceName) {

    check_if_is_undefined_and_throw(this.services.get(serviceName), "Unknown Service '" + serviceName + "'");
}

ServiceController.prototype.get_services_available_in_account = function (user) {

    var services = [];
    
    var userObject = user.toObject();
    this.services.forEach((service) => {

        if (userObject.hasOwnProperty(service.name))
        {
            services.push(service.name);
        }
    });
    
    services.push(this.services.get("scheduler").name);

    return services;
}

ServiceController.prototype.get_auth_services_available_in_account = function (user) {

    var services = [];
    
    var userObject = user.toObject();
    this.services.forEach((service) => {

        if (userObject.hasOwnProperty(service.name))
        {
            services.push(service.name);
        }
    });
    return services;
}

ServiceController.prototype.get_all_services = function () {

    var services = [];

    this.services.forEach((value, key) => {
        info = value.get_infos()
        services.push({
            name: info.name,
            pretty_name: info.pretty_name,
            description: info.description,
            logo_url: info.logo_url
        });
    });

    return services;
}

module.exports = new ServiceController();
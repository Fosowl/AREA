const UserModel = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
const ServiceController = require('./service_controller');
const { WidgetModel } = require('../models/widget');

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select(
    "-_id -__v -password -createdAt -updatedAt"
  );
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  UserModel.findById(req.session.user._id, (err, data) => {
    if (!err) res.status(200).json({data});
    else console.log("IDinfoerror Unknown : " + err);
  }).select("-_id firstName lastName phoneNumber picture pseudo email");
};

module.exports.updateUser = (req, res, next) => {

    try {
      UserModel.findOneAndUpdate(
        { _id: req.session.user._id },
        {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            picture: req.body.picture,
            pseudo: req.body.pseudo,
        },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true, select: "firstName lastName phoneNumber picture pseudo email" },
        (err, data) => {
            if (!err) return res.status(200).send(data);
            if (err) next(err);
        }
      );
    } catch (err) {
        return next(err);
    }
};

module.exports.deleteUser = async (req, res, next) => {
    try {
        const account_id = req.session.user._id
        const services = ServiceController.get_auth_services_available_in_account(req.session.user)

        const promises = services.map((service_name) => {
            const service = ServiceController.get(service_name)
            return service.deinit(req.session.user)
        })

        await Promise.all(promises)
        await WidgetModel.deleteMany({ account_id }, { multi: true })

        req.session.user.remove(() => {
            res.status(200).json({ message: "Successfully deleted" });
        });
        req.session.user = undefined;
    } catch (err) {
      return next(err);
    }
  };
  

const router = require("express").Router();

require("../passport-setup");
const ServiceController = require("../controllers/service_controller");
const { requireUserId } = require("../middleware/auth");

router.get("/available", requireUserId, (req, res) => {

    let user = req.session.user;
    let services = ServiceController.get_services_available_in_account(user);

    res.status(200).json({
        data: services
    });
});

router.get("/", (req, res) => {

    let services = ServiceController.get_all_services();

    res.status(200).json({
        data: services
    });
});

router.get("/:service_name", (req, res, next) => {

    const { service_name } = req.params;
    // let user = req.session.user;

    try
    {
        const service = ServiceController.get(service_name);

        res.status(200).json({
            data: service.get_infos()
        });
    }
    catch (err)
    {
        next(err);
    }
});

router.get("/:service_name/check", (req, res, next) => {

    const { service_name } = req.params;

    try
    {
        ServiceController.get(service_name);

        res.status(200).json({
            data: true
        });
    }
    catch (err)
    {
        next(err);
    }
});

router.delete("/:service_name", requireUserId, async (req, res, next) => {

    let user = req.session.user;
    const { service_name } = req.params;

    try
    {
        const service = ServiceController.get(service_name);
        await service.deinit(user)
        res.status(200).json({
            message: "Service successfully unlink"
        });
    }
    catch (err)
    {
        next(err);
    }
});

// router.get("/:service_name/actions", (req, res, next) => {

//     const { service_name } = req.params;
//     // let user = req.session.user;

//     try
//     {
//         let service = ServiceController.get(service_name);

//         res.status(200).json({
//             data: service.actions
//         });
//     }
//     catch (err)
//     {
//         next(err);
//     }
// });

// router.get("/:service_name/reactions", (req, res, next) => {

//     const { service_name } = req.params;
//     // let user = req.session.user;

//     try
//     {
//         let service = ServiceController.get(service_name);

//         res.status(200).json({
//             data: service.reactions
//         });
//     }
//     catch (err)
//     {
//         next(err);
//     }
// });


module.exports = router;
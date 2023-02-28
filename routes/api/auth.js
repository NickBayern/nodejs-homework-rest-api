const express = require("express");

const ctrl = require("../../controller/auth")

const { validateBody, authenticate } = require("../../middlewares")

const { schemas } = require("../../models/user")

const router = express.Router();

router.post("/signup", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch("/", authenticate, validateBody(schemas.updateSubscription), ctrl.updateSubscription)

module.exports = router;
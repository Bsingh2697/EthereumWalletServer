"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller = require("../../Controller/userController.js");
const jwt = require("jsonwebtoken");
const router = express_1.default.Router();
const auth = require("../../Middlewares/auth");
const User = require("../../models/UserModel/User");
const {
  registerValidation,
  loginValidation,
} = require("../../Validation/validation");
/*
 ** Order of routes matter
 ** If we put "/key" route under "/:user_id" then
 ** we won't be able to access "/key" route
 */
// ********************** Find All Users **********************
router.get("/all", controller.fetchAllUsers);
// ********************** Find key by ID **********************
router.get("/key", auth, controller.fetchUserPrivateKey);
// ********************** SIGNUP - ADD NEW USER **********************
router.post("/signup", controller.signup);
// ********************** LOGIN - USER **********************
router.post("/signin", controller.signin);
// ********************** Find user by ID **********************
router.get("/:user_id", auth, controller.fetchUserDetails);
// ********************** Remove user by ID **********************
router.delete("/:user_id", auth, controller.deleteUser);
module.exports = router;

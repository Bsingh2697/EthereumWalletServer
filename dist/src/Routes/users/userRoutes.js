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
// ********************** Find All Users **********************
router.get("/", controller.fetchAllUsers);
// ********************** Find user by ID **********************
router.get("/:user_id", auth, controller.fetchUserDetails);
// ********************** Remove user by ID **********************
router.delete("/:user_id", auth, controller.deleteUser);
// ********************** SIGNUP - ADD NEW USER **********************
router.post("/signup", controller.signup);
// ********************** LOGIN - USER **********************
router.post("/signin", controller.signin);
module.exports = router;

"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const controller = require("../../Controller/userController.js");
const router = express_1.default.Router();
const User = require("../../models/UserModel/User");
/*
 ** Order of routes matter
 ** If we put "/key" route under "/:user_id" then
 ** we won't be able to access "/key" route
 */
// ********************** Test API **********************
router.get("/test", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    let connStr = `${process.env.DB_URL}${process.env.DB_NAME}`;
    let uu = process.env.UNIQUE_USERNAME;
    const user = yield User.find();
    res.send(
      `hello world SIR 222 -  ${connStr} -- ${uu} ---------- ${
        mongoose_1.default.connection.readyState
      } ----------- ${user.stringify()}`
    );
  })
);
// ********************** Find All Users **********************
router.get("/", controller.fetchAllUsers);
// // ********************** Find key by ID **********************
// router.get('/key',auth, controller.fetchUserPrivateKey)
// // ********************** Find user by ID **********************
// router.get('/:user_id',auth, controller.fetchUserDetails)
// // ********************** Remove user by ID **********************
// router.delete('/:user_id',auth, controller.deleteUser)
// // ********************** SIGNUP - ADD NEW USER **********************
// router.post('/signup',controller.signup)
// // ********************** LOGIN - USER **********************
// router.post('/signin',controller.signin)
module.exports = router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class Database {
    connectToDb() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    let connStr = `${process.env.DB_URL}${process.env.DB_NAME}`;
                    mongoose_1.default.connect(connStr);
                    const conn = mongoose_1.default.connection;
                    conn.on('connected', () => {
                        console.log("Connected");
                        resolve("Connected");
                    });
                    conn.on('error', () => console.log("Error"));
                    conn.once('open', () => console.log("Open"));
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
}
exports.Database = Database;

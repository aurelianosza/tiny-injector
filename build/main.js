"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("./provider/decorators");
const provider_1 = require("./provider/provider");
require("reflect-metadata");
class Logger {
    constructor() { }
    log(message) {
        console.log("Log:", message);
    }
}
class UserRepository {
    constructor(logger) {
        this.logger = logger;
    }
    getUser(id) {
        this.logger.log(`Fetching user with id: ${id}`);
        return { id, name: "John Doe" };
    }
}
let UserController = class UserController {
    constructor(userRepository, logger) {
        this.userRepository = userRepository;
        this.logger = logger;
    }
    showUser(id) {
        const user = this.userRepository.getUser(id);
        this.logger.log(`User: ${JSON.stringify(user)}`);
    }
};
UserController = __decorate([
    (0, decorators_1.Injectable)(),
    __metadata("design:paramtypes", [UserRepository, Logger])
], UserController);
const provider = provider_1.Provider.getInstance()
    .register("logger", Logger)
    .register("userRepository", new UserRepository(new Logger()));
const userController = provider.resolve(UserController);
console.log(userController.showUser(1));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injectable = Injectable;
require("reflect-metadata");
function Injectable() {
    return (target) => {
        const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];
        Reflect.defineMetadata("inject:paramtypes", paramTypes, target);
    };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
require("reflect-metadata");
const tools_1 = require("./tools");
class Provider {
    constructor() {
        this.registry = new Map();
    }
    static getInstance() {
        if (!Provider.instance) {
            Provider.instance = new Provider();
        }
        return Provider.instance;
    }
    register(token, factory) {
        let factoryFn;
        if ((0, tools_1.isClass)(factory)) {
            factoryFn = (...args) => {
                return new factory(...args);
            };
        }
        else {
            factoryFn = factory;
        }
        this.registry.set(token.toString(), factoryFn);
        return this;
    }
    providerNotFound(token) {
        return new Error(`No provider found for token: ${token}`);
    }
    resolveProvider(goal) {
        return (0, tools_1.matchCase)(true, [
            [(0, tools_1.isClass)(goal), () => this.resolve(goal)],
            [(0, tools_1.isCallable)(goal), () => goal()],
        ], () => goal);
    }
    resolve(target) {
        if (typeof target === 'string') {
            this.registry.has(target);
            if (!this.registry.has(target)) {
                throw this.providerNotFound(target);
            }
            const goal = this.registry.get(target);
            return this.resolveProvider(goal);
        }
        if ((0, tools_1.isClass)(target)) {
            const paramsNames = (0, tools_1.getParamsNames)(target);
            const paramTypes = Reflect.getMetadata("design:paramtypes", target);
            const injections = paramsNames.map((paramName, index) => {
                return (0, tools_1.matchCase)(true, [
                    [this.registry.has(paramName), () => {
                            const goal = this.registry.get(paramName);
                            return this.resolveProvider(goal);
                        }],
                    [(0, tools_1.isClass)(paramTypes[index]), () => this.resolve(paramTypes[index])],
                ], () => {
                    throw this.providerNotFound(paramName);
                });
            });
            return new target(...injections);
        }
        throw this.providerNotFound(target.toString());
    }
}
exports.Provider = Provider;

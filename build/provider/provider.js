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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
require("reflect-metadata");
const tools_1 = require("./tools");
const ts_match_case_1 = require("ts-match-case");
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
        this.registry.set(token.toString(), factory);
        return this;
    }
    providerNotFound(token) {
        return new Error(`No provider found for token: ${token}`);
    }
    resolveProvider(goal) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolveValue = (0, ts_match_case_1.matchCase)(true, [
                [(0, tools_1.isClass)(goal), () => this.resolve(goal)],
                [(0, tools_1.isCallable)(goal), () => goal()],
                [ts_match_case_1.defaultCase, () => goal]
            ]);
            return resolveValue;
        });
    }
    resolve(target) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof target === 'string') {
                if (!this.registry.has(target)) {
                    throw this.providerNotFound(target);
                }
                const goal = this.registry.get(target);
                return this.resolveProvider(goal);
            }
            if ((0, tools_1.isClass)(target)) {
                const paramsNames = (0, tools_1.getParamsNames)(target);
                const paramTypes = Reflect.getMetadata("design:paramtypes", target);
                const injections = yield Promise.all(paramsNames.map((paramName, index) => __awaiter(this, void 0, void 0, function* () {
                    const injectionValue = (0, ts_match_case_1.matchCase)(true, [
                        [this.registry.has(paramName), () => __awaiter(this, void 0, void 0, function* () {
                                const goal = this.registry.get(paramName);
                                return this.resolveProvider(goal);
                            })],
                        [(0, tools_1.isClass)(paramTypes[index]), () => this.resolve(paramTypes[index])],
                        [ts_match_case_1.defaultCase, () => __awaiter(this, void 0, void 0, function* () {
                                throw this.providerNotFound(paramName);
                            })]
                    ]);
                    return injectionValue;
                })));
                return new target(...injections);
            }
            throw this.providerNotFound(target.toString());
        });
    }
}
exports.Provider = Provider;

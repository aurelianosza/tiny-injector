"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClass = isClass;
exports.isCallable = isCallable;
exports.getParamsNames = getParamsNames;
exports.matchCase = matchCase;
function isClass(target) {
    var _a;
    return typeof target === 'function' && ((_a = target.prototype) === null || _a === void 0 ? void 0 : _a.constructor);
    ;
}
function isCallable(fn) {
    return typeof fn === "function" && !isClass(fn);
}
function getParamsNames(target) {
    const stringFunction = target.toString().replace(/\n/g, " ");
    const argsMatch = stringFunction.match(/constructor\s*\(([^)]*)\)/);
    if (!argsMatch) {
        return [];
    }
    ;
    return argsMatch[1]
        .split(",")
        .map(name => name.trim())
        .filter(name => name.length > 0);
}
function matchCase(value, cases, defaultCase) {
    for (const [caseKey, action] of Array.isArray(cases)
        ? cases
        : Object.entries(cases)) {
        if (caseKey === value) {
            return action();
        }
    }
    if (defaultCase) {
        return defaultCase();
    }
    throw new Error("No match found");
}

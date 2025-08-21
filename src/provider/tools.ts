export function isClass(target: any): boolean {
    return typeof target === 'function' && !!target.prototype?.constructor;
}

export function isCallable(fn: any): boolean {
    return typeof fn === "function" && !isClass(fn);
}

export function isSymbol(value: any): boolean {
    return typeof value == "symbol";
}

export function getParamsNames(target: Function): string[] {
    const stringFunction = target.toString().replace(/\n/g, " ");
    const argsMatch = stringFunction.match(/constructor\s*\(([^)]*)\)/);

    if (!argsMatch) {
        return [];
    };

    return argsMatch[1]
        .split(",")
        .map(name => name.trim())
        .filter(name => name.length > 0);
}

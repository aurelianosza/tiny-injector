export function isClass(target: any): boolean {
    return typeof target === 'function' && target.prototype?.constructor;;
}

export function isCallable(fn: any): boolean {
  return typeof fn === "function" && !isClass(fn);
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

export function matchCase<T, R>(
    value: T,
    cases: Record<string, () => R>|[string|number|boolean, () => R][],
    defaultCase?: () => R
): R {
    for (
        const [caseKey, action] of
            Array.isArray(cases)
            ? cases
            : Object.entries(cases)
    ) {
        if (caseKey === value) {
            return action();
        }
    }
    if (defaultCase) {
        return defaultCase();
    }
    throw new Error("No match found");
}

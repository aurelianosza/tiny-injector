import "reflect-metadata";
import { getParamsNames, isCallable, isClass } from "./tools";
import { matchCase, defaultCase } from "ts-match-case";
import { isArray } from "lodash";

type Factory<T> = (...args: any[]) => T | Promise<T>;

export class Provider {

    private static instance: Provider
    private constructor()
    {}

    private registry: Map<string|Symbol, any> = new Map();

    public static getInstance(): Provider {
        if (!Provider.instance) {
            Provider.instance = new Provider()
        }
        return Provider.instance
    }

    register(token: string|any, factory: any): Provider
    {
        this.registry.set(token.toString(), factory);
        return this;
    }

    private providerNotFound(token: string): Error
    {
        return new Error(`No provider found for token: ${token}, also verify if resolving class has @injectable()`);
    }

    private async resolveProvider<T>(goal: any): Promise<T>
    {
        const resolveValue = matchCase<boolean, Promise<any>>(true, [
            [isClass(goal), () => this.resolve(goal)],
            [isCallable(goal), () => goal()],
            [defaultCase, () => goal]
        ]) as T;

        return await resolveValue;
    }

    async resolve<T>(target: string|(new (...args: any[]) => T)): Promise<T>
    {
        if (typeof target === 'string') {
            if (!this.registry.has(target)) {
                throw this.providerNotFound(target);
            }

            const goal = this.registry.get(target);            
            return this.resolveProvider<T>(goal);
        }

        if (isClass(target)) {
            const paramsNames = getParamsNames(target);
            const paramTypes = Reflect.getMetadata("design:paramtypes", target);
            
            const injections = await Promise.all(
                paramsNames.map(async (paramName: string, index: number) => {

                    const injectionValue = matchCase<boolean, Promise<T>>(true, [
                        [this.registry.has(paramName), async () => {
                            const goal = this.registry.get(paramName);
                            return this.resolveProvider<T>(goal);
                        }],
                        [
                            isArray(paramTypes)  &&
                            isClass(paramTypes[index]
                        ), () => this.resolve(paramTypes[index])],
                        [defaultCase, async() => {
                            throw this.providerNotFound(paramName);
                        }]
                    ]) as Promise<T>;

                    return injectionValue;
                })
            );

            return new target(...injections);
        }

        throw this.providerNotFound(target.toString());
    }
}

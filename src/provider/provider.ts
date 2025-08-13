import "reflect-metadata";
import { getParamsNames, isCallable, isClass, matchCase } from "./tools";

type Factory<T> = (...args: any[]) => T | Promise<T>;

export class Provider {

    private static instance: Provider
    private constructor()
    {}

    private registry: Map<string, any> = new Map();

    public static getInstance(): Provider {
        if (!Provider.instance) {
            Provider.instance = new Provider()
        }
        return Provider.instance
    }


    register(token: string|any, factory: any): Provider
    {
        let factoryFn: Factory<any>;

        if (isClass(factory)) {
            factoryFn = (...args: any[]) => {
                return new factory(...args);
            };
        } else {
            factoryFn = factory as Factory<any>;
        }

        this.registry.set(token.toString(), factoryFn);

        return this;
    }

    private providerNotFound(token: string): Error
    {
        return new Error(`No provider found for token: ${token}`);
    }

    private resolveProvider<T>(goal: any): any
    {
        return matchCase<boolean, any>(true, [
                [isClass(goal), () => this.resolve(goal)],
                [isCallable(goal), () => goal()],
            ], () => goal) as T;
    }

    resolve<T>(target: string|(new (...args: any[]) => T)): T
    {
        if (typeof target === 'string') {
            this.registry.has(target);
            if (!this.registry.has(target)) {
                throw this.providerNotFound(target);
            }

            const goal = this.registry.get(target);
            
            return this.resolveProvider<T>(goal);
        }

        if (isClass(target)) {
            const paramsNames = getParamsNames(target);
            const paramTypes = Reflect.getMetadata("design:paramtypes", target);
            
            const injections = paramsNames.map((paramName: string, index:number) => {
                return matchCase<boolean, T>(true, [
                    [this.registry.has(paramName), () => {
                        const goal = this.registry.get(paramName);
                        return this.resolveProvider<T>(goal);
                    }],
                    [isClass(paramTypes[index]), () => this.resolve(paramTypes[index])],
                ], () => { 
                    throw this.providerNotFound(paramName);
                }) as T;
            });

            return new target(...injections);
        }

        throw this.providerNotFound(target.toString());
    }
}

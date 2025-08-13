import "reflect-metadata";

export function Injectable(): ClassDecorator {
    return (target) => {
        const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];        
        Reflect.defineMetadata("inject:paramtypes", paramTypes, target);
    };
}

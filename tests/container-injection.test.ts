import { expect, jest, test} from '@jest/globals';
import { Injectable } from "../src/provider/decorators"
import { Provider } from "../src/provider/provider";
import { faker } from '@faker-js/faker';

describe("Testing dependency injections", () => {

    it("should throw error on resolve class with params without @inject", async () => {

        try {
            const serviceProvider = Provider.getInstance();

            class Foo {}

            serviceProvider.register("paramFoo", Foo);

            class Bar {
                constructor(public someOtherParamName: Foo)
                {}
            }

            const concreteBar = await serviceProvider.resolve(Bar);
        }  catch (e) {
            expect(e)
                .toBeInstanceOf(Error);
        }
    });

    test.concurrent.each([
        ["string", faker.word.sample()],
        ["numeric", faker.number.int()],
        ["boolean", faker.datatype.boolean()],
        ["array", faker.helpers.uniqueArray(faker.word.sample, 10)]
    ])("should resolve primitive %s with value %s with success", async(paramName: string, value: unknown) => {

        const serviceProvider = Provider.getInstance();

        serviceProvider.register(paramName, value);

        expect(await serviceProvider.resolve(paramName))
            .toStrictEqual(value);

    });

    test.concurrent.each([
        [faker.word.sample()],
        [faker.number.int()],
        [faker.datatype.boolean()],
        [faker.helpers.uniqueArray(faker.word.sample, 10)]
    ])("should inject primitive values with value %s", async(value: unknown) => {

        const serviceProvider = Provider.getInstance();
        serviceProvider.register("randomInjection", value);

        class Foo {
            constructor(public randomInjection: unknown)
            {}
        }

        const concreteFooClass = await serviceProvider.resolve(Foo);

        expect(concreteFooClass.randomInjection)
            .toStrictEqual(value);

    });

    it("should inject a class using his param name", async () => {

        const serviceProvider = Provider.getInstance();

        class Foo {}

        serviceProvider.register("paramFoo", Foo);

        @Injectable()
        class Bar {
            constructor(public paramFoo: Foo){}
        }

        const concreteBar = await serviceProvider.resolve<Bar>(Bar);

        expect(concreteBar.paramFoo)
            .toBeInstanceOf(Foo);
    });

    it("should inject a class using his param type", async () => {

        const serviceProvider = Provider.getInstance();

        class Foo {}

        serviceProvider.register("paramFoo", Foo);

        @Injectable()
        class Bar {
            constructor(public someOtherParamName: Foo)
            {}
        }

        const concreteBar = await serviceProvider.resolve(Bar);

        expect(concreteBar.someOtherParamName)
            .toBeInstanceOf(Foo);
    });

    it("should inject a class recursive way", async () => {

        const serviceProvider = Provider.getInstance();

        class Foo {}

        @Injectable()
        class Bar {
            constructor(public paramFoo: Foo)
            {}
        }

        serviceProvider.register("paramFoo", Foo);
        serviceProvider.register("paramBar", Bar);

        @Injectable()
        class Baz {
            constructor(public paramBar: Bar)
            {}
        }

        const concreteBaz = await serviceProvider.resolve(Baz);

        expect(concreteBaz.paramBar.paramFoo)
            .toBeInstanceOf(Foo);
    });

    test.concurrent.each([
        [faker.word.sample()],
        [faker.number.int()],
        [faker.datatype.boolean()],
        [faker.helpers.uniqueArray(faker.word.sample, 10)]
    ])("should inject custom with anonymous function", async (value: unknown) => {

        const serviceProvider = Provider.getInstance();

        serviceProvider.register("paramName", () => {
            return value;
        });

        expect(await serviceProvider.resolve("paramName"))
            .toStrictEqual(value);
    });

    it("should inject a service with interface using his param name", async () => {

        const serviceProvider = Provider.getInstance();

        interface BankAccountInterface {
            verifyCreditCard(creditCardData: Record<string, any>): Promise<any>
            purchaseFromCreditCard(creditCardData: Record<string, any>): Promise<any>
        };

        class XptoBankAccount implements BankAccountInterface {
            verifyCreditCard(creditCardData: Record<string, any>): Promise<any> {
                return Promise.resolve({});
            }
            purchaseFromCreditCard(creditCardData: Record<string, any>): Promise<any> {
                return Promise.resolve({});
            }
        }

        serviceProvider.register("bankAccountService", () => new XptoBankAccount());

        @Injectable()
        class UserController {

            constructor(public bankAccountService: BankAccountInterface)
            {}

        }

        const concreteUserController = await serviceProvider.resolve(UserController);

        expect(concreteUserController.bankAccountService)
            .toBeInstanceOf(XptoBankAccount);

    });
});

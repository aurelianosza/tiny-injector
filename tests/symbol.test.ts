import { expect, jest, test} from '@jest/globals';
import { faker } from '@faker-js/faker';

describe("testing symbols", () => {

    it("maps can ber searching with symbols", () => {

        const rawValue = faker.word.sample();
        const simpleSymbol = Symbol(rawValue);

        const myMap: Map<string|Symbol, any> = new Map();

        myMap.set(simpleSymbol, rawValue);

        expect(myMap.get(simpleSymbol) == rawValue)
            .toBeTruthy();

    });

    it("should save and restore values using symbols in interfaces", () => {

        interface BankAccountInterface {
            verifyCreditCard(creditCardData: Record<string, any>): Promise<any>
            purchaseFromCreditCard(creditCardData: Record<string, any>): Promise<any>
        };

        const Interfaces = {
            BankAccountInterface : Symbol("BankAccountInterface")
        };

        class XptoBankAccount implements BankAccountInterface {
            verifyCreditCard(creditCardData: Record<string, any>): Promise<any> {
                return Promise.resolve({});
            }
            purchaseFromCreditCard(creditCardData: Record<string, any>): Promise<any> {
                return Promise.resolve({});
            }
        }

        const myMap: Map<string|Symbol, any> = new Map();

        myMap.set(Interfaces.BankAccountInterface, XptoBankAccount);

        expect(myMap.get(Interfaces.BankAccountInterface) == XptoBankAccount)
            .toBeTruthy();

    });

    it("should save with symbol and creates an object instances", () => {

        interface BankAccountInterface {
            verifyCreditCard(creditCardData: Record<string, any>): Promise<any>
            purchaseFromCreditCard(creditCardData: Record<string, any>): Promise<any>
        };

        const Interfaces = {
            BankAccountInterface : Symbol("BankAccountInterface")
        };

        class XptoBankAccount implements BankAccountInterface {
            verifyCreditCard(creditCardData: Record<string, any>): Promise<any> {
                return Promise.resolve({});
            }
            purchaseFromCreditCard(creditCardData: Record<string, any>): Promise<any> {
                return Promise.resolve({});
            }
        }

        const myMap: Map<string|Symbol, any> = new Map();
        myMap.set(Interfaces.BankAccountInterface, XptoBankAccount);

        const concreteBankAccount = new (myMap.get(Interfaces.BankAccountInterface))();

        expect(concreteBankAccount instanceof XptoBankAccount)
            .toBeTruthy();
    });

});

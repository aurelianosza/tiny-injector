import { Injectable } from "./provider/decorators";
import { Provider } from "./provider/provider";
import "reflect-metadata";

class Logger {
    constructor() {}
    log(message: string) {
        console.log("Log:", message);
    }
}

class UserRepository {
    constructor(private logger: Logger) {}

    getUser(id: number) {
        this.logger.log(`Fetching user with id: ${id}`);
        return { id, name: "John Doe" };
    }
}

@Injectable()
class UserController {
    constructor(private userRepository: UserRepository, private logger: Logger) {}

    showUser(id: number) {
        const user = this.userRepository.getUser(id);
        this.logger.log(`User: ${JSON.stringify(user)}`);
    }
}

const provider = Provider.getInstance()
    .register("logger", Logger)
    .register("userRepository", new UserRepository(new Logger()));

const userController = provider.resolve(UserController);
userController.showUser(1);

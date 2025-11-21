import { User } from "./entity/User"
import { DataSource } from "typeorm";
import { emploe } from "./entity/users";
export const AppDataSource = new DataSource({
    type: "mongodb",
    url: "mongodb://localhost:27017/test1",
    synchronize: true,
    logging: true,
    entities: [User, emploe], // Explicit imports
    // useUnifiedTopology: true,
});
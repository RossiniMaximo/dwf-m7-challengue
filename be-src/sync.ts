import { sequelize } from "./lib/seqConn";
import { Pet } from "../be-src/models/pets";
import { User } from "./models/user";
import { Auth } from "./models/auth";

/* sequelize.sync({ force: true }).then((r) => console.log(r)); */

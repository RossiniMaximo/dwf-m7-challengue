/* Aca van las relaciones */
import { Pet } from "./pets";
import { User } from "./user";
/* Pet.sync({ force: true }); */
/* Pet.sync({ alter: true }).then((r) => console.log(r));
User.sync({ alter: true }).then((r) => console.log(r)); */

User.hasMany(Pet);
Pet.belongsTo(User);

export { Pet };

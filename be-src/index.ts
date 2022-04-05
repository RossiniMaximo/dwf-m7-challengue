import * as express from "express";
import * as cors from "cors";
import * as jwt from "jsonwebtoken";
import * as path from "path";

import { getPets } from "./controllers/pet-controller";
import { getPet } from "./controllers/pet-controller";
import { getUserPets } from "./controllers/pet-controller";
import { createPet } from "./controllers/pet-controller";
import { updatePet } from "./controllers/pet-controller";
import { getNearbyMissedPets } from "./controllers/pet-controller";
import { deletePet } from "./controllers/pet-controller";
import { createUserAndAuth, updateUser } from "./controllers/user-controller";
import { authToken } from "./controllers/user-controller";
import { findUserByEmail } from "./controllers/user-controller";
import { checkUserPassword } from "./controllers/user-controller";
import { sendEmail } from "./controllers/user-controller";
import { User } from "./models/index";
import { sequelize } from "./lib/seqConn";
/* sequelize.sync({ force: true }); */

const allowedHosts = ["https://dwf-m8-challenge.firebaseapp.com/"];
const app = express();
const port = 3001;
app.use(
  cors({
    origin: allowedHosts,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.static("dist"));

function authMiddleware(req, res, next) {
  try {
    const splittedHeader = req.headers.authorization.split(" ");
    console.log("splitteadHeader", splittedHeader);

    const token = splittedHeader[1];
    console.log("Splitted token", token);

    const data = jwt.verify(token, process.env.SECRET_KEY);
    req._userId = data;
    next();
    return res.data;
  } catch (e) {
    res
      .status(401)
      .json({ error: "You are not authorized to execute this action." });
  }
}

// Pet's endpoints

app.post("/pet", authMiddleware, async (req, res) => {
  if (req.body) {
    console.log("soy el req.body", req.body);
    try {
      const newPet = await createPet(req.body);
      console.log("newPet", newPet);
      return res.json(newPet);
    } catch (e) {
      return console.log("soy el error", e);
    }
  } else {
    return res.status(404).json("Body required");
  }
});

app.get("/pets", async (req, res) => {
  const pets = await getPets();
  res.json(pets);
});

app.get("/pet/:id", async (req, res) => {
  const pet = await getPet(req.params.id);
  res.json(pet);
});

app.post("/user-pets", async (req, res) => {
  const pets = await getUserPets(req.body.userId);
  res.json(pets);
});

app.get("/nearby-missed-pets", async (req, res) => {
  const nearbyPets = await getNearbyMissedPets(req);
  res.json(nearbyPets);
});

app.put("/pet/:id", authMiddleware, async (req, res) => {
  try {
    if (req.body) {
      const updatedPet = await updatePet(req.body, req.params.id);
      console.log("updatedPet", updatedPet);

      res.json(updatedPet);
    } else {
      res.status(400).json({ error: "no pet found with id provided" });
    }
  } catch (e) {
    /*  console.log("error endpoints update", e); */
  }
});

app.delete("/pet/:id", authMiddleware, async (req, res) => {
  if (req.params.id) {
    const findAndDeletePet = await deletePet(req.params.id);
    res.json(findAndDeletePet);
  } else {
    res.json("No pet ID provided!");
  }
});

// User's endpoints

app.get("/users", async (req, res) => {
  const usersList = await User.findAll({});
  res.json(usersList);
});

app.post("/find-user", async (req, res) => {
  if (req.body === null) {
    res.json("Body inexistente");
  } else {
    const user = await findUserByEmail(req.body.email);
    res.json(user);
  }
});

app.post("/find-password", async (req, res) => {
  const { password } = req.body;
  if (req.body) {
    console.log("body", req.body);
    const auth = await checkUserPassword(password);
    res.json(auth);
  }
});

app.post("/auth", async (req, res) => {
  if (!req.body) {
    res.status(400).json({ error: true });
  } else {
    console.log("req.body", req.body);

    const user = await createUserAndAuth(req.body);
    res.json(user);
  }
});

app.post("/auth/token", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (email && password) {
    const response = await authToken(email, password);
    res.json(response);
  } else {
    res.status(400).json("Datos incompletos");
  }
});

app.post("/report-info", async (req, res) => {
  const { petId, text, name, phone } = req.body.pet;
  const pet = await getPet(petId);
  console.log("petId", petId);

  const userId = pet["userId"];
  const petOwner = await User.findByPk(userId);
  console.log("petOwner", petOwner);

  const ownerEmail = petOwner["email"];

  const from = "maximorossini2016@gmail.com";
  const to = ownerEmail;
  const subject = "Alguien reporto información sobre tu mascota!";
  const output = `
    <p>Alguien reporto información sobre tu mascota!</p>
    <h3>Email enviado por ${name}</h3>
    <p>Teléfono : ${phone}</p>
    <p>${text}</p>
    `;
  const sendMail = await sendEmail(to, from, output, subject);
  res.json(sendMail);
});

app.put("/update-user", async (req, res) => {
  const { email, fullname, password } = req.body.data;

  if (!req.body) {
    res.json({ error: "Body incompleto" });
  } else {
    const update = await updateUser(email, fullname, password);
    res.json(update);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, "../dist/index.html")));
});

app.listen(port, () => console.log("server corriendo exitosamente", port));

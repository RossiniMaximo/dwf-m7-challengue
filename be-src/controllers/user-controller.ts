import { Auth } from "../models/index";
import { User } from "../models/index";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
const sgEmail = require("@sendgrid/mail");
console.log(sgEmail);

require("dotenv").config();
sgEmail.setApiKey(process.env.SENDGRID_API_KEY);

function getSHA256ofString(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}
//  a function that returns only 1 user if it exists.
export async function findUserByEmail(email) {
  const findUser = await User.findOne({ where: { email } });

  if (findUser) {
    return findUser;
  } else {
    return false;
  }
}

export async function checkUserPassword(password) {
  const authPass = await Auth.findOne({
    where: { password: getSHA256ofString(password) },
  });
  if (authPass) {
    return authPass;
  } else {
    return "Contraseña erronéa";
  }
}

// Create user & auth on their tables.
export async function createUserAndAuth(data) {
  const { email, fullname, password } = data;
  const [user, created] = await User.findOrCreate({
    where: {
      email,
    },
    defaults: {
      email,
      fullname,
    },
  });
  const userId = user.get("id");
  const [auth, authCreated] = await Auth.findOrCreate({
    where: { user_id: userId },
    defaults: {
      email,
      password: getSHA256ofString(password),
      user_id: userId,
    },
  });

  return user;
}

// Create token by Auth table hashed password
export async function authToken(email, password) {
  const hashedPassword = getSHA256ofString(password);
  const auth = await Auth.findOne({
    where: { email: email, password: hashedPassword },
  });
  const userId = auth.get("id");
  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY);

  if (auth) {
    return { token: token };
  } else {
    return "error , datos no coincidientes con usuarios.";
  }
}

export async function myInfo(req) {
  const splittedHeader = req.headers.authorization.split(" ");
  const token = splittedHeader[1];
  const data = jwt.verify(token, process.env.SECRET_KEY);
  return data;
}

export async function updateUser(email, fullname, password) {
  const hashedPassword = getSHA256ofString(password);
  const user = await User.findOne({ where: { email } });
  const userAuth = await Auth.findOne({ where: { user_id: user.get("id") } });
  if (user) {
    await user.update({ fullname: fullname });
  }

  if (userAuth) {
    await userAuth.update({ password: hashedPassword });
  }
}

export async function sendEmail(to, from, text, subject) {
  const msg = {
    to,
    from,
    subject,
    html: text,
  };
  try {
    const sendEmail = await sgEmail.send(msg);
    return sendEmail;
  } catch (e) {
    /* console.log("soy el error : ", e); */
  }
}

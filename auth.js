import bcyprt from "bcrypt";
import _ from "lodash";
import jwt from "jsonwebtoken";
import { formatErrors } from "./ErrorFormat.js";

export const getUserByToken = async (token, prisma, secret) => {
  try {
    const {
      user: { id }
    } = jwt.verify(token, secret);

    const userExists = await prisma.user.findOne({
      where: {
        id
      }
    });
    if (userExists) {
      return userExists;
    }
  } catch (err) {
    throw new Error("valid token doesn't exists with requested user");
  }
};

export const createToken = async (user, secret) => {
  const token = jwt.sign(
    {
      user: _.pick(user, ["id","username"])
    },
    secret,
    {
      expiresIn: "80h"
    }
  );
  return token;
};

export const tryLogin = async (email, password, context) => {
  console.log("Got the Login request", email, password);
  try {
    const userdetails = await context.prisma.user.findOne({
      where: {
        email
      }
    });
    console.log("Userdeatils found ot not", userdetails);
    if (userdetails) {
      console.log("User deatils", userdetails, password, userdetails.password);
      const compare = await bcyprt.compare(password, userdetails.password);
      if (compare) {
        const token = await createToken(
          userdetails,
          context.SECRET
        );
        return {
          ok: true,
          token
        };
      }
      return {
        ok: false,
        error: formatErrors("user", "password doesn't match")
      };
    } else {
      console.log("Userdeatils found are not");
      return {
        ok: false,
        error: formatErrors("user", "Email doesn't exists")
      };
    }
  } catch (error) {
    console.log("Login catch");
    return {
      ok: false,
      error: formatErrors(error)
    };
  }
};

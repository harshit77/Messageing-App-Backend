const bcrypt = require("bcrypt");
import _ from "lodash";
import { tryLogin } from "../auth.js";
import { formatErrors } from "../ErrorFormat.js";
import { PubSub,withFilter } from "apollo-server";
const NEW_USER = "NEW_USER";
const pubsub= new PubSub();
const userResolver = {
  Subscription: {
    newUser: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_USER),
        (payload,args)=> true
      ),
    }
  },
  Query: {
    getAllUsers: async (parent, args, context, info) => {
      if (!context.user.id) return null;
      const count = await context.prisma.user.findMany({
        where:{
          id:{
            notIn:context.user.id
          }
        }
      });
      return count;
    }
  },
  Mutation: {
    login: async (parent, { email, password }, context, info) =>
      tryLogin(email, password, context),
    register: async (parent, { username, password, email }, context, info) => {
      try {
        if (password.length < 5 || password.length > 20) {
          return {
            ok: false,
            errors: formatErrors(
              "password",
              "The password needs to be in between 5 and 100 character long"
            )
          };
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const user = await context.prisma.user.create({
          data: {
            email,
            password: hashedpassword,
            username
          }
        });
        pubsub.publish(NEW_USER, { newUser: user });
        return {
          ok: true,
          user
        };
      } catch (error) {
        console.log("Register error",error);
        return {
          ok: false,
          errors: formatErrors(error)
        };
      }
    }
  }
};

export default userResolver;

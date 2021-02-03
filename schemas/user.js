import { gql } from "apollo-server";

const user = gql`
  type User {
  id: ID!
  username: String!
  email: String!
  teams: [Team!]
  }

  type Query {
      getAllUsers:[User!]!
      getUserById(id: Int!):User!
  }
  type Mutation {
      register(username: String!,email: String!,password: String!): RegisterResponse!
      login(email: String!,password: String!): LoginResponse!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type LoginResponse {
    ok: Boolean!
    token: String
    errors: [Error!]
  }
  type Subscription  {
    newUser: User!
  }
`
;

export default user;
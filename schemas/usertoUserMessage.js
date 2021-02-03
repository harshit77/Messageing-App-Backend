import { gql } from "apollo-server";

const usertoUserMessage = gql`
  type Subscription {
    newUserMessage(receiverId: Int!): UserMessage!
  }
  type Query {
    getAllUserMessageById(receiverId: Int!): CreateuserTouserMessageResponse!
  }

  type UserMessage {
    id: ID!
    createdAt: String!
    senderId: Int!
    receiverId: Int!
    text: String!
  }

  type Mutation {
    createuserTouserMessage(
      receiverId: Int!
      text: String!
    ): CreateuserTouserMessageResponse
  }

  type CreateuserTouserMessageResponse {
    ok: Boolean!
    message: [UserMessage!]
    errors: [Error!]
  }
`;

export default usertoUserMessage;

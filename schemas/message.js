import { gql } from "apollo-server";

const message= gql`
    type Subscription {
        newChannelMessage(channelId:ID!): Message! 
    }
    type Message {
        id: Int 
        createdAt: String!
        text: String! 
        user: User! 
        channel: Channel
    } 

    type Query {
        allMessages(channelId: ID!): MessageResponse!
    }

    type Mutation {
        createMessage(channelId: ID!,text: String!): MessageResponse!
    }

    type MessageResponse {
        ok: Boolean!
        message: [Message!]
    }

`

export default message;
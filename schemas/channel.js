import { gql } from "apollo-server";

const channel=gql`

    type Channel {
        id: Int!
        name: String!
        team: Team!
    }
    
    type Mutation {
        createChannel(name:String!): ChannelResponse!
    }

    type ChannelResponse {
        ok: Boolean!
        channel: Channel
        errors: [Error!]
    }

`

export default channel;
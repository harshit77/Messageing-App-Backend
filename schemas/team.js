import { gql } from "apollo-server";

const team = gql`
  type Subscription {
    newTeamMessage: Team!
  }
  type Team {
    id: Int!
    name: String!
    owner: User
    members: [User!]!
    channels: [Channel!]
  }
  type Query {
    allTeams: [Team!]!
    otherTeams: [Team!]!
  }
  type Mutation {
    createTeam(name: String!): TeamResponse!
  }

  type TeamResponse {
    ok: Boolean!
    id: Int
    name: String
    owner: User
    channels: [Channel!]
    errors: [Error!]
  }
`;

export default team;

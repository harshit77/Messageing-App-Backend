const  { gql } = require('apollo-server');

const member = gql`
 
  type Mutation {
      createMember(email: String!,teamId: Int!): MemberResponse!
  }

  type MemberResponse {
    ok: Boolean!
    errors: [Error!]
  }
`
;

export default member;
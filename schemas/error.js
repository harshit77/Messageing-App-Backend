import { gql } from "apollo-server";

const error= gql`
  type Error {
    path: String!
    message: String!
  }
`

export default error;

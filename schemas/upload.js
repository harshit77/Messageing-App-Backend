import { gql } from 'apollo-server';


const upload= gql`
 type File {
    id: ID!
    fileName: String!
    mimeType: String!
    encodeType:String!
 }

 type Query {
     getAllUploadFileByUserId:[File]
 }
 type Mutation {
    uploadFileByUser(file: Upload!): File!
 }
`;


export default upload;
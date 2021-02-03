import { ApolloServer } from 'apollo-server';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { getUserByToken } from './auth';


const prisma= new PrismaClient();
const SECRET="MESSAGING-APP";
const SECRET2="EXTENDED-MESSAGING-APP";
const typeDefs= mergeTypes(fileLoader(path.join(__dirname,'./schemas')));
const resolvers= mergeResolvers(fileLoader(path.join(__dirname,'./resolvers')));


const server= new ApolloServer({
    typeDefs,
    resolvers,
    cors: true,
    subscriptions:{
        onConnect:async (connectionParams,webSocket)=>{
            // console.log("Subscription",connectionParams);
                const user=await getUserByToken(connectionParams.authToken,prisma,SECRET);    
                 return {user};
         
        }
    },
    context:async ({req,connection})=>{
        if(connection) {
            //  console.log("Connection",connection);
            return connection.context;
        }
        else if(req || req.headers) {
         const authToken = req.headers.authorization || '';
        if(authToken) {
            const user=await getUserByToken(authToken,prisma,SECRET);
            return {
                req,
                user,
                prisma,
                SECRET
            }  
        }
    }
        return {
            req,
            prisma,
            SECRET
        }  
        // throw new AuthenticationError('you must be logged in');
       
    }
});

server.listen().then(({url,subscriptionsUrl})=>{
    console.log(`Server is running at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
})
import { formatErrors } from '../ErrorFormat.js';
import {PubSub,withFilter } from 'apollo-server';

const COMMENT_ADDED='COMMENT_ADDED';
const pubsub= new PubSub();
const messageResolver = {
  Subscription:{
    newChannelMessage:{
      subscribe:withFilter(
        ()=>pubsub.asyncIterator(COMMENT_ADDED),
        (payload,args)=> {console.log("Paylload"); return payload.channelId== args.channelId}
      )
    }
  },
  Query: {
    allMessages:async(parent,{channelId},context,info)=>{
      try{
        if (!context.user.id) return null;
        const messages= await context.prisma.message.findMany({
          where:{
            channelId: parseInt(channelId)
          },
          include:{
            user: true,
            channel: true
          }
        });
        const messageRefined=messages.map(message=>{
          message.createdAt=new Date(message.createdAt).toISOString();
          return message;
        })
        console.dir("getAllMessage",messageRefined,{depth:null});
        return {
          ok:true,
          message:messageRefined
        };
      }catch(error){
        console.log("All Team Query catch",error);
        return {
          ok: false,
          errors: formatErrors(
            "team",
            "can't get All the team with folowing user"
          )
      }
    }
  },
},
  Mutation: {
    createMessage: async (parent, { channelId, text }, context, info) => {
      try { 
        if(!context.user.id) return null;
        let message= await context.prisma.message.create({
            data:{
                text,
                user:{
                    connect:{
                        id:context.user.id
                    }
                },
                channel:{
                    connect: {
                        id:parseInt(channelId)
                    }
                }
            },
            include:{
                user:true,
                channel:true
            }
        });
        message.createdAt=new Date(message.createdAt).toISOString();
        pubsub.publish(COMMENT_ADDED,{
          channelId,
          newChannelMessage:message

        })
        console.log("Cretated Message",message);
        return {
            ok:true,
            message:[message]
        }
        
      } catch (error) {
        console.log("Message catch",error);
        return {
          ok: false,
          errors: formatErrors(
            "message",
            "can't create the message with folowing channel"
          )
        };
      }
    }
  }
};
export default messageResolver;

import { formatErrors } from '../ErrorFormat.js';
import {PubSub,withFilter } from 'apollo-server';

const MESSAGE_ADDED='MESSAGE_ADDED';
const pubsub= new PubSub();

const usertoUserMessageResolver={
    Subscription:{
        newUserMessage:{
          subscribe:withFilter(
            ()=>pubsub.asyncIterator(MESSAGE_ADDED),
            (payload,args,context,info)=> {console.log("Paylload",context.user.id,payload); return (payload.receiverId== context.user.id || payload.senderId==context.user.id)}
          )
        }
      },
    Query:{
        getAllUserMessageById:async(parent,{receiverId},context,info)=>{
        try{
            if (!context.user.id) return null;
            const messages= await context.prisma.directmessage.findMany({
                where:{
                    OR:[{
                        senderId:{
                           equals: context.user.id,
                        },
                        receiverId:{
                            equals:receiverId
                        }
                    },
                {
                    senderId:{
                        equals: receiverId,
                    },
                    receiverId:{
                        equals: context.user.id
                    }
                }]
                      
                }
            });

            if(messages){
                const messageRefined=messages.map(message=>{
                    message.createdAt=new Date(message.createdAt).toISOString();
                    return message;
                  });
                  console.log("getAllUserMessageById",messageRefined);
                return {
                    ok: true,
                   message:messageRefined
                }
            }
            return {
                ok: false,
                errors: formatErrors(
                    "createuserTouserMessage",
                    "can't create message for this user"
                )
            }

        }catch(error){
            return {
                ok: false,
                errors: formatErrors(
                    "createuserTouserMessage",
                    "can't create message for this user"
                )
            }
        }
        }
    },

    Mutation:{
        createuserTouserMessage: async(parent,{receiverId,text},context,info)=>{
            try{
                console.log("Inside createuserTouserMessage ",context.user.id,receiverId,text);
                if (!context.user.id) return null;
                const message= await context.prisma.directmessage.create({
                    data:{
                        senderId:context.user.id,
                        receiverId,
                        text
                    }
                });
                console.log("createuserTouserMessage executed succcesfully ",message)
                if(message) {
                     message.createdAt=new Date(message.createdAt).toISOString();
                     console.log("reciver and sender",receiverId,message.senderId)
                    pubsub.publish(MESSAGE_ADDED,{
                        senderId:message.senderId,
                        receiverId,
                        newUserMessage:message
                      }) 
                    return {
                        ok: true,
                        message:[message]
                    }
                }

                return {
                    ok: false,
                    errors: formatErrors(
                            "createuserTouserMessage",
                            "can't create message for this user Db issue"
                        )
                }
            }
            catch(error){
                return {
                    ok: false,
                    errors: formatErrors(
                        "createuserTouserMessage",
                        "can't create message for this user"
                    )
                }
            }
        }
    }

};

export default usertoUserMessageResolver;
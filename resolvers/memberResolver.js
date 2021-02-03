import { formatErrors } from '../ErrorFormat.js';
import {PubSub,withFilter } from 'apollo-server';

const pubsub= new PubSub();
const TEAM_ADDED='TEAM_ADDED';

const teamResolver = {
  Subscription: {
    newTeamMessage:{
      subscribe:withFilter(()=> pubsub.asyncIterator(TEAM_ADDED),
      (payload,args)=> {console.log("Team Payload"); return true})
    }
  },
  Mutation: {
    createMember: async (parent, { email, teamId }, context, info) => {
      try { 
        if (!context.user.id) return null;
          const team= await context.prisma.team.findOne({
                where:{
                    id:teamId
                },
                include:{
                  owner:true,
                  channels:true
                }
          });
          console.log("Team ",team.userId,context.user.id)
          if(team.userId!= context.user.id){
              return {
                  ok:false,
                  errors: formatErrors(
                    "member",
                    "You are not allowed to create the user"
                  )
              }
          }
          const userExists= await context.prisma.user.findOne({
              where:{
                  email
              }
          });

          if(!userExists) {
              return {
                  ok:false,
                  errors:formatErrors(
                  "member",
                  "Requested User doesn't exists"
                  )
              }
          }
          console.log("userExists",userExists);
          if(userExists.id == context.user.id) {
            return {
                ok:false,
                errors:formatErrors(
                "member",
                "You can't add yourself into the team "
                )
            }
          }
          const checkMemberExistence= await context.prisma.member.findOne({
            where:{
              memberUserId_teamUserId:{
                memberUserId:userExists.id,
                teamUserId: team.id
              }
            }
          })
          if(!checkMemberExistence) {
          const member= await context.prisma.member.create({
              data:{
                userId:{
                    connect:{
                        id: userExists.id
                    }
                },
                teamId:{
                    connect:{
                        id: team.id,
                    }
                }
              }
          });
          if(member) {
            pubsub.publish(TEAM_ADDED,{
              newTeamMessage:{
                ok: true,
                id:team.id,
                owner:team.owner,
                name:team.name,
                channels:team.channels
              }
            })
            return {
                ok:true
            }    
          }
          else {
              return {
                  ok:true,
                  errors: formatErrors(
                      "Member",
                      "can't create the Member with following Email"
                    )
              } 
          }
        }
        else {
         return {
            ok: false,
            errors: formatErrors(
              "Member",
              "Already Member of this team"
            )
          };
        }
      } catch (error) {
        console.log("Member catch",error);
        return {
          ok: false,
          errors: formatErrors(
            "Member",
            "can't create the Member with following Team"
          )
        };
      }
    }
  }
};
export default teamResolver;

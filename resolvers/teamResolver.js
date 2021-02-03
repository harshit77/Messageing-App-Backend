import { formatErrors } from '../ErrorFormat.js';


const teamResolver = {

  Query: {
    allTeams:async(parent,args,context,info)=>{
      try{
        if (!context.user.id) return null;
        const getAllTeams= await context.prisma.team.findMany({
          where:{
            owner:{id:context.user.id}
          },
          include:{
            channels: true,
            owner: true,
          },
          orderBy:{
            id: 'asc'
          }
        });
        console.log("getAllTeams",context.user.id,getAllTeams);
        return getAllTeams;
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
  otherTeams:async(parent,args,context,info)=>{
    console.log("Other csdjkvbckjsdbvjksdbjk")
    try{
      if (!context.user.id) return null;
      const otherTeams= await context.prisma.member.findMany({
        where:{
          memberUserId:context.user.id
        },
        include:{
          teamId:{
            include:{
              channels:true,
              owner:true
            }
          }
        },
        orderBy:{
          memberUserId: 'asc'
        }
      });
      // console.log("other team",context.user.id,otherTeams);
      const refinedotherTeam =otherTeams.filter(otherteam=> {
        if(otherteam.teamId.userId!=context.user.id)
          return otherteam.teamId;
      });
      console.log("refinedotherTeam",context.user.id,refinedotherTeam);
      if(refinedotherTeam.length!=0) {
        const anotherrefined= otherTeams.map(otherteam=> otherteam.teamId);
        return anotherrefined;
      }
      return [];
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
    createTeam: async (parent, { name }, context, info) => {
      try { 
        if(!context.user.id) return null;
        const team = await context.prisma.team.create({
          data: {
            name,
            owner: {
              connect: {
                id: context.user.id
              }
            }
          }
        });
        const channels= await context.prisma.channel.create({
          data: {
            name:'general',
            public:true,
            team: {
              connect: {
                id: team.id // team id here hard coded
              }
            }
          }
        });
        console.log("Team",team,channels);
        if (team) {
          const owner = await context.prisma.user.findOne({
            where:{
              id:context.user.id
            }
          });
          return {
            ok: true,
            id:team.id,
            owner,
            name:team.name,
            channels:[channels]
          };
        }
        return {
          ok: false,
          errors: formatErrors(
            "team",
            "can't create the team with folowing user"
          )
        };
      } catch (error) {
        console.log("Team catch",error);
        return {
          ok: false,
          errors: formatErrors(
            "team",
            "can't create the team with folowing user"
          )
        };
      }
    }
  }
};
export default teamResolver;

import { formatErrors } from '../ErrorFormat.js';

const channelResolver = {
  Mutation: {
    createChannel: async (parent, { name }, context, info) => {
      console.log("Got the request from create channel"); 
      try { 
        if(!context.user.id) return null;
        const channel = await context.prisma.channel.create({
          data: {
            name,
            team: {
              connect: {
                id: context.user.id 
              }
            }
          }
        });
        console.log("Channel",channel);
        if (channel) {
          return {
            ok: true,
            channel
          };
        }
        return {
          ok: false,
          errors: formatErrors(
            "Channel",
            "can't create the channel with folowing user"
          )
        };
      } catch (error) {
        console.log("Channel catch",error);
        return {
          ok: false,
          errors: formatError(
            "Channel team",
            "can't create the Channel with folowing user"
          )
        };
      }
    }
  }
};
export default channelResolver;

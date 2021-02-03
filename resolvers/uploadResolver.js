import { formatErrors } from '../ErrorFormat.js';


const uploadResolver= {
    Mutation:{
        uploadFileByUser:async (parent,args,context,info)=>{
            return args.file.then(file=>{
                console.log("File Recieved",file);
            })
        }
    }
}

export default uploadResolver;
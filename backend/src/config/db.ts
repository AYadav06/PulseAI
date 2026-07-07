import mongoose from "mongoose";


export const connectDb= async ()=>{
try{
    const conn=await mongoose.connect(process.env.MONGO_URL as string)
    console.log(`MongoDB connected: ${conn.connection.host}`);
}
catch(error){
    if( error instanceof Error){
        console.error(`Error:${error.message}`);
    }
    else{
        console.error("Unknown error is occure")
    }
    process.exit(1);
}
};

export default connectDb
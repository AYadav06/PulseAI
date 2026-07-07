
import { model, Schema } from "mongoose";

export const userSchema= new Schema({

    email:{
        type:String,
        required:[true,"Please enter a email"],
        unique:true
    },
    password:{
        type:String,
        required:[true],
    }
})

const userModel=model("User",userSchema);
export default userModel;
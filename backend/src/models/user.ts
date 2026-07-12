
import { model, Schema } from "mongoose";
import { boolean } from "zod";


export interface IUser extends Document{
email :string,
password:string,
credits:number,
isPremium:boolean,
createdAt:Date,
updatedAt:Date
}

const userSchema= new Schema<IUser>({

    email:{
        type:String,
        required:[true,"Please enter a email"],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"please enter a password"],
    },
    credits: {
        type: Number,
        default:5
    },
    isPremium: {
        type: Boolean,
        default:false
     }
    },
     {timestamps:true})

export const User=model<IUser>("User",userSchema);
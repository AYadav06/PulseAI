
import  * as z from "zod"

const MAX_INPUT_TOKENS=1000;
export const  userTypes= z.object({
    email:z.email(),
    password:z.string()
})
export type ModelFull={
    id:string;
    name:string;
    isPremium:boolean
}
export const MODELS:ModelFull[]=[
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    isPremium: false
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    isPremium: false
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    isPremium: false
  }
]

export const SUPPORTER_MODELS = MODELS.map(model => model.id);
export type MODEL = typeof SUPPORTER_MODELS[number];

export const chatschemes=z.object({
   conversationId:z.string().optional(),
    message:z.string().max(MAX_INPUT_TOKENS),
    model:z.enum(SUPPORTER_MODELS)
})
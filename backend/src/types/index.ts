
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
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    isPremium: false
  }
]

export const SUPPORTER_MODELS = MODELS.map(model => model.id);
export type MODEL = typeof SUPPORTER_MODELS[number];

export const chatschemes=z.object({
   conversationId:z.uuid().optional(),
    message:z.string().max(MAX_INPUT_TOKENS),
    model:z.enum(SUPPORTER_MODELS)
})
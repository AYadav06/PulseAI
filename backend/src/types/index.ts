
import  * as z from "zod"

export const  userTypes= z.object({
    email:z.email(),
    password:z.string()
})

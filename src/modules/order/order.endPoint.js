import { roles } from "../../middleware/auth.js";




export const endpoint = {
    create:[roles.User],
    cancel:[roles.User],
    status:[roles.Admin]
}
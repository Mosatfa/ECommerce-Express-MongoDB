import {roles} from "../../middleware/auth.js"

export const endpoint = {
    create : [roles.Admin],
    delete : [roles.Admin],
    update : [roles.Admin],
    addlist: [roles.User],
}
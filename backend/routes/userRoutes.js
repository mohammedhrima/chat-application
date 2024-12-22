import { Router } from "express"
import { Login, Signup , Clear} from "../controllers/userControllers.js";

const userRoutes = Router();

userRoutes.post("/signup", Signup)
userRoutes.post("/login", Login)
userRoutes.post("/clear", Clear); 

export default userRoutes
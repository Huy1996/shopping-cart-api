import express from "express";
import { isAdmin, isAuth } from "../middleware/middleware.js";
import * as userController from '../controllers/userController.js'

const userRoute = express.Router();

// Get Request Section
userRoute.get('/:id',       isAuth,             userController.getUserByID);
userRoute.get('/',          isAuth, isAdmin,    userController.getUserList)


// Post Request Section
userRoute.post('/signin',                       userController.userSignin);
userRoute.post('/register',                     userController.userRegister);


// Put Request Section
userRoute.put('/profile',   isAuth,             userController.updateProfile);
userRoute.put('/:id',       isAuth, isAdmin,    userController.updateUser);


// Delete Request Section
userRoute.delete('/:id',    isAuth, isAdmin,    userController.deleteUser)

export default userRoute;
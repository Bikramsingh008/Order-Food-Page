import express from 'express';
import { loginUser, registerUser, adminLogin, listUsers, getUserProfile, updateUserProfile } from '../controller/userController.js';
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/profile', userAuth, getUserProfile);
userRouter.post('/update-profile', userAuth, updateUserProfile);
userRouter.get('/list', adminAuth, listUsers);

export default userRouter;
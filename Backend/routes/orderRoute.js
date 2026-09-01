import express from 'express';
import { placeOrder, userOrders, rateOrder, allOrders, updateStatus } from '../controller/orderController.js';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRouter = express.Router();

// User routes
orderRouter.post('/place', userAuth, placeOrder);
orderRouter.post('/userorders', userAuth, userOrders);
orderRouter.post('/rate', userAuth, rateOrder);

// Admin routes
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

export default orderRouter;

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');

const authenticate = require('../middlewares/auth');

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
//router.get('/me/:id', authenticate, getOrderById);
router.get('/me', authenticate, getOrdersByUser);
router.put('/:id', authenticate, updateOrder);
router.delete('/:id', authenticate, deleteOrder);

module.exports = router;

const axios = require('axios');

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

// Criar novo pedido

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const user = req.user.id

    console.log("Dados do pedido:", req.body);

    if (!user || !items || items.length === 0) {
      return res.status(400).json({ message: "Dados do pedido inválidos." });
    }

    // Calcula o total
    const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    // Cria a ordem principal
    const order = await Order.create({ user, totalValue: total });

    // Cria os itens relacionados à ordem
    const orderItems = items.map(item => ({
      orderId: order._id,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    await OrderItem.insertMany(orderItems);

    res.status(201).json({ orderId: order._id });
  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    res.status(500).json({ message: "Erro ao criar pedido" });
  }
};

// Listar todos os pedidos
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    // Buscar os nomes dos usuários em lote (chamada para outra API)
    const userIds = orders.map(o => o.user);
    const response = await axios.post('http://localhost:3000/api/auth/usersByIds', {
      ids: userIds
    });

    const userMap = response.data; // Supondo que seja um objeto: { userId: username }

    // Substituir o ID pelo nome
    const ordersWithUsernames = orders.map((order) => ({
      ...order.toObject(),
      username: userMap[order.user] || "Desconhecido"
    }));

    res.json(ordersWithUsernames);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ message: "Erro ao buscar pedidos" });
  }
};

/*exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/

// Buscar um pedido por ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: 'user',
      select: 'username'
    });
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar pedidos por usuário autenticado
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Busca todas as ordens do usuário
    const orders = await Order.find({ user: userId });

    if (orders.length === 0) {
      return res.json([]);
    }

    const orderIds = orders.map((o) => o._id);

    // Busca todos os itens relacionados a essas ordens
    const allItems = await OrderItem.find({ orderId: { $in: orderIds } });

    // Agrupa os itens por orderId
    const itemsGrouped = {};
    allItems.forEach((item) => {
      const key = item.orderId.toString();
      if (!itemsGrouped[key]) itemsGrouped[key] = [];
      itemsGrouped[key].push({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      });
    });

    // Monta os pedidos com os itens
    const result = orders.map((order) => ({
      _id: order._id,
      user: order.user,
      totalValue: order.totalValue,
      status: order.status,
      createdAt: order.createdAt,
      items: itemsGrouped[order._id.toString()] || [],
    }));

    res.json(result);
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error);
    res.status(500).json({ message: "Erro ao buscar pedidos do usuário" });
  }
};

/*exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId });

    const userResponse = await axios.post('http://localhost:3000/api/auth/usersByIds', {
      ids: [userId]
    });

    const username = userResponse.data[userId] || 'Desconhecido';

    const result = orders.map((order) => ({
      ...order.toObject(),
      username
    }));

    res.json(result);
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error);
    res.status(500).json({ message: "Erro ao buscar pedidos do usuário" });
  }
};*/

// Atualizar um pedido por ID
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Deletar um pedido por ID
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });
    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

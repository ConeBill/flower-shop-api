const Category = require('../models/Category');

// Criar novo pedido
exports.createCategory = async (req, res) => {
    const name = req.body.name;
    if (!name) {
        return res.status(400).json({ message: 'O nome da categoria é obrigatório' });
    }
  try {
    const category = await Category.create({name});
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Listar todos os pedidos
exports.getCategorys = async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar um pedido por ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Atualizar um pedido por ID
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Deletar um pedido por ID
exports.deleteCategory = async (req, res) => {
    console.log(req.params.id);
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

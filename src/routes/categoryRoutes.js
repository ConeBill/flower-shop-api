const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategorys,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

router.post('/', createCategory);
router.get('/', getCategorys);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

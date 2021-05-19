const express = require('express');
const router = express.Router();
const { auth } = require("../app/middlewares");

const categoryController = require('../app/controllers/CategoryController');

router.get('/create', categoryController.create);
router.post('/handle-form-actions', categoryController.handleFromActions);
router.post('/store', categoryController.store);
router.get('/:id/edit', categoryController.edit);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);
router.delete('/:id/force-delete', categoryController.forceDelete);
router.patch('/:id/restore', categoryController.restore);
router.get('/:slug', categoryController.showCategory);

module.exports = router;

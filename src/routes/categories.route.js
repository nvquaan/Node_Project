const express = require('express');
const router = express.Router();
const { auth } = require("../app/middlewares");

const categoryController = require('../app/controllers/CategoryController');

router.get('/create',[auth.isAdmin], categoryController.create);
router.post('/handle-form-actions',[auth.isAdmin], categoryController.handleFromActions);
router.post('/store',[auth.isAdmin], categoryController.store);
router.get('/:id/edit',[auth.isAdmin], categoryController.edit);
router.put('/:id',[auth.isAdmin], categoryController.update);
router.delete('/:id',[auth.isAdmin], categoryController.delete);
router.delete('/:id/force-delete',[auth.isAdmin], categoryController.forceDelete);
router.patch('/:id/restore',[auth.isAdmin], categoryController.restore);
router.get('/:slug',[auth.isAdmin], categoryController.showCategory);

module.exports = router;

const express = require('express');
const router = express.Router();
const { auth } = require("../app/middlewares");

const lessonController = require('../app/controllers/lessonController');

router.get('/create',[auth.isAdmin], lessonController.create);
router.post('/handle-form-actions',[auth.isAdmin], lessonController.handleFromActions);
router.post('/store',[auth.isAdmin], lessonController.store);
router.get('/:id/edit',[auth.isAdmin], lessonController.edit);
router.put('/:id',[auth.isAdmin], lessonController.update);
router.delete('/:id',[auth.isAdmin], lessonController.delete);
router.delete('/:id/force-delete',[auth.isAdmin], lessonController.forceDelete);
router.patch('/:id/restore',[auth.isAdmin], lessonController.restore);
router.get('/:slug',[auth.isAdmin], lessonController.showLesson);

module.exports = router;

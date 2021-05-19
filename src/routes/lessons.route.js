const express = require('express');
const router = express.Router();
const { auth } = require("../app/middlewares");

const lessonController = require('../app/controllers/lessonController');

router.get('/create', lessonController.create);
router.post('/handle-form-actions', lessonController.handleFromActions);
router.post('/store', lessonController.store);
router.get('/:id/edit', lessonController.edit);
router.put('/:id', lessonController.update);
router.delete('/:id', lessonController.delete);
router.delete('/:id/force-delete', lessonController.forceDelete);
router.patch('/:id/restore', lessonController.restore);
router.get('/:slug', lessonController.showLesson);

module.exports = router;

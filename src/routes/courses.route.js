const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController');

router.get('/create', courseController.create);
router.post('/handle-form-actions', courseController.handleFromActions);
router.post('/store', courseController.store);
router.get('/:id/edit', courseController.edit);
router.put('/:id', courseController.update);
router.delete('/:id', courseController.delete);
router.delete('/:id/force-delete', courseController.forceDelete);
router.patch('/:id/restore', courseController.restore);
router.get('/:slug', courseController.show);

module.exports = router;
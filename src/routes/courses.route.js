const express = require('express');
const router = express.Router();
const { auth } = require("../app/middlewares");

const courseController = require('../app/controllers/CourseController');

router.get('/create', courseController.create);
router.post('/handle-form-actions', courseController.handleFromActions);
router.post('/store', courseController.store);
router.get('/:id/edit', courseController.edit);
router.put('/:id', courseController.update);
router.delete('/:id', courseController.delete);
router.delete('/:id/force-delete', courseController.forceDelete);
router.patch('/:id/restore', courseController.restore);
router.get('/:id/rates', courseController.getAllRatesOfCourse);
router.get('/:slug', courseController.showCourse);
router.delete('/rates/:id', courseController.deleteRate);

module.exports = router;

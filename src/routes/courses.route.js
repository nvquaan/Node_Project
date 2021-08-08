const express = require('express');
const router = express.Router();
const { auth } = require("../app/middlewares");

const courseController = require('../app/controllers/CourseController');

router.get('/create',[auth.isAdmin], courseController.create);
router.post('/handle-form-actions',[auth.isAdmin], courseController.handleFromActions);
router.post('/store',[auth.isAdmin], courseController.store);
router.get('/:id/edit',[auth.isAdmin], courseController.edit);
router.put('/:id',[auth.isAdmin], courseController.update);
router.delete('/:id',[auth.isAdmin], courseController.delete);
router.delete('/:id/force-delete',[auth.isAdmin], courseController.forceDelete);
router.patch('/:id/restore',[auth.isAdmin], courseController.restore);
router.get('/:id/rates',[auth.isAdmin], courseController.getAllRatesOfCourse);
router.get('/:slug',[auth.isAdmin], courseController.showCourse);
router.delete('/rates/:id',[auth.isAdmin], courseController.deleteRate);

module.exports = router;

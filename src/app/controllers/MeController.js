const Course = require('../models/Course');
const { PromiseProvider } = require('mongoose');

class MeController{

    storedCourses(req, res, next){
       
        Promise.all([Course.find({}).sortable(req), Course.countDocumentsDeleted()])
            .then(([courses, deletedCount])=>{
                courses = courses.map(course => course.toObject());
                res.render('me/stored-courses', {deletedCount, courses });
            })
            .catch(next)
    }

    //[GET] /me/trash/courses
    trashCourses(req, res, next){
        Course.findDeleted({})
            .then(deletedCourses => {
                deletedCourses = deletedCourses.map(course => course.toObject());
                res.render('me/trash-courses', { deletedCourses });
            })
            .catch(next) 
    }

}

module.exports = new MeController;
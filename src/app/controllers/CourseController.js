const Course = require("../models/Course");
const Category = require("../models/Category")

class CourseController {
    //[GET] /courses/:slug  Hien thi 1 khoa hoc
    showCourse(req, res, next) {
        Course.findOne({slug: req.params.slug})
            .then((course) => {
                course = course.toObject();
                res.render("courses/show", {course, removeHeader: false});
            })
            .catch(next);
    }

    //[GET] courses/create  Vao trang tao moi
    create(req, res, next) {
        Category.find({})
            .then(categories => {
                categories = categories.map(c => c.toObject());
                res.render("courses/create", {categories});
            })
            .catch(next);
    }

    //[POST] courses/store  Thuc hien luu khoa hoc
    store(req, res, next) {
        const formData = {...req.body};
        const course = new Course(formData);
        course
            .save()
            .then(() => res.redirect("/me/stored/courses"))
            .catch((error) => {
            });
    }

    //[GET] /courses/:id/edit   Vao trang update khoa hoc
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then((course) => {
                course = course.toObject();
                res.render("courses/edit", {course});
            })
            .catch(next);
    }

    //[PUT] /courses/:id    Update khoa hoc
    update(req, res, next) {
        let formData = {...req.body}
        Course.updateOne({_id: req.params.id}, formData)
            .then(() => res.redirect("/me/stored/courses"))
            .catch(next);
    }

    //[DELETE] /courses/:id SOFT DELETE
    delete(req, res, next) {
        Course.delete({_id: req.params.id})
            .then(() => res.redirect("back"))
            .catch(next);
    }

    //[DELETE] /courses/:id DELETE
    forceDelete(req, res, next) {
        Course.deleteOne({_id: req.params.id})
            .then(() => res.redirect("back"))
            .catch(next);
    }

    //[PATCH] /courses/:id/restore Xoa khoa hoc
    restore(req, res, next) {
        Course.restore({_id: req.params.id})
            .then(() => res.redirect("back"))
            .catch(next);
    }

    //[POST] /courses/handle-form-actions
    handleFromActions(req, res, next) {
        switch (req.body.action) {
            case "delete":
                Course.delete({_id: {$in: req.body.courseIds}})
                    .then(() => res.redirect("back"))
                    .catch(next);
                break;
            default:
                res.json({message: "Action is invalid"});
        }
    }
}

module.exports = new CourseController();

const Course = require("../models/Course");
const Category = require("../models/Category");

class CourseController {
    //[GET] /courses/:slug  Hien thi 1 khoa hoc
    async showCourse(req, res, next) {
        try {
            let course = await Course.findOne({ slug: req.params.slug });
            course = course.toObject();
            res.render("courses/show", { course, removeHeader: false });
        } catch (err) {
            next(err);
        }
    }

    //[GET] courses/create  Vao trang tao moi
    async create(req, res, next) {
        try {
            let categories = await Category.find({});
            categories = categories.map(c => c.toObject());
            res.render("courses/create", { categories });
        } catch (err) {
            next(err);
        }
    }

    //[POST] courses/store  Thuc hien luu khoa hoc
    async store(req, res, next) {
        try {
            const formData = { ...req.body };
            const course = new Course(formData);
            const category = await Category.findOne({ _id: formData.category });
            category.courseNumber++;
            await category.save();
            await course.save();
            res.redirect("/me/stored/courses");
        } catch (err) {
            next(err);
        }
    }

    //[GET] /courses/:id/edit   Vao trang update khoa hoc
    async edit(req, res, next) {
        try {
            let course = await Course.findById(req.params.id);
            let categories = await Category.find({});
            categories = categories.map(c => c.toObject());
            course = course.toObject();
            console.log(course);
            res.render("courses/edit", { course, categories });
        } catch (err) {
            next(err);
        }
    }

    //[PUT] /courses/:id    Update khoa hoc
    async update(req, res, next) {
        try {
            let formData = { ...req.body };
            let course = await Course.findOne({_id: req.params.id});
            let categoryId = course.category;
            if(categoryId != formData.category){
                updateNumber(Category, 'courseNumber', categoryId, formData.category);
            }
            await Course.updateOne({ _id: req.params.id }, formData);
            res.redirect("/me/stored/courses");
        } catch (err) {
            next(err);
        }
    }

    //[DELETE] /courses/:id SOFT DELETE
    async delete(req, res, next) {
        try {
            await Course.delete({ _id: req.params.id });
            res.redirect("back");
        } catch (err) {
            next(err);
        }
    }

    //[DELETE] /courses/:id DELETE
    async forceDelete(req, res, next) {
        try {
            const course = await Course.findOneDeleted({ _id: req.params.id });
            const resultDelete = await course.deleteOne();
            console.log(resultDelete);
            const category = await Category.findOne({ _id: resultDelete.category });
            console.log(category);
            category.courseNumber--;
            await category.save();
            res.redirect("back");
        } catch (err) {
            next(err);
        }
    }

    //[PATCH] /courses/:id/restore Xoa khoa hoc
    async restore(req, res, next) {
        try {
            await Course.restore({ _id: req.params.id });
            res.redirect("back");
        } catch (err) {
            next(err);
        }
    }

    //[POST] /courses/handle-form-actions
    async handleFromActions(req, res, next) {
        switch (req.body.action) {
            case "delete":
                try {
                    await Course.delete({ _id: { $in: req.body.courseIds } });
                    res.redirect("back");
                } catch (err) {
                    next(err);
                }
                break;
            default:
                res.json({ message: "Action is invalid" });
        }
    }
}
async function updateNumber(collectionName, fieldName, oldId, newId) {
    try {
        let a = await collectionName.findOne({_id: oldId});
        a[fieldName] --;
        await a.save();
        let b = await collectionName.findOne({_id: newId});
        b[fieldName]++;
        await b.save();
    }
    catch (err) {
        return err;
    }
}
module.exports = new CourseController();

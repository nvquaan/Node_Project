const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

class LessonController {
    //[GET] /lessons/:slug  Hien thi 1 bai hoc
    async showLesson(req, res, next) {
        try {
            let lesson = await Lesson.findOne({ slug: req.params.slug });
            lesson = lesson.toObject();
            res.render("lessons/show", { lesson, removeHeader: false });
        } catch (err) {
            next(err);
        }
    }

    //[GET] lessons/create  Vao trang tao moi
    async create(req, res, next) {
        try {
            let courses = await Course.find({});
            courses = courses.map(c => c.toObject());
            res.render("lessons/create", { courses });
        } catch (err) {
            next(err);
        }
    }

    //[POST] lessons/store  Thuc hien luu bai hoc
    async store(req, res, next) {
        try {
            const formData = { ...req.body };
            const lesson = new Lesson(formData);
            const course = await Course.findOne({ _id: formData.course });
            course.lessonNumber++;
            await course.save();
            await lesson.save();
            res.redirect("/me/stored/lessons");
        } catch (err) {
            next(err);
        }
    }

    //[GET] /lessons/:id/edit   Vao trang update bai hoc
    async edit(req, res, next) {
        try {
            let lesson = await Lesson.findById(req.params.id);
            lesson = lesson.toObject();
            let courses = await Course.find({});
            courses = courses.map(c => c.toObject());
            res.render("lessons/edit", { lesson, courses });
        } catch (err) {
            next(err);
        }
    }

    //[PUT] /lessons/:id/edit    Update bai hoc
    async update(req, res, next) {
        try {
            let formData = { ...req.body };
            let lesson = await Lesson.findOne({_id: req.params.id});
            let courseId = lesson.course;
            if(courseId != formData.course){
                updateNumber(Course, 'lessonNumber', courseId, formData.course);
            }
            await Lesson.updateOne({ _id: req.params.id }, formData);
            res.redirect("/me/stored/lessons");
        } catch (err) {
            next(err);
        }
    }

    //[DELETE] /lessons/:id SOFT DELETE
    async delete(req, res, next) {
        try {
            await Lesson.delete({ _id: req.params.id });
            res.redirect("back");
        } catch (err) {
            next(err);
        }
    }

    //[DELETE] /lessons/:id DELETE
    async forceDelete(req, res, next) {
        try {
            const lesson = await Lesson.findOneDeleted({ _id: req.params.id });
            const resultDelete = await lesson.deleteOne();
            const course = await Course.findOne({ _id: resultDelete.course });
            course.lessonNumber--;
            await course.save();
            res.redirect("back");
        } catch (err) {
            next(err);
        }
    }

    //[PATCH] /lessons/:id/restore Xoa bai hoc
    async restore(req, res, next) {
        try {
            await Lesson.restore({ _id: req.params.id });
            res.redirect("back");
        } catch (err) {
            next(err);
        }
    }

    //[POST] /lessons/handle-form-actions
    async handleFromActions(req, res, next) {
        switch (req.body.action) {
            case "delete":
                try {
                    await Lesson.delete({ _id: { $in: req.body.lessonIds } });
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
module.exports = new LessonController();

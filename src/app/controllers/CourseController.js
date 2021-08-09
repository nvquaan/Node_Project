const Course = require("../models/Course");
const Category = require("../models/Category");
const Lesson = require("../models/Lesson");
const Rate = require("../models/Rate");
const User = require("../models/User");

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
            let course = await Course.findOne({ _id: req.params.id });
            let categoryId = course.category;
            if (categoryId != formData.category) {
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
            const courseId = req.params.id;
            await Lesson.delete({ course: courseId });
            await Course.delete({ _id: courseId });
            res.redirect("back");
        } catch (err) {
            next(err);
        }
    }

    //[DELETE] /courses/:id DELETE xoa hoan toan
    async forceDelete(req, res, next) {
        try {
            await Lesson.deleteMany({ course: req.params.id });
            const course = await Course.findOneDeleted({ _id: req.params.id });
            const resultDelete = await course.deleteOne();
            const category = await Category.findOne({ _id: resultDelete.category });
            category.courseNumber--;
            //Nếu khoá học đã được mua, xoá trong bảng user
            const users = await User.find({});
            users.forEach( async u => {
                let index = u.courses.findIndex(c => c.course == req.params.id || !c);
                u.courses.splice(index, 1);
                await u.save();
            });
            await category.save();
            res.redirect("back");
        } catch (err) {
            next(err);
        }
    }

    //[PATCH] /courses/:id/restore Khoi phuc khoa hoc
    async restore(req, res, next) {
        try {
            await Course.restore({ _id: req.params.id });
            res.redirect("back");
        } catch (err) {
            next(err);
        }
    }

    //[GET] /me/store/:id/rates -> lấy rate của khoá học
    async getAllRatesOfCourse(req, res, next) {
        try {
            let rates = await Rate.find({ course: req.params.id }).populate('course', 'name').populate('user', 'username');
            rates = rates.map(r => r.toObject());
            let course = await Course.findOne({_id: req.params.id});
            course = course.toObject();
            res.render('courses/show', { rates, course });
        }
        catch (err) {
            next(err);
        }
    }

    //[DELETE] /courses/rates/:id -> xoa rate cua khoa hoc
    async deleteRate(req, res, next) {
        try {
            //flow: Xoá rate theo id đồng thời lấy id khoá học của rate đó
            // -> Tìm trong bảng rate tất cả các rate có id khoá học ở trên
            let rate = await Rate.findOne({ _id: req.params.id});
            await Rate.deleteOne({ _id: req.params.id });
            let course = await Course.findOne({ _id: rate.course });
            let rates = await Rate.find({ course: course._id });
            if (rates.length > 0) {
                rates = rates.map((r) => r.toObject());
                let rateAvg = rates.reduce((value, item) => {
                    return value + item.rate;
                }, 0);
                course.rateAvg = +(rateAvg / rates.length).toFixed(1);
            } else {
                course.rateAvg = 0;
            }
            await course.save();
            res.redirect('back');
        }
        catch (err) {
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
        let a = await collectionName.findOne({ _id: oldId });
        a[fieldName]--;
        await a.save();
        let b = await collectionName.findOne({ _id: newId });
        b[fieldName]++;
        await b.save();
    }
    catch (err) {
        return err;
    }
}
module.exports = new CourseController();

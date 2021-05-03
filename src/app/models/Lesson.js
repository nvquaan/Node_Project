const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete"); //Soft delete

const LessonSchema = new Schema(
    {
        name: {type: String},
        description: {tpye: String},
        imageUrl: {type: String},
        time: {type: String},
        slug: {type: String, slug: "name", unique: true},
        course: {type: mongoose.Schema.Types.ObjectID, ref: 'Course', required: true}
    },
    {
        timestamps: true,
    }
);

//Custom query helpers
LessonSchema.query.sortable = function (req) {
    if (req.query.hasOwnProperty("_sort")) {
        const isValidType = ["asc", "desc"].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidType ? req.query.type : "desc",
        });
    }
    return this;
};

//Add plugins
LessonSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

mongoose.plugin(slug);

module.exports = mongoose.model("Lesson", LessonSchema);

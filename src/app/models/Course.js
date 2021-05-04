const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete"); //Soft delete

const CourseSchema = new Schema(
    {
        name: {type: String},
        description: String,
        imageUrl: {type: String},
        lessonNumber: {type: Number, default:0},
        level: {type: String},
        time: {type: String},
        rate: {type: Number, default:0},
        cost: {type: Number},
        slug: {type: String, slug: "name", unique: true},
        category: {type: mongoose.Schema.Types.ObjectID, ref: 'Category', required: true}
    },
    {
        timestamps: true,
    }
);

//Custom query helpers
CourseSchema.query.sortable = function (req) {
    if (req.query.hasOwnProperty("_sort")) {
        const isValidType = ["asc", "desc"].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidType ? req.query.type : "desc",
        });
    }
    return this;
};

//Add plugins
CourseSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

mongoose.plugin(slug);

module.exports = mongoose.model("Course", CourseSchema);

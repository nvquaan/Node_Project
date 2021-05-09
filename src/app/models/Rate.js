const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RateSchema = new Schema(
    {
        message: {type: String, default: 'No comment'},
        rate: {type: Number},
        course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
    }
);


module.exports = mongoose.model("Rate", RateSchema);

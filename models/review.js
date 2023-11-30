const {Schema, model} = require("mongoose");

const ReviewSchema = new Schema({
    star: {type: Number, required: true},
    review: {type: String}
})

const Review = model("Review", ReviewSchema)
module.exports = {Review}
const {Schema, model} = require("mongoose");

const DateInfoSchema = new Schema({
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true}
})

const DateInfo = model("DateInfo", DateInfoSchema)
module.exports = {DateInfoSchema, DateInfo}
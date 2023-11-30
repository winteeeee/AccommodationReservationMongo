const {Schema, model} = require("mongoose");

const SafetyAmenitiesSchema = new Schema({
    carbonMonoxideAlarm: {type: Boolean},
    smokeAlarm: {type: Boolean},
    fireExtinguisher: {type: Boolean},
    firstAidKit: {type: Boolean},
    emergencyPlanAndLocalNumbers: {type: Boolean}
})

const SafetyAmenities = model("SafetyAmenities", SafetyAmenitiesSchema)
module.exports = {SafetyAmenities}
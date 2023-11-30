const {Schema, model} = require("mongoose");

const AccessibilityAmenitiesSchema = new Schema({
    stepFreeEntryway: {type: Boolean},
    wideEntrances: {type: Boolean},
    wideHallways: {type: Boolean},
    accessibleBathroom: {type: Boolean}
})

const AccessibilityAmenities = model("AccessibilityAmenities", AccessibilityAmenitiesSchema)
module.exports = {AccessibilityAmenities}

const {Schema, model, Types} = require("mongoose");
const {BasicAmenitiesSchema} = require("./basicAmenities");
const {TopAmenitiesGuestsSearchForSchema} = require("./topAmenitiesGuestsSearchFor");
const {SafetyAmenitiesSchema} = require("./safetyAmenities");
const {AccessibilityAmenitiesSchema} = require("./accessibilityAmenities");

const AccommodationSchema = new Schema({
    spaceType: { type: String, required: true, enum: ['ENTIRE_PLACE', 'PRIVATE_ROOM'] },
    name: { type: String, required: true },
    address: { type: String, required: true },
    accommodatedPerson: { type: Number, required: true },
    room: { type: Number, required: true },
    bedroom: { type: Number, required: true },
    bed: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    introduction: { type: String, required: true },
    weekdayFare: { type: Number, required: true },
    weekendFare: { type: Number, required: true },
    basicAmenities: [BasicAmenitiesSchema],
    topAmenitiesGuestsSearchFor: [TopAmenitiesGuestsSearchForSchema],
    safetyAmenities: [SafetyAmenitiesSchema],
    accessibilityAmenities: [AccessibilityAmenitiesSchema]
})

AccommodationSchema.virtual("reservations", {
    ref: "Reservation",
    localField: "_id",
    foreignField: "accommodation"
})
AccommodationSchema.set("toObject", { virtuals: true })
AccommodationSchema.set("toJSON", { virtuals: true })

const Accommodation = model("Accommodation", AccommodationSchema)
module.exports = {Accommodation}
const {Schema, model, Types} = require("mongoose");
const {BasicAmenities} = require("./basicAmenities");
const {TopAmenitiesGuestsSearchFor} = require("./topAmenitiesGuestsSearchFor");
const {SafetyAmenities} = require("./safetyAmenities");
const {AccessibilityAmenities} = require("./accessibilityAmenities");

const AccommodationSchema = new Schema({
    spaceType: { type: String, required: true, enum: ['ENTIRE_PLACE, PRIVATE_ROOM'] },
    name: { type: String, required: true },
    address: { type: String, required: true },
    accommodatedPerson: { type: Number, required: true },
    room: { type: Number, required: true },
    bedroom: { type: Number, required: true },
    bed: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    introduction: { type: Number, required: true },
    weekdayFare: { type: Number, required: true },
    weekendFare: { type: Number, required: true },
    basicAmenities: [BasicAmenities],
    topAmenitiesGuestsSearchFor: [TopAmenitiesGuestsSearchFor],
    safetyAmenities: [SafetyAmenities],
    accessibilityAmenities: [AccessibilityAmenities]
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
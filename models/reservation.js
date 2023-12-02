const {Schema, Types, model} = require("mongoose");
const {DateInfoSchema} = require("./dateInfo");
const {ReviewSchema} = require("./review");

const ReservationSchema = new Schema({
    guest: {type: Types.ObjectId, required: true, ref: "Member"},
    accommodation: {type: Types.ObjectId, required: true, ref: "Accommodation"},
    review: [ReviewSchema],
    dateInfo: [DateInfoSchema],
    person: {type: Number, required: true},
    room: {type: Number, required: true},
    fare: {type: Number, require: true}
})

const Reservation = model("Reservation", ReservationSchema)
module.exports = {Reservation}
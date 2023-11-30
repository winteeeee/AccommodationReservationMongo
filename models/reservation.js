const {Schema, Types, model} = require("mongoose");
const {DateInfo} = require("./dateInfo");
const {Review} = require("./review");

const ReservationSchema = new Schema({
    guest: {type: Types.ObjectId, required: true, ref: "Member"},
    accommodation: {type: Types.ObjectId, required: true, ref: "Accommodation"},
    review: [Review],
    dateInfo: [DateInfo],
    person: {type: Number, required: true},
    room: {type: Number, required: true}
})

const Reservation = model("Reservation", ReservationSchema)
module.exports = {Reservation}
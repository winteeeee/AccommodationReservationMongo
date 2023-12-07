const {Router} = require("express");
const {Reservation} = require("../models/reservation");
const {Accommodation} = require("../models/accommodation");
const {Member} = require("../models/member");
const reservationRouter = Router();

reservationRouter.post("/", async(req, res) => {
    try {
        const {guestId, houseId, review, dateInfo, person} = req.body;
        const guest = await Member.findOne({id: guestId})
        const house = await Accommodation.findById(houseId)
        const room = house.spaceType === "ENTIRE_PLACE" ? house.room : person
        const fare = 100
        //TODO 체크인, 체크아웃 날짜를 기반으로 fare 계산

        const reservation = new Reservation({
            guest: guest,
            accommodation: house,
            review: review,
            dateInfo: dateInfo,
            person: person,
            room: room,
            fare: fare});
        
        await reservation.save();
        return res.status(200).send({reservation});
    } catch(error) {
        return res.status(400).send({error: error.message});
    }
});

module.exports = reservationRouter;
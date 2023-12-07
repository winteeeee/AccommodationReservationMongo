const Router = require("express");
const {Reservation} = require("../models/reservation");
const reservationRouter = Router();
reservationRouter.post("/", async(req, res) => {
    try {
        const {guestId, houseId, review, dateInfo, person, room, fare} = req.body;
        const reservation = new Reservation({guestId, houseId, review, dateInfo, person, room, fare});
        
        await reservation.save();
        return res.status(200).send({reservation});
    } catch(error) {
        return res.status(400).send({error: error.message});
    }
});

module.exports = reservationRouter;
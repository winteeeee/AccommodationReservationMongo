const { Router } = require("express");
const { Accommodation } = require("../models/accommodation");
const { Reservation } = require("../models/reservation");
const accommodationRouter = Router();

accommodationRouter.get("/", async (req, res) => {
    try {
        const { checkIn, checkOut, applicant, houseType } = req.query; // Change to req.query

        console.log(req.query);
        console.log(applicant)
        console.log(houseType)
        const accommodations = await Accommodation.find({
            accommodatedPerson: { $gte: parseInt(applicant) }, // applicant를 정수로 변환
            spaceType: houseType
        });

        console.log(accommodations)

        return res.send({ accommodations });

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: err.message });
    }
});

// reviewRouter.get("/", async (req, res) => {
//     const { accommodationId } = req.params;
//     if (!isValidObjectId(accommodationId))
//         return res.status(400).send({ error: "accommodationId is invalid" });
//     const review = await Comment.find({ accommodation: accommodationId });
//     return res.send({ review });
// });
//
// reviewRouter.get("/:accommodationId/:memberId", async (req, res) => {
//     const { accommodationId, memberId } = req.params;
//
//     if (!isValidObjectId(accommodationId) || !isValidObjectId(memberId))
//         return res.status(400).send({ error: "유효하지 않은 accommodationId 또는 memberId" });
//
//     const reviews = await Comment.find({ accommodation: accommodationId, member: memberId });
//     return res.send({ reviews });
// });
module.exports = accommodationRouter;

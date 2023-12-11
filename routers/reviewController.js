const { Router } = require("express");
const { Review } = require("../models/review");
const { Reservation } = require("../models/reservation");

const reviewRouter = Router();
reviewRouter.post("/", async (req, res) => {
    console.log('[reviewRouter - POST :: /]')
    try {

        const { star, reviewContent, reserveId} = req.body;
        const reservation = await Reservation.findById(reserveId)

        // 여기서 DateInfoSchema의 endDate와 현재 날짜를 비교하여 리뷰 작성 가능 여부 확인
        const currentDate = new Date();

        const isReviewAllowed = reservation.dateInfo[0].endDate.getTime() < currentDate.getTime();
        if (!isReviewAllowed)
            return res.status(400).send({ error: "Review can only be written after the end date" });

        const review = new Review({ star, review : reviewContent});
        reservation.review = review;

        await review.save();
        await reservation.save();
        return res.send({ review });

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: err.message });
    }
});

reviewRouter.get("/:id", async (req, res) => {
    console.log('[reviewRouter - GET :: /:id]')
    const accommodation_id = req.params.id;


    const currentMonthStartDate = new Date();
    currentMonthStartDate.setDate(1); // 현재 달의 1일로 설정

    const currentMonthEndDate = new Date();
    currentMonthEndDate.setMonth(currentMonthEndDate.getMonth() + 1, 0); // 현재 달의 마지막 날로 설정

    const reviews = await Reservation.find({
        accommodation: accommodation_id,
    }).populate('review');

    const reviewData = [];

    reviews.forEach(reservation => {
        if (reservation.review && reservation.review.length > 0) {
            const reviewObj = {
                star: reservation.review[0].star,
                review: reservation.review[0].review
            };
            reviewData.push(reviewObj);
        }
    });

    return res.send({ reviews: reviewData });
});

module.exports = reviewRouter;

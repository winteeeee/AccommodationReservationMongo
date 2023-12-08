const { Router } = require("express");
const { Accommodation } = require("../models/accommodation");
const { Reservation } = require("../models/reservation");
const accommodationRouter = Router();

accommodationRouter.get("/", async (req, res) => {
    try {
        const { checkIn, checkOut, applicant, houseType } = req.query; // Change to req.query
        const accommodations = await Accommodation.find({
            accommodatedPerson: { $gte: parseInt(applicant) }, // applicant를 정수로 변환
            spaceType: houseType
        });

        const sortedAccommodations = await calculateAndSortPrices(accommodations, checkIn, checkOut, applicant);
        return res.send( {sortedAccommodations} );
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: err.message });
    }
});

// 각 숙소의 가격을 계산하고 별점으로 정렬하는 함수
async function calculateAndSortPrices(accommodations, checkInDate, checkOutDate, applicant) {
    const accommodationsWithAvgRating = await Promise.all(accommodations.map(async accommodation => {
        const totalPrice = calculateTotalPrice(accommodation, checkInDate, checkOutDate, applicant);
        const avgRating = await calculateAvgRating(accommodation._id);

        return {
            ...accommodation.toObject(),
            totalPrice,
            avgRating
        };
    }));

    // 별점을 기준으로 내림차순으로 정렬
    return accommodationsWithAvgRating.sort((a, b) => {
        if (a.totalPrice !== b.totalPrice) {
            return b.totalPrice - a.totalPrice;
        } else {
            return b.avgRating - a.avgRating;
        }
    });
}

// 각 숙소의 평균 별점을 계산하는 함수
async function calculateAvgRating(accommodationId) {
    const reservations = await Reservation.find({ accommodation: accommodationId }).populate('review');

    if (reservations.length === 0) {
        return 0;  // 리뷰가 없는 경우 0 반환
    }
    // 모든 리뷰의 별점을 합산하여 평균 계산
    const totalRating = reservations.reduce((sum, reservation) => {
        if (reservation.review) {
            return sum + reservation.review[0].star;
        } else {
            return sum;
        }
    }, 0);

    const validReviewsCount = reservations.reduce((count, reservation) => {
        return count + (reservation.review ? 1 : 0);
    }, 0);

    return validReviewsCount > 0 ? totalRating / validReviewsCount : 0;
}
// 각 숙소의 가격을 계산하는 함수
function calculateTotalPrice(accommodation, checkInDate, checkOutDate, applicant) {
    const weekdayPrice = accommodation.weekdayFare || 0;  // 주중 가격
    const weekendPrice = accommodation.weekendFare || 0;  // 주말 가격

    // 간단한 가정: 주말(금, 토)이라면 주말 가격을 사용, 그 외에는 주중 가격을 사용
    const currentDate = new Date(checkInDate);
    let totalPrice = 0;

    while (currentDate < new Date(checkOutDate)) {
        const dayOfWeek = currentDate.getDay();

        // 간단한 가정: 주말(금, 토)이라면 주말 가격, 그 외에는 주중 가격 적용
        if (dayOfWeek === 5 || dayOfWeek === 6) {
            totalPrice += weekendPrice;
        } else {
            totalPrice += weekdayPrice;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return accommodation.houseType === 'PRIVATE_ROOM' ? totalPrice * applicant : totalPrice;
}

module.exports = accommodationRouter;

const axios = require("axios");
const Accommodation = require('./Accommodation');

async function getFare(houseId, checkInDate, checkOutDate) {
    const house = await Accommodation.findById(houseId);

    if (!house) {
        throw new Error('숙소 정보를 찾을 수 없습니다.');
    }

    const weekdayFare = house.weekdayFare;
    const weekendFare = house.weekendFare;

    const timeDifference = checkOut.getTime() - checkIn.getTime(); // 밀리초 단위로 기간 계산

    const numberOfDays = timeDifference / (1000 * 60 * 60 * 24);

    const weekends = Math.floor((numberOfDays + checkIn.getDay()) / 7) * 2;

    const remainingDays = numberOfDays - weekends;

    const totalFare = (remainingDays * weekdayFare) + (weekends * weekendFare);

    return totalFare;
}

async function bookHouse(guestId, houseId, checkInDate, checkOutDate, person) {
    try {
        const reservationData = {
            guestId: guestId,
            houseId: houseId,
            review: null,
            dateInfo: [
                {
                    startDate: checkInDate,
                    endDate: checkOutDate
                }
            ],
            person: person,
            fare: getFare(houseId, checkInDate, checkOutDate),
        };

        const reservation = await axios.post('http://127.0.0.1:3000/reservation', reservationData);
        console.log(reservation);
    } catch(error) {
        console.error('숙소 예약 중 오류 발생', error.response ? error.response.data : error.message);
    }
}

async function cancelReserve(reserveId) {
    try {
        const cancelReservation = await axios.post('http://127.0.0.1:3000/cancelReservation', reserveId);
        console.log(cancelReservation);
    } catch(error) {
        console.error('숙소 취소 중 오류 발생', error.response ? error.response.data : error.message);
    }
}

module.exports = {bookHouse, cancelReserve}
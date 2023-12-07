const axios = require('axios');

async function bookHouse(guestId, houseId, checkInDate, checkOutDate, person) {
    try {
        const reservationData = {
            guest: guestId,
            accommodation: houseId,
            review: null,
            dateInfo: [
                {
                    startDate: checkInDate,
                    endDate: checkOutDate
                }
            ],
            person: person,
            room: 1,
            fare: 100
        };

        const reservation = await axios.post('http://127.0.0.1:3000/reservation', reservationData);
    } catch(error) {
        console.error('숙소 예약 중 오류 발생', error.response ? error.response.data : error.message);
    }
};
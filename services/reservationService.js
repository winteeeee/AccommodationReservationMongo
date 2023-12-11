const axios = require("axios");

async function bookHouse(guestId, houseId, startDate, endDate, person) {
    try {
        const reservationData = {
            guestId: guestId,
            houseId: houseId,
            review: null,
            dateInfo: [
                {
                    startDate: startDate,
                    endDate: endDate
                }
            ],
            person: person,
        };

        const reservation = await axios.post('http://127.0.0.1:3000/reservation', reservationData);
    } catch(error) {
        console.error('숙소 예약 중 오류 발생', error.response ? error.response.data : error.message);
    }
}

async function cancelReserve(reserveId) {
    try {
        await axios.post('http://127.0.0.1:3000/reservation/cancel', {reserveId: reserveId});
        console.log("숙소 취소 완료")
    } catch(error) {
        console.error('숙소 취소 중 오류 발생', error.response ? error.response.data : error.message);
    }
}

async function guestMyPage(guestId, type) {
    try {
        if (type === 'all' || type === 'oncoming' || type === 'terminated') {
            const {data} = await axios.get(`http://127.0.0.1:3000/reservation/guest/${guestId}/${type}`)
            console.log("[숙박 완료 리스트]");
            console.table(data.data)
        }
    } catch (error) {
        console.error("마이페이지 조회 중 오류 발생", error.response ? error.response.data : error.message)
    }
}

module.exports = {bookHouse, cancelReserve, guestMyPage}
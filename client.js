const axios = require("axios")
const rl = require("readline-sync")
console.log("클라이언트 실행 중")

const client = async () => {
    console.log("[검사항목 3]")
    console.log("- 체크인, 체크아웃 날짜와 인원을 입력하여 예약을 진행한다")
    const guestId = rl.question("게스트 ID : ")
    const houseId = rl.question("숙소 ID : ")
    const checkInDate = rl.question("체크인 날짜 : ")
    const checkOutDate = rl.question("체크아웃 날짜 : ")
    const person = rl.question("예약 인원 : ")
    await bookHouse(guestId, houseId, checkInDate, checkOutDate, person)
    wait()

    console.log("[검사항목 6]")
    console.log("- 게스트는 체크아웃이 완료된 숙소에 별점(1~5)와 후기를 작성할 수 있다")
    const reserveId = rl.question("예약 ID : ")
    const startRating = rl.question("별점 : ")
    const reviewContent = rl.question("후기 : ")//
    await submitReview(reserveId, startRating, reviewContent)
    wait()
}
client().then()

function wait() {
    rl.question("아무 키나 입력 : ")
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
            person: person
        };

        const reservation = await axios.post('http://127.0.0.1:3000/reservation', reservationData);
    } catch(error) {
        console.error('숙소 예약 중 오류 발생', error.response ? error.response.data : error.message);
    }
}

async function submitReview(reserveId, starRating, reviewContent){
    try {
        const response = await axios.post('http://127.0.0.1:3000/review', {
            star: starRating,
            reviewContent: reviewContent,
            reserveId: reserveId,
        });
    } catch (error) {
        console.error('리뷰 작성 중 오류 발생:', error.response ? error.response.data : error.message);
    }
}
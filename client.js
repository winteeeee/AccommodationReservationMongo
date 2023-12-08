const rl = require("readline-sync")
const {findHouse, findHouseDetail} = require("./services/accommodationService");
const {bookHouse} = require("./services/reservationService");
const {submitReview} = require("./services/reviewService");
console.log("클라이언트 실행 중")

const client = async () => {
    console.log("[검사항목 1]")
    console.log("- 체크인, 체크아웃 날짜, 신청 인원, 숙소 종류를 입력하여 숙소조회를 진행한다")
    const checkIn = rl.question("체크인 날짜 : ")
    const checkOut = rl.question("체크아웃 날짜 : ")
    const applicant = rl.question("신청 인원 : ")
    const choice = rl.question('숙소 종류를 선택하세요 (1. 개인, 2. 공간 전체): ');
    let houseType;
    if (choice === '1') {
        houseType = 'PRIVATE_ROOM';
    } else if (choice === '2') {
        houseType = 'ENTIRE_PLACE';
    } else {
        console.log('잘못된 선택입니다.');
        houseType = 'PRIVATE_ROOM';
        process.exit(1); // 프로그램 종료
    }
    await findHouse(checkIn, checkOut, applicant, houseType)
    wait()

    console.log("[검사항목 2]")
    console.log("- 숙소 id를 이용해 상세조회를 합니다")
    const accommodationId = '656b3fb5d7b5e18fd5a6d30b'
    await findHouseDetail(accommodationId)

    wait()

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

const rl = require("readline-sync")
const {findHouse, findHouseDetail} = require("./services/accommodationService");
const {bookHouse, cancelReserve} = require("./services/reservationService");
const {submitReview} = require("./services/reviewService");

const client = async () => {
    console.log("클라이언트 실행 중")
    await task1()
    await task2()
    await task3()
    await task4()
    await task5()
    await task6()
    console.log("클라이언트 실행 종료")
}
client().then()

function wait() {
    rl.question("아무 키나 입력 : ")
}

async function task1() {
    console.log("[검사항목 1]")
    console.log("- 체크인, 체크아웃 날짜, 신청 인원, 숙소 종류를 입력하여 숙소조회를 진행한다")
    const checkIn = rl.question("체크인 날짜 : ")
    const checkOut = rl.question("체크아웃 날짜 : ")
    const applicant = rl.question("신청 인원 : ")
    const houseTypeCode = rl.question('숙소 종류를 선택하세요 (1. 개인, 2. 공간 전체): ');
    const accommodations = await findHouse(checkIn, checkOut, applicant, houseTypeCode)
    console.log("================================================")
    accommodations.forEach((e) => {
        console.log(`id: ${e.id}`)
        console.log(`공간 유형: ${e.spaceType}`)
        console.log(`이름: ${e.name}`)
        console.log(`총 가격: ${e.price}`)
        console.log(`평균 별점: ${e.avgRating}`)
        console.log("================================================")
    })
    wait()
}

async function task2() {
    console.log("[검사항목 2]")
    console.log("- 숙소 id를 이용해 상세조회를 합니다")
    const houseId = rl.question("숙소 ID : ")
    await findHouseDetail(houseId)
    wait()
}

async function task3() {
    console.log("[검사항목 3]")
    console.log("- 체크인, 체크아웃 날짜와 인원을 입력하여 예약을 진행한다")
    const guestId = rl.question("게스트 ID : ")
    const houseId = rl.question("숙소 ID : ")
    const checkInDate = rl.question("체크인 날짜 : ")
    const checkOutDate = rl.question("체크아웃 날짜 : ")
    const person = rl.question("예약 인원 : ")
    await bookHouse(guestId, houseId, checkInDate, checkOutDate, person)
    wait()
}

async function task4() {
    console.log("[검사항목 4]")
    console.log("- 게스트는 예약한 숙소를 취소할 수 있다")
    const reserveId = rl.question("예약 ID : ")
    await cancelReserve(reserveId)
    wait()
}

async function task5() {
    //TODO 구현
}

async function task6() {
    console.log("[검사항목 6]")
    console.log("- 게스트는 체크아웃이 완료된 숙소에 별점(1~5)와 후기를 작성할 수 있다")
    const reserveId = rl.question("예약 ID : ")
    const startRating = rl.question("별점 : ")
    const reviewContent = rl.question("후기 : ")
    await submitReview(reserveId, startRating, reviewContent)
    wait()
}
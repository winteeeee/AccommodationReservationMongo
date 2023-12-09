const axios = require("axios");
const rl = require("readline-sync")

async function findHouse(checkinDate, checkoutDate, accommodatedPerson, houseTypeCode) {
    let houseType;
    if (houseTypeCode === '1') {
        houseType = 'PRIVATE_ROOM';
    } else if (houseTypeCode === '2') {
        houseType = 'ENTIRE_PLACE';
    } else {
        console.log('잘못된 선택입니다.');
        houseType = 'PRIVATE_ROOM';
        process.exit(1); // 프로그램 종료
    }

    try {
        const response = await axios.get('http://127.0.0.1:3000/accommodation', {
            params: {
                checkIn: checkinDate,
                checkOut: checkoutDate,
                applicant: accommodatedPerson,
                houseType: houseType  // 여기에 houseType 추가
            }
        });
        const accommodations = response.data.sortedAccommodations;

        // 각 숙소의 이름, 가격, 별점만 추출하여 새로운 배열로 만듦
        return accommodations.map(accommodation => {
            return {
                id: accommodation._id,
                spaceType: accommodation.spaceType,
                name: accommodation.name,
                price: accommodation.totalPrice,
                avgRating: accommodation.avgRating,
            };
        })
    } catch (error) {
        console.error('숙소 검색 중에 오류 발생:', error.response ? error.response.data : error.message);
    }
}
async function findHouseDetail(accommodation_id) {
    function displayCalendar(calendarData) {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const dates = Object.keys(calendarData);
        const [currentYear, currentMonth] = dates[0].split('-').map(Number);

        const monthDays = getMonthDays(currentYear, currentMonth-1);
        const firstDayOfWeek = new Date(currentYear, currentMonth-1, 1).getDay();

        console.log()
        // 달력 위에 년도와 월 출력
        console.log(`${currentYear}년 ${currentMonth}월`);
        console.log(daysOfWeek.join('\t'));

        // 출력: 첫 번째 주 전까지의 빈 칸
        for (let i = 0; i < firstDayOfWeek; i++) {
            process.stdout.write('\t');
        }
        // 출력: 각 날짜와 예약 정보
        monthDays.forEach(day => {
            const date = new Date(currentYear, currentMonth-1, day+1);
            const formattedDate = date.toISOString().split('T')[0];
            if (calendarData[formattedDate]) {
                const remainingCapacity = calendarData[formattedDate]?.remainingCapacity ?? 0;
                const formattedDay = day < 10 ? `0${day}` : day; // 한 자리 수면 앞에 0 붙이기

                process.stdout.write(`${formattedDay}(${remainingCapacity})\t`);
            } else {
                const formattedDay = day < 10 ? `0${day}` : day; // 한 자리 수면 앞에 0 붙이기
                process.stdout.write(`${formattedDay}\t`);
            }

            // 줄 바꿈
            if ((firstDayOfWeek + day) % 7 === 0) {
                console.log();
            }
        });
        console.log()
    }

    function getMonthDays(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }

    function printReviews(reviewsObject) {
        const reviews = reviewsObject.reviews;

        if (!Array.isArray(reviews) || reviews.length === 0) {
            console.log("리뷰가 없습니다.");
            return;
        }

        console.log("번호\t별점\t평가");
        reviews.forEach((review, index) => {
            console.log(`${index + 1}\t${review.star}\t${review.review}`);
        });
    }

    // 입력값이 유효한지 확인하는 함수
    function validateYear(input) {
        const currentYear = new Date().getFullYear();
        const yearRegex = /^\d{4}$/;
        const parsedYear = parseInt(input, 10);
        return yearRegex.test(input) && parsedYear >= currentYear;
    }


    function validateMonth(input) {
        const monthNumber = parseInt(input, 10);
        return !isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12;
    }

    try {
        const reservation = await axios.get(`http://127.0.0.1:3000/reservation/${accommodation_id}`);
        const review = await axios.get(`http://127.0.0.1:3000/review/${accommodation_id}`);
        printReviews(review.data)
        console.log()
        displayCalendar(reservation.data);
        while (true) {
            const year = rl.question("\n조회하고 싶은 년도 : ")
            if(validateYear(year)){
                const month = rl.question("\n조회하고 싶은 달 : ")
                if(validateMonth(month)){
                    const reservation_want = await axios.get(`http://127.0.0.1:3000/reservation/${accommodation_id}/${year}/${month}`);
                    displayCalendar(reservation_want.data)
                }else{
                    break;
                }
            }else{
                break;
            }
        }
        console.log("상세조회를 종료합니다.")


        // 이후 reservation을 처리하는 코드 추가
    } catch (error) {
        console.error('서버 요청 중 오류 발생:', error);
    }

}

module.exports = {findHouse, findHouseDetail}
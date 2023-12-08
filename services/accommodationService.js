const axios = require("axios");

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
        const result = accommodations.map(accommodation => {
            return {
                name: accommodation.name,
                price: accommodation.totalPrice,
                avgRating: accommodation.avgRating,
            };
        });


        // 여기서 response를 처리하거나 반환할 수 있습니다.
        console.log('숙소 검색 결과:', result);
    } catch (error) {
        console.error('숙소 검색 중에 오류 발생:', error.response ? error.response.data : error.message);
    }
}

async function findHouseDetail(accommodation_id) {
    function displayCalendar(calendarData) {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentYear = 2023;
        const currentMonth = 11; // 0부터 시작하는 월 (11은 12월을 나타냄)
        const monthDays = getMonthDays(currentYear, currentMonth);
        const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

        // 달력 위에 년도와 월 출력
        console.log(`${currentYear}년 ${currentMonth + 1}월`);

        // 출력: 첫 번째 주 전까지의 빈 칸
        for (let i = 0; i < firstDayOfWeek; i++) {
            process.stdout.write('\t');
        }

        // 출력: 각 날짜와 예약 정보
        monthDays.forEach(day => {
            const date = new Date(currentYear, currentMonth, day);
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


    try {
        const reservation = await axios.get(`http://127.0.0.1:3000/reservation/${accommodation_id}`);
        const review = await axios.get(`http://127.0.0.1:3000/review/${accommodation_id}`);
        printReviews(review.data)
        console.log()
        displayCalendar(reservation.data);

        // 이후 reservation을 처리하는 코드 추가
    } catch (error) {
        console.error('서버 요청 중 오류 발생:', error);
    }
}

module.exports = {findHouse, findHouseDetail}
const {Router} = require("express");
const {Reservation} = require("../models/reservation");
const {Accommodation} = require("../models/accommodation");
const {Member} = require("../models/member");
const reservationRouter = Router();

async function getFare(houseId, checkInDate, checkOutDate, applicant) {
    let accommodation = await Accommodation.findById(houseId);

    console.log(accommodation);

    const weekdayPrice = accommodation.weekdayFare || 0;  // 주중 가격
    const weekendPrice = accommodation.weekendFare || 0;  // 주말 가격

    console.log(weekdayPrice);
    console.log(weekendPrice);
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

    console.log(totalPrice);

    return accommodation.houseType === 'PRIVATE_ROOM' ? totalPrice * applicant : totalPrice;
}
reservationRouter.post("/cancel", async(req, res) => {
    try{
        const {reserveId} = req.body;
        const cancelledReservation = await Reservation.findByIdAndDelete(reserveId);
        if (!cancelledReservation) {
            return res.status(404).send({ error: '예약을 찾을 수 없습니다' });
        }
        return res.status(200).send({ message: '예약이 취소되었습니다.', cancelledReservation });
    } catch(error) {
        return res.status(400).send({error: error.message})
    } 
});

reservationRouter.post("/", async(req, res) => {
    try {
        const {guestId, houseId, review, dateInfo, person} = req.body;
        const guest = await Member.findById(guestId)
        const house = await Accommodation.findById(houseId)
        const room = house.spaceType === "ENTIRE_PLACE" ? house.room : person
        const fare =  await getFare(houseId, dateInfo[0].startDate, dateInfo[0].endDate, person);
        console.log(fare);
        const reservation = new Reservation({
            guest: guest,
            accommodation: house,
            review: review,
            dateInfo: dateInfo,
            person: person,
            room: room,
            fare: fare
        });
        
        await reservation.save();
        return res.status(200).send({reservation});
    } catch(error) {
        return res.status(400).send({error: error.message});
    }
});
reservationRouter.get("/:id", async (req, res) => {
    try {
        const accommodation_id = req.params.id;


        const currentMonthStartDate = new Date();
        currentMonthStartDate.setDate(1); // 현재 달의 1일로 설정

        const currentMonthEndDate = new Date();
        currentMonthEndDate.setMonth(currentMonthEndDate.getMonth() + 1, 0); // 현재 달의 마지막 날로 설정

        console.log(currentMonthStartDate)
        console.log(currentMonthEndDate)
        const reservations = await Reservation.find({
            accommodation: accommodation_id,
            'dateInfo.startDate': { $gte: currentMonthStartDate, $lte: currentMonthEndDate },
        }).populate('accommodation');

        const calendar={};

        reservations.forEach((reservation) => {
            const startDate = reservation.dateInfo[0].startDate;
            const endDate = reservation.dateInfo[0].endDate;
            const accommodatedPerson = reservation.person;

            // startDate부터 endDate까지 각 날짜에 대한 수용인원과 예약인원을 계산하여 캘린더에 저장
            for (
                let date = new Date(startDate);
                date <= endDate;
                date = new Date(date.getTime() + 86400000)
            ) {
                const formattedDate = date.toISOString().split('T')[0]; // 날짜만 추출
                if (!calendar[formattedDate]) {
                    calendar[formattedDate] = { reservePeople: 0 };
                }
                calendar[formattedDate].reservePeople += accommodatedPerson;
            }
        });

        for (
            let date = new Date(currentMonthStartDate);
            date <= currentMonthEndDate;
            date = new Date(date.getTime() + 86400000)
        ) {
            const formattedDate = date.toISOString().split('T')[0]; // 날짜만 추출
            if (!calendar[formattedDate]) {
                calendar[formattedDate] = { reservePeople: 0 };
            }
            calendar[formattedDate].reservePeople += 0; // 0을 더하면 예약인원 변동이 없습니다.
        }

        // 캘린더에 수용 가능한 인원 추가
        for (const date of Object.keys(calendar)) {

            const accommodation = await Accommodation.findById(accommodation_id);
            const capacity = accommodation.accommodatedPerson;
            const spaceType = accommodation.spaceType;
            const reservePeople = calendar[date]?.reservePeople || 0;

            let remainingCapacity;
            if (spaceType === 'ENTIRE_PLACE') {
                calendar[date].remainingCapacity = reservePeople === 0 ? 'O' : 'X';
            } else if (spaceType === 'PRIVATE_ROOM') {
                remainingCapacity = capacity - reservePeople;
                calendar[date].remainingCapacity = remainingCapacity;
            }
        }

        console.log(calendar);

        res.json(calendar)
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: err.message });
    }
});

reservationRouter.get("/:id/:year/:month", async (req, res) => {
    try {
        const accommodation_id = req.params.id;
        console.log(accommodation_id);
        const select_year = parseInt(req.params.year); // 선택한 연도
        console.log(select_year);
        const select_month = parseInt(req.params.month); // 선택한 월 (0부터 시작하기 때문에 -1)
        console.log(select_month);

        const currentMonthStartDate = new Date(select_year, select_month - 1);
        currentMonthStartDate.setDate(2);
        console.log(currentMonthStartDate);
        const currentMonthEndDate = new Date(select_year, select_month, 1);

        console.log(currentMonthStartDate.toISOString()); // 2023-12-01T00:00:00.000Z
        console.log(currentMonthEndDate.toISOString());

        const reservations = await Reservation.find({
            accommodation: accommodation_id,
            'dateInfo.startDate': { $gte: currentMonthStartDate, $lte: currentMonthEndDate },
        }).populate('accommodation');

        const calendar = {};

        reservations.forEach((reservation) => {
            const startDate = reservation.dateInfo[0].startDate;
            const endDate = reservation.dateInfo[0].endDate;
            const accommodatedPerson = reservation.person;

            // startDate부터 endDate까지 각 날짜에 대한 수용인원과 예약인원을 계산하여 캘린더에 저장
            for (
                let date = new Date(startDate);
                date <= endDate;
                date = new Date(date.getTime() + 86400000)
            ) {
                const formattedDate = date.toISOString().split('T')[0]; // 날짜만 추출
                if (!calendar[formattedDate]) {
                    calendar[formattedDate] = { reservePeople: 0 };
                }
                calendar[formattedDate].reservePeople += accommodatedPerson;
            }
        });

        for (
            let date = new Date(currentMonthStartDate);
            date <= currentMonthEndDate;
            date = new Date(date.getTime() + 86400000)
        ) {
            const formattedDate = date.toISOString().split('T')[0]; // 날짜만 추출
            if (!calendar[formattedDate]) {
                calendar[formattedDate] = { reservePeople: 0 };
            }
            calendar[formattedDate].reservePeople += 0; // 0을 더하면 예약인원 변동이 없습니다.
        }

        // 캘린더에 수용 가능한 인원 추가
        for (const date of Object.keys(calendar)) {

            const accommodation = await Accommodation.findById(accommodation_id);
            const capacity = accommodation.accommodatedPerson;
            const spaceType = accommodation.spaceType;
            const reservePeople = calendar[date]?.reservePeople || 0;

            let remainingCapacity;
            if (spaceType === 'ENTIRE_PLACE') {
                calendar[date].remainingCapacity = reservePeople === 0 ? 'O' : 'X';
            } else if (spaceType === 'PRIVATE_ROOM') {
                remainingCapacity = capacity - reservePeople;
                calendar[date].remainingCapacity = remainingCapacity;
            }
        }

        console.log(calendar);
        res.json(calendar);
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: err.message });
    }
});
module.exports = reservationRouter;
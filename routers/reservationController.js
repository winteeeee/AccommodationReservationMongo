const {Router} = require("express");
const {Reservation} = require("../models/reservation");
const {Accommodation} = require("../models/accommodation");
const {Member} = require("../models/member");
const reservationRouter = Router();

reservationRouter.post("/", async(req, res) => {
    try {
        const {guestId, houseId, review, dateInfo, person} = req.body;
        const guest = await Member.findOne({id: guestId})
        const house = await Accommodation.findById(houseId)
        const room = house.spaceType === "ENTIRE_PLACE" ? house.room : person
        const fare = 100
        //TODO 체크인, 체크아웃 날짜를 기반으로 fare 계산

        const reservation = new Reservation({
            guest: guest,
            accommodation: house,
            review: review,
            dateInfo: dateInfo,
            person: person,
            room: room,
            fare: fare});
        
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

        reservations.forEach(reservation => {
            const startDate = reservation.dateInfo[0].startDate;
            const endDate = reservation.dateInfo[0].endDate;
            const accommodatedPerson = reservation.person;

            // startDate부터 endDate까지 각 날짜에 대한 수용인원과 예약인원을 계산하여 캘린더에 저장
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                const formattedDate = date.toISOString().split('T')[0]; // 날짜만 추출
                if (!calendar[formattedDate]) {
                    calendar[formattedDate] = { reservePeople: 0 };
                }
                calendar[formattedDate].reservePeople += accommodatedPerson;
            }
        });

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // 월은 0부터 시작하므로 현재 월을 가져오기 위해선 1을 더해야 합니다.

        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 1);


        for (let date = new Date(startOfMonth); date <= endOfMonth; date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().split('T')[0]; // 날짜만 추출
            if (!calendar[formattedDate]) {
                calendar[formattedDate] = { reservePeople: 0 };
            }
            calendar[formattedDate].reservePeople += 0; // 0을 더하면 예약인원 변동이 없습니다.

        }

        // 캘린더에 수용 가능한 인원 추가
        Object.keys(calendar).forEach(date => {
            const capacity = reservations[0].accommodation.accommodatedPerson;
            const reservePeople = calendar[date]?.reservePeople || 0;

            if (reservations.length > 0) {
                const spaceType = reservations[0].accommodation.spaceType;

                let remainingCapacity;
                if (spaceType === 'ENTIRE_PLACE') {
                    calendar[date].remainingCapacity = reservePeople === 0 ? 'O' : 'X';


                } else if (spaceType === 'PRIVATE_ROOM') {
                    remainingCapacity = capacity - reservePeople;
                    calendar[date].remainingCapacity = remainingCapacity;
                }
            } else {
                if (spaceType === 'ENTIRE_PLACE') {
                    calendar[date].remainingCapacity = 'O'; // 만약 예약이 없는 경우
                } else if (spaceType === 'PRIVATE_ROOM') {
                    remainingCapacity = capacity - reservePeople;
                    calendar[date].remainingCapacity = remainingCapacity; // 만약 예약이 없는 경우

                }
            }
        });

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
        console.log(accommodation_id)
        const select_year = parseInt(req.params.year); // 선택한 연도
        console.log(select_year)
        const select_month = parseInt(req.params.month); // 선택한 월 (0부터 시작하기 때문에 -1)
        console.log(select_month)

        const currentMonthStartDate = new Date(select_year, select_month-1);
        currentMonthStartDate.setDate(2);
        const currentMonthEndDate = new Date(select_year, select_month, 1);

        console.log(currentMonthStartDate.toISOString());  // 2023-12-01T00:00:00.000Z
        console.log(currentMonthEndDate.toISOString());

        const reservations = await Reservation.find({
            accommodation: accommodation_id,
            'dateInfo.startDate': { $gte: currentMonthStartDate, $lte: currentMonthEndDate },
        }).populate('accommodation');

        const calendar={};

        reservations.forEach(reservation => {
            const startDate = reservation.dateInfo[0].startDate;
            const endDate = reservation.dateInfo[0].endDate;
            const accommodatedPerson = reservation.person;

            // startDate부터 endDate까지 각 날짜에 대한 수용인원과 예약인원을 계산하여 캘린더에 저장
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                const formattedDate = date.toISOString().split('T')[0]; // 날짜만 추출
                if (!calendar[formattedDate]) {
                    calendar[formattedDate] = { reservePeople: 0 };
                }
                calendar[formattedDate].reservePeople += accommodatedPerson;
            }
        });

        for (let date = new Date(currentMonthStartDate); date <= currentMonthEndDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().split('T')[0]; // 날짜만 추출
            if (!calendar[formattedDate]) {
                calendar[formattedDate] = { reservePeople: 0 };
            }
            calendar[formattedDate].reservePeople += 0; // 0을 더하면 예약인원 변동이 없습니다.

        }

        // 캘린더에 수용 가능한 인원 추가
        Object.keys(calendar).forEach(date => {
            const accommodation = Accommodation.findById(accommodation_id);
            const capacity = accommodation.accommodatedPerson;
            const spaceType = accommodation.spaceType;

            const reservePeople = calendar[date]?.reservePeople || 0;

            if (reservations.length > 0) {
                let remainingCapacity;
                if (spaceType === 'ENTIRE_PLACE') {
                    calendar[date].remainingCapacity = reservePeople === 0 ? 'O' : 'X';

                } else if (spaceType === 'PRIVATE_ROOM') {
                    remainingCapacity = capacity - reservePeople;
                    calendar[date].remainingCapacity = remainingCapacity;
                }
            } else {
                if (spaceType === 'ENTIRE_PLACE') {
                    calendar[date].remainingCapacity = 'O'; // 만약 예약이 없는 경우
                } else if (spaceType === 'PRIVATE_ROOM') {
                    remainingCapacity = capacity - reservePeople;
                    calendar[date].remainingCapacity = remainingCapacity; // 만약 예약이 없는 경우

                }
            }
        });

        console.log(calendar);
        res.json(calendar)
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: err.message });
    }
});
module.exports = reservationRouter;
const faker = require("faker")
const {Member, Accommodation, BasicAmenities, TopAmenitiesGuestsSearchFor, SafetyAmenities, AccessibilityAmenities, Reservation, Review, DateInfo} = require("./models");
const mongoose = require("mongoose").default
const fs = require('fs')

generateDummyData = async () => {
    const members = []
    const accommodations = []
    const reservations = []
    const reviews = []
    const db = mongoose.connection.db

    console.log("모든 컬렉션들을 삭제합니다")
    const collections = await db.listCollections().toArray()
    collections.map((collection) => collection.name).forEach(async (collectionName) => {
        await db.dropCollection(collectionName)
    })

    console.log("더미 데이터를 생성합니다")
    console.log("멤버 더미 데이터 생성")
    for (let i = 0; i < 10; i++) {
        members.push(new Member({
            id: faker.internet.userName() + parseInt(Math.random() * 100),
            password: faker.lorem.words(),
            name: faker.internet.userName()
        }))
    }

    console.log("숙소/예약/리뷰 더미 데이터 생성")
    fs.readFile('accommodationNames', 'utf8', (err, data) => {
        const names = data.split('\n')
        names.forEach((name, idx) => {
            const basicAmenities = new BasicAmenities({
                toiletPaper: Math.random() < 0.5,
                soapForHandsAndBody: Math.random() < 0.5,
                oneTowelPerGuest: Math.random() < 0.5,
                linensForEachBed: Math.random() < 0.5,
                onePillowPerGuest: Math.random() < 0.5,
                cleaningSupplies: Math.random() < 0.5
            })

            const topAmenitiesGuestsSearchFor = new TopAmenitiesGuestsSearchFor({
                pool: Math.random() < 0.5,
                wifi: Math.random() < 0.5,
                kitchen: Math.random() < 0.5,
                freeParking: Math.random() < 0.5,
                jacuzzi: Math.random() < 0.5,
                washerOfDryer: Math.random() < 0.5,
                airConditioningOrHeating: Math.random() < 0.5,
                selfCheckIn: Math.random() < 0.5,
                laptopFriendlyWorkspace: Math.random() < 0.5,
                petsAllowed: Math.random() < 0.5
            })

            const safetyAmenities = new SafetyAmenities({
                carbonMonoxideAlarm: Math.random() < 0.5,
                smokeAlarm: Math.random() < 0.5,
                fireExtinguisher: Math.random() < 0.5,
                firstAidKit: Math.random() < 0.5,
                emergencyPlanAndLocalNumbers: Math.random() < 0.5
            })

            const accessibilityAmenities = new AccessibilityAmenities({
                stepFreeEntryway: Math.random() < 0.5,
                wideEntrances: Math.random() < 0.5,
                wideHallways: Math.random() < 0.5,
                accessibleBathroom: Math.random() < 0.5
            })

            let spaceType = idx < 5 ? 'ENTIRE_PLACE' : 'PRIVATE_ROOM'
            accommodations.push(new Accommodation({
                spaceType: spaceType,
                name: name,
                address: faker.address.cityName(),
                accommodatedPerson: Math.floor(Math.random() * 20),
                room: Math.floor(Math.random() * 20),
                bedroom: Math.floor(Math.random() * 20),
                bed: Math.floor(Math.random() * 20),
                bathroom: Math.floor(Math.random() * 20),
                introduction: faker.lorem.paragraph(),
                weekdayFare: parseInt(Math.random() * 100000),
                weekendFare: parseInt(Math.random() * 1000000),
                basicAmenities: basicAmenities,
                topAmenitiesGuestsSearchFor: topAmenitiesGuestsSearchFor,
                safetyAmenities: safetyAmenities,
                accessibilityAmenities: accessibilityAmenities
            }))

            for (let i = 0; i < 2; i++) {
                reviews.push(new Review({
                    star: Math.floor(Math.random() * 5) + 1,
                    review: faker.lorem.paragraph()
                }))
            }

            const dateInfos = [
                new DateInfo({startDate: new Date(2023, 10, 2), endDate: new Date(2023, 10, 4)}),
                new DateInfo({startDate: new Date(2023, 10, 12), endDate: new Date(2023, 10, 17)}),
                new DateInfo({startDate: new Date(2023, 11, 12), endDate: new Date(2023, 11, 17)}),
                new DateInfo({startDate: new Date(2024, 0, 12), endDate: new Date(2024, 0, 17)})
            ]
            const fares = [
                {weekdayCount: 3, weekendCount: 0},
                {weekdayCount: 4, weekendCount: 2},
                {weekdayCount: 5, weekendCount: 1},
                {weekdayCount: 4, weekendCount: 2}
            ]

            for (let i = 0; i < 4; i++) {
                if (i < 2) {
                    reservations.push(new Reservation({
                        guest: members[parseInt(Math.random() * 10)],
                        accommodation: accommodations[idx],
                        review: reviews[i],
                        dateInfo: dateInfos[i],
                        person: Math.floor(Math.random() * accommodations[idx].accommodatedPerson) + 1,
                        room: Math.floor(Math.random() * accommodations[idx].room) + 1,
                        fare: accommodations[idx].weekdayFare * fares[i].weekdayCount + accommodations[idx].weekendFare * fares[i].weekendCount
                    }))
                } else {
                    reservations.push(new Reservation({
                        guest: members[parseInt(Math.random() * 10)],
                        accommodation: accommodations[idx],
                        review: null,
                        dateInfo: dateInfos[i],
                        person: Math.floor(Math.random() * accommodations[idx].accommodatedPerson) + 1,
                        room: Math.floor(Math.random() * accommodations[idx].room) + 1,
                        fare: accommodations[idx].weekdayFare * fares[i].weekdayCount + accommodations[idx].weekendFare * fares[i].weekendCount
                    }))
                }
            }
        })
    })

    console.log("더미 데이터 삽입")
    await Member.insertMany(members)
    await Accommodation.insertMany(accommodations)
    await Reservation.insertMany(reservations)
}

module.exports = {generateDummyData}
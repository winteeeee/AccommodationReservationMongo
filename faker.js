const faker = require("faker")
const {Member} = require("./models/member");
const mongoose = require("mongoose").default

generateDummyData = async (memberNum, accommodationNum, reservationAndReviewNum) => {
    const members = []
    const accommodations = []
    const reservations = []
    const reviews = []
    const db = mongoose.connection.db

    console.log("모든 컬렉션들을 삭제합니다")
    const collections = await db.listCollections().toArray()
    collections.map((collection) => collection.name).forEach(async (collectionName) => {
        db.dropCollection(collectionName)
    })

    console.log("더미 데이터를 생성합니다")
    console.log("멤버 더미 데이터 생성")
    for (let i = 0; i < memberNum; i++) {
        members.push(new Member({
            id: faker.internet.userName() + parseInt(Math.random() * 100),
            password: faker.lorem.words(),
            name: faker.internet.userName()
        }))
    }

    //TODO 숙소 더미 데이터 생성(이름은 파일 IO를 이용)
    //TODO 예약 및 리뷰 더미 데이터 생성

    console.log("더미 데이터 삽입")
    await Member.insertMany(members)
}

module.exports = {generateDummyData}
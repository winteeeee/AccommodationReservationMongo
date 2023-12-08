const express = require("express");
const {generateDummyData} = require("./faker");
const app = express()
const mongoose = require("mongoose").default
const reviewController = require("./routers/reviewController");
const reservationController = require("./routers/reservationController")
const accommodationController = require("./routers/accommodationController")
/*
참고) WebStorm에서 mongoose 관련 메소드들 자동완성을 사용하려면 require 뒤에 default 붙이거나 typescript 사용해야함
mongoose가 typescript로 만들어져 있기 때문에 default 없이 require로 들고오면 메소드들을 못찾음
*/
const hostname = "127.0.0.1";
const port = 3000;
const DB_URI = "mongodb://127.0.0.1:27017/accommodation_reservation_mongo";

const server = async () => {
    try {
        await mongoose.connect(DB_URI)
        //await generateDummyData()
        app.use(express.json())
        app.use("/review", reviewController);
        app.use("/accommodation", accommodationController)
        app.use("/reservation", reservationController);
        app.listen(port, hostname, function () {
            console.log(`서버 http://${hostname}:${port}/ 에서 실행 중`)
        })
    } catch (err) {
        console.log(err)
    }
}

server().then()
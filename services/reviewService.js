const axios = require("axios");

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

module.exports = {submitReview}
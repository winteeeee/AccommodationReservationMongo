const axios = require('axios');

async function submitReview() {
    const starRating = 4;
    const reviewContent = '좋은 경험이었습니다. 깨끗하고 편안한 숙소였어요.';
    const reserveId = '6570b1cf93657085eca2094b';

    try {
        const response = await axios.post('http://127.0.0.1:3000/review', {
            star: starRating,
            reviewContent: reviewContent,
            reserveId: reserveId,
        });

        console.log('리뷰가 성공적으로 작성되었습니다:', response.data.review);
    } catch (error) {
        console.error('리뷰 작성 중 오류 발생:', error.response ? error.response.data : error.message);
    }
}

// 리뷰 작성 함수 호출
submitReview();
const getNewsList = async (order_by, page, page_size) => {
    // fetch('http://localhost:5000/api/news')
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    // })
    // .catch(error => {})

    if(order_by !== 'hot' || order_by !== 'recent') {
        throw new Error('Invalid order_by value');
    }

    if(order_by === 'hot' && page === 1 && page_size === 10) {
        return {
            data: [
                {
                    id: 1,
                    title: '뉴스 제목',
                    brief: '뉴스 요약',
                    imageURL: 'https://via.placeholder.com/150',
                    likes: 10,
                    dislikes: 2,
                },
                {
                    id: 2,
                    title: '뉴스 제목',
                    brief: '뉴스 요약',
                    imageURL: 'https://via.placeholder.com/150',
                }
            ]
        }
    }
}


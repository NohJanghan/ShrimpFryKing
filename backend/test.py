from db.entity import NewsItem
from routers.dto.news_dto import NewsItemDetail

def to_news_item_detail(news_item: NewsItem) -> NewsItemDetail:
    return NewsItemDetail(
        id=news_item.news_id,
        title=news_item.title,
        brief=news_item.brief,
        content=news_item.content,
        imageURL=news_item.image_url,
        likes=news_item.like,
        dislikes=news_item.dislike
    )

# NewsItem 클래스의 예시 인스턴스 생성
news_item = NewsItem()
news_item.news_id = 1
news_item.title = "새우튀김의 비밀"
news_item.content = "바삭하고 맛있는 새우튀김을 만드는 황금 레시피를 공개합니다..."
news_item.url = "https://example.com/news/1"
news_item.image_url = "https://example.com/images/shrimp.jpg"
news_item.category = "요리"
news_item.brief = "완벽한 새우튀김 레시피 대공개"
news_item.author_id = "chef123"
news_item.date = 1716309600  # 2024년 5월 18일을 Unix timestamp로 표현
news_item.like = 150
news_item.dislike = 5
news_item.opinion = 1  # 긍정적 의견
news_item.comment = []  # 빈 댓글 리스트로 시작
news_item.Isliked = False
news_item.Isdisliked = False

m = NewsItemDetail.model_validate(to_news_item_detail(news_item))
print(m)
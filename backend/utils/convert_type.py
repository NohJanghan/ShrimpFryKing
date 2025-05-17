
from backend.db.entity import NewsItem
from backend.routers.dto.news_dto import NewsItemDetail

def news_to_detail(news_item: NewsItem) -> NewsItemDetail:
    return NewsItemDetail(
        id=news_item.news_id,
        title=news_item.title,
        brief=news_item.brief,
        content=news_item.content,
        imageURL=news_item.image_url,
        likes=news_item.like,
        dislikes=news_item.dislike
    )
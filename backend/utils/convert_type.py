from db.entity import NewsItem
from routers.dto import news_dto

def news_to_detail(news_item: NewsItem) -> news_dto.NewsItemDetail:
    return news_dto.NewsItemDetail(
        news_id=news_item.news_id,
        title=news_item.title,
        content=news_item.content,
        url=news_item.url,
        image_url=news_item.image_url,
        category=news_item.category,
        brief=news_item.brief,
        author_id=news_item.author_id,
        date=news_item.date,
        like=news_item.like,
        dislike=news_item.dislike,
        opinion=news_item.opinion,
        comment=news_dto.CommentItem.model_valiate(news_item.comment),
        Isliked=news_item.Isliked,
        Isdisliked=news_item.Isdisliked
    )



def news_to_brief(news_item: NewsItem) -> news_dto.NewsItemBrief:
    return news_dto.NewsItemBrief(
        id=news_item.news_id,
        title=news_item.title,
        brief=news_item.brief,
        imageURL=news_item.image_url,
        likes=news_item.like,
        dislikes=news_item.dislike
    )
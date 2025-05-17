from backend.db.entity import CreateCommentItem
from db.DBservice import db
from routers.dto import comment_dto
from fastapi import HTTPException
from news_service.get_news_by_id import get_news_by_id
from categorizer.gemini_classifier import classify_opinion

async def post_comment(news_id: int, comment: comment_dto.PostCommentRequest):
  try:
    data = CreateCommentItem()
    data.content = comment.content
    data.news_id = news_id
    data.author_id = int(comment.author_id)
    data.parent_id = None

    news_item = get_news_by_id(news_id)
    text = {
       "brief": news_item.brief,
       "comment": data.content
    }

    data.posneg = classify_opinion(text)

    db.create_comment(data, user_id=comment.author_id)
    return True
  
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
from db.entity import CreateCommentItem
from db.DBservice import db
from routers.dto import comment_dto
from fastapi import HTTPException
from services.news_service.get_news_by_id import get_news_by_id
from categorizer.gemini_classifier import classify_opinion
from categorizer.gemini_classifier import classify_content_risk

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

    data.posneg = await classify_opinion(text)
    risk = await check_risky(data.content)
    
    if risk == "High Risk":
      raise HTTPException(status_code=400, detail="Comment contains risky content")

    db.create_comment(data, user_id=comment.author_id)
    return True

  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
  
async def check_risky(text: str) -> str:
  try:
    risk = await classify_content_risk(text)
    if risk in ["High Risk", "Low Risk"]:
      return risk
    else:
      return "Low Risk"
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
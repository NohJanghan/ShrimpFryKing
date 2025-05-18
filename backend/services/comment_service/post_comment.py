from db.entity import CreateCommentItem
from db.DBservice import db
from routers.dto import comment_dto
from fastapi import HTTPException
from services.news_service.get_news_by_id import get_news_by_id
from categorizer.gemini_classifier import classify_opinion
from categorizer.gemini_classifier import classify_content_risk

async def post_comment(news_id: int, content: str, user_id: str) -> bool:
  try:
    if user_id is "":
      # guest
      return False
    data = CreateCommentItem()
    data.content = content
    data.news_id = news_id
    data.author_id = user_id
    data.parent_id = None

    print(1111)

    news_item = await get_news_by_id(news_id, user_id)

    print(1111)

    text = {
       "brief": news_item.brief,
       "comment": data.content
    }

    data.posneg = await classify_opinion(text)
    #risk = await check_risky(data.content)

    #if risk == "High Risk":
    #  return False

    db.create_comment(data, user_id)
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
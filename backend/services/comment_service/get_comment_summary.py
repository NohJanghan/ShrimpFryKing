from fastapi import HTTPException
from db.DBservice import db
from summarizer.gemini_summary import summarize_comment


async def get_comment_summary(news_id: int, user_id: str) -> str:
  try:
    news_item = db.get_news_by_id(news_id, user_id)
    text = news_item.comment

    text = await summarize_comment(text)

    return text

  except Exception as e:
        print(f"[ERROR] Failed to get news by ID: {e}")
        if str(e) == "News not found":
            raise HTTPException(status_code=404, detail="News item not found")
        raise HTTPException(status_code=500, detail=str(e))
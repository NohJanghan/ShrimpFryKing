from fastapi import HTTPException
from utils.convert_type import news_to_detail
from db.DBservice import db

async def get_news_by_id(news_id: int, user_id: str):
    try:
        news_item = db.get_news_by_id(news_id, user_id=user_id)
        news_item = news_to_detail(news_item)
        print(news_item)

        return news_item

    except Exception as e:
        print(f"[ERROR] Failed to get news by ID: {e}")
        if str(e) == "News not found":
            raise HTTPException(status_code=404, detail="News item not found")
        raise HTTPException(status_code=500, detail=str(e))
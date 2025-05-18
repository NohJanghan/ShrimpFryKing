from fastapi import HTTPException
from typing import Literal
from db.DBservice import db

async def like_news(news_id: int, user_id: str) -> bool:
    try:
        if user_id is "":
            # guest works not
            return False
        # Check if the news item exists
        news_item = db.get_news_by_id(news_id, user_id=user_id)
        if not news_item:
            raise HTTPException(status_code=404, detail="News item not found")

        # Update the like status
        db.update_news(news_item.news_id, 1, None, user_id=user_id)
        return True
    
    except Exception as e:
        print(f"[ERROR] Failed to like news: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def dislike_news(news_id: int, user_id: str) -> bool:
    try:
        if user_id is "":
            # guest works not
            return False
        # Check if the news item exists
        news_item = db.get_news_by_id(news_id, user_id=user_id)
        if not news_item:
            raise HTTPException(status_code=404, detail="News item not found")

        # Update the dislike status
        db.update_news(news_item.news_id, None, 1, user_id=user_id)
        return True

    except Exception as e:
        print(f"[ERROR] Failed to dislike news: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def remove_like_news(news_id: int, user_id: str) -> bool:
    try:
        if user_id is "":
            # guest works not
            return False
        # Check if the news item exists
        news_item = db.get_news_by_id(news_id, user_id=user_id)
        if not news_item:
            raise HTTPException(status_code=404, detail="News item not found")

        # Update the like status
        db.update_news(news_item.news_id, -1, None, user_id=user_id)
        return True

    except Exception as e:
        print(f"[ERROR] Failed to remove like from news: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def remove_dislike_news(news_id: int, user_id: str) -> bool:
    try:
        if user_id is "":
            # guest works not
            return False
        # Check if the news item exists
        news_item = db.get_news_by_id(news_id, user_id=user_id)
        if not news_item:
            raise HTTPException(status_code=404, detail="News item not found")

        # Update the dislike status
        db.update_news(news_item.news_id, None, -1, user_id=user_id)
        return True

    except Exception as e:
        print(f"[ERROR] Failed to remove dislike from news: {e}")
        raise HTTPException(status_code=500, detail=str(e))

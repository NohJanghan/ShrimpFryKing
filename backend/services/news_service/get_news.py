from fastapi import HTTPException
from utils.convert_type import news_to_brief
from typing import Literal
from db.DBservice import db


async def get_news(
        order_by: Literal['recent', 'hot'],
        user_id: str,
        page: int = 1,
        page_size: int = 10
):
    try:
        news_items = db.get_news_list(order_by, page, page_size, user_id=user_id)
        news_items = list(map(lambda item: news_to_brief(item), news_items))

        return news_items

    except Exception as e:
        print(f"[Error] Failed to get news list: {e}")
        raise HTTPException(status_code=500, detail=str(e))
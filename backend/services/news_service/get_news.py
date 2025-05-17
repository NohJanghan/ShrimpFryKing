from fastapi import HTTPException
from backend.utils.convert_type import news_to_detail
from routers.dto import news_dto
from typing import Literal
from crawling.article_extractor import extract_articles_from_url
from categorizer.article_classifier import classify_article
from summarizer.gemini_summary import summarize_article
from db.DBservice import db
from db.entity import CreateNewsItem
from utils.article import get_first_image_url


async def get_news(
        order_by: Literal['recent', 'hot'],
        page: int = 1,
        page_size: int = 10
):
    try:
        news_items = db.get_news_list(order_by, page, page_size)
        news_items = list(map(lambda item: news_to_detail(item), news_items))

        return news_items

    except Exception as e:
        print(f"[Error] Failed to get news list: {e}")
        raise HTTPException(status_code=500, detail=str(e))
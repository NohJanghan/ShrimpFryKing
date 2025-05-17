from fastapi import HTTPException
from routers.dto import news_dto
from crawling.article_extractor import extract_articles_from_url
from categorizer.article_classifier import classify_article
from summarizer.gemini_summary import summarize_article
from db.DBservice import db
from db.entity import CreateNewsItem
from utils.article import get_first_image_url

async def get_news_by_id(news_id: int):
    try:
        news_item = db.get_news_by_id(news_id)

        return news_dto.NewsItemDetail.from_orm(news_item)

    except Exception as e:
        print(f"[ERROR] Failed to get news by ID: {e}")
        if str(e) == "News not found":
            raise HTTPException(status_code=404, detail="News item not found")
        raise HTTPException(status_code=500, detail=str(e))
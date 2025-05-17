import os
from fastapi import HTTPException
from routers.dto import news_dto
from crawling.article_extractor import extract_articles_from_url
from categorizer.gemini_classifier import classify_article
from summarizer.gemini_summary import summarize_article
from db.DBservice import db
from db.entity import CreateNewsItem
from utils.article import get_first_image_url

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

async def create_news(news_url: str, author_id: str = '0'):
    try:
        article = extract_articles_from_url(news_url)
        print(f"[INFO] Extracted article - article: {article}")
        content = article["content"]
        title = article["title"]
        if not article or len(content.strip()) == 0:
            raise HTTPException(status_code=400, detail="Failed to extract article content from the given URL.")

        category = await classify_article(content)
        image_url = get_first_image_url(content)
        brief = await summarize_article(content)

        print(f"[INFO] Analysis complete - Category: {category}")
        # Insert in DB
        data = CreateNewsItem(
            title=title,
            content=content,
            url=news_url,
            image_url=image_url,
            category=category,
            brief=brief,
            author_id=author_id,  # 실제 author_id 사용
        )
        # print(f"[INFO] Inserting news into DB - Title: {title}, URL: {news_url}")
        db.create_news(data)
        return True

    except Exception as e:
        print(f"[ERROR] Failed to process news: {e}")
        raise HTTPException(status_code=500, detail=str(e))
from fastapi import APIRouter, Query, HTTPException
from routers.dto import news_dto
from crawling.article_extractor import extract_articles_from_url
from categorizer.article_classifier import classify_article
from summarizer.gemini_summary import summarize_article

router = APIRouter(prefix="/news", tags=["news"])

@router.post("/", response_model=bool)
async def create_news(news_url: str):
    try:
        article_md = extract_articles_from_url(news_url)
        if not article_md or len(article_md.strip()) == 0:
            raise HTTPException(status_code=400, detail="Failed to extract article content from the given URL.")
        
        category = classify_article(article_md)
        
        print(f"[INFO] Analysis complete - Category: {category}")
        return True

    except Exception as e:
        print(f"[ERROR] Failed to process news: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the news article.")
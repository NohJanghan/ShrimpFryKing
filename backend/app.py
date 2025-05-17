from dotenv import load_dotenv

load_dotenv()

from crawling.article_extractor import extract_articles_from_url
from summarizer.gemini_summary import summarize_article
from categorizer.article_classifier import classify_article

url = 'https://n.news.naver.com/article/584/0000032393?cds=news_media_pc&type=editn'

articles = extract_articles_from_url(url)

category = classify_article(articles)
summary = summarize_article(articles)

print(category)
print(summary)
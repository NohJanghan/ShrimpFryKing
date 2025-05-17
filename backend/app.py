from dotenv import load_dotenv

load_dotenv()

from crawling.article_extractor import extract_articles_from_url
from summarizer.gemini_summary import summarize_article, summarize_comment

url = 'https://n.news.naver.com/article/584/0000032393?cds=news_media_pc&type=editn'

articles = extract_articles_from_url(url)

summary = summarize_article(articles)

print(summary)

text = ["정말 공감됩니다. 기업내에서 솔루션을 도입하는 입장에서는 새로운 기술이 좋아보이면 그 부분만 집중하게 되기 쉬운데, 실제로는 익숙한 업무 방식을 바꾸는데 따르는 어려움이나 적응 시간도 함께 고민해야 한다는 점에서 정말 와닿는 글입니다.",
        "제품의 마케팅 타깃을 \"...그리고 지금 당장 필요한 사람\"으로 좁히는 것이 핵심 항상 공통적으로 짚고 넘어가는 부분이 뾰족하게 하라는 것 같아요.", "좋은 글 잘 읽었습니다. 깊이 공감되네요. 하나의 서비스가 성공하거나 실패하는 데에는 정말 다양한 이유가 있는 것 같습니다."]

print(summarize_comment(text))
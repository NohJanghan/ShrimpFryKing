import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

def extract_articles_from_url(url):
  try:
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, 'html.parser')
    articles = soup.find_all('article')
    
    articles = '\n\n'.join(article.prettify() for article in articles)
    articles = articles.replace("data-src", "src")

    return md(articles)
  
  except requests.exceptions.RequestException as e:
    print(f"[ERROR] Request failed: {e}")
    return md('')
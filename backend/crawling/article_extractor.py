import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

def extract_articles_from_url(url):
  try:
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, 'html.parser')
    
    og_title = soup.find("meta", property="og:title")
    if og_title and og_title.get("content"):
      title = og_title["content"].strip()
    else:
      title_tag = soup.find("title")
      title = title_tag.get_text(strip=True) if title_tag else "No Title Found"
    
    articles = soup.find_all('article')
    
    articles = '\n\n'.join(article.prettify() for article in articles)
    articles = articles.replace("data-src", "src")

    return {
      'title': title,
      'content': md(articles)
      }
  
  except requests.exceptions.RequestException as e:
    print(f"[ERROR] Request failed: {e}")
    return md('')
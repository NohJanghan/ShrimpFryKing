import google.generativeai as genai
import os

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

def classify_article(text):
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""
    You are a news classifier. Given the article below, classify it into one of the following categories:

    [Politics, Economy, Society, International, Sports, Entertainment, Science]

    Article:
    {text}

    Respond with only the category name.
    """
    response = model.generate_content(prompt)
    return response.text.strip()

def classify_opinion(text: dict) -> str:
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""
    You are given a brief summary of a news article and a user's comment.
    Determine whether the comment agrees or disagrees with the news article's content.

    Only respond with one of the following:
    +1 - if the comment agrees with the article
    -1 - if the comment disagrees with the article

    News Summary (brief):
    "{text['brief']}"

    User Comment:
    "{text['comment']}"
    """
    response = model.generate_content(prompt)
    return response.text.strip()
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
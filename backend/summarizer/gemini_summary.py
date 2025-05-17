import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

def summarize_article(text):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"""
    Summarize the following news article in 3 sentences in Korean:
    {text}
    """
    response = model.generate_content(prompt)
    return response.text.strip()
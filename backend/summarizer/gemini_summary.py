import google.generativeai as genai
import os

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

async def summarize_article(text):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"""
    Summarize the following news article in 3 sentences in Korean:
    {text}
    """
    response = await model.generate_content_async(prompt)
    return response.text.strip()

async def summarize_comment(text: list[str]) -> str:
    model = genai.GenerativeModel('gemini-1.5-flash')

    comment_block = "\n".join(text)
    comment_len = min(3, len(text))

    prompt = f"""
    Below are user comments on a news article.

    Please analyze the comments and extract the **{comment_len} most commonly discussed key points**.
    Write your answer in Korean, using the format below:

    1. ...
    2. ...
    3. ...

    Comments:
    {comment_block}

    """
    response = await model.generate_content_async(prompt)
    return response.text.strip()
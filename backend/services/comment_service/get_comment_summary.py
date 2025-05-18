from fastapi import HTTPException
from db.DBservice import db
from summarizer.gemini_summary import summarize_comment


async def get_comment_summary(news_id: int, user_id: str) -> str:
  try:
    news_item = db.get_news_by_id(news_id, user_id)
    text = news_item.comment

    positive_comments = []
    negative_comments = []
    for comment in text:
        if comment.posneg == 1:
            positive_comments.append(comment)
        elif comment.posneg == -1:
            negative_comments.append(comment)
        else:
            print(f"[ERROR] Invalid comment sentiment: {comment}")
            continue

    positive_summary_task = summarize_comment(positive_comments)
    negative_summary_task = summarize_comment(negative_comments)
    await positive_summary_task
    await negative_summary_task

    return {
        "positive_summary": positive_summary_task,
        "negative_summary": negative_summary_task
    }

  except Exception as e:
        print(f"[ERROR] Failed to get news by ID: {e}")
        if str(e) == "News not found":
            raise HTTPException(status_code=404, detail="News item not found")
        raise HTTPException(status_code=500, detail=str(e))
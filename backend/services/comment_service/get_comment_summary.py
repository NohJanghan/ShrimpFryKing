from fastapi import HTTPException
from routers.dto.comment_dto import CommentSummary
from db.DBservice import db
from summarizer.gemini_summary import summarize_comment


async def get_comment_summary(news_id: int, user_id: str) -> str:
  try:
    news_item = db.get_news_by_id(news_id, user_id)
    text = news_item.comment

    positive_comments = []
    summarized_negative_comment = []
    for comment in text:
        if comment.posneg == 1:
            positive_comments.append(comment.content)
        elif comment.posneg == -1:
            summarized_negative_comment.append(comment.content)
        else:
            print(f"[ERROR] Invalid comment sentiment: {comment}")
            continue

    positive_summary_task = summarize_comment(positive_comments)
    negative_summary_task = summarize_comment(summarized_negative_comment)
    summarized_positive_comment = await positive_summary_task
    summarized_negative_comment = await negative_summary_task

    return CommentSummary(
        summarized_positive_comment=summarized_positive_comment,
        summarized_negative_comment=summarized_negative_comment
    )
  except Exception as e:
        print(f"[ERROR] Failed to get news by ID: {e}")
        if str(e) == "News not found":
            raise HTTPException(status_code=404, detail="News item not found")
        raise HTTPException(status_code=500, detail=str(e))
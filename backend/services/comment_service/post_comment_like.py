from fastapi import HTTPException
from db.DBservice import db

async def post_comment_like(news_id, comment_item):
  try:
    if comment_item.Isliked:
      comment_item.like -= 1
      new_state = False
    else:
      comment_item.like += 1
      new_state = True

    db.update_comment(news_id, comment_item.comment_index, likes = comment_item.like)
    return new_state

  except Exception as e:
        print(f"[ERROR] Failed to get news by ID: {e}")
        if str(e) == "News not found":
            raise HTTPException(status_code=404, detail="News item not found")
        raise HTTPException(status_code=500, detail=str(e))
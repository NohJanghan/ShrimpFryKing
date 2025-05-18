from fastapi import HTTPException
from db.DBservice import db

async def post_comment_like(news_id, comment_i, user_id):
  try:
    if user_id is "":
      # guest
      False
    news_item = db.get_news_by_id(news_id, user_id=user_id)
    comment_item = news_item.comment[comment_i]

    if comment_item is None:
      raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment_item.Isliked:
      return False
    else:
      db.update_comment(news_id=news_id, comment_index=comment_i, likes = 1, user_id=user_id)
      return True

  except Exception as e:
        print(f"[ERROR] Failed to get news by ID: {e}")
        if str(e) == "News not found":
            raise HTTPException(status_code=404, detail="News item not found")
        raise HTTPException(status_code=500, detail=str(e))

async def delete_comment_like(news_id, comment_i, user_id):
  try:
    if user_id is "":
      # guest
      False
    news_item = db.get_news_by_id(news_id, user_id=user_id)
    comment_item = news_item.comment[comment_i]

    if comment_item is None:
      raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment_item.Isliked:
      db.update_comment(news_id, comment_i, likes = -1, user_id=user_id)
      return True
    else:
      return False

  except Exception as e:
        print(f"[ERROR] Failed to get news by ID: {e}")
        if str(e) == "News not found":
            raise HTTPException(status_code=404, detail="News item not found")
        raise HTTPException(status_code=500, detail=str(e))
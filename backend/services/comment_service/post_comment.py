from backend.db.entity import CreateCommentItem
from db.DBservice import db
from routers.dto import comment_dto
from fastapi import HTTPException

async def post_comment(news_id: int, comment: comment_dto.PostCommentRequest):
  try:
    data = CreateCommentItem()
    data.content = comment.content
    data.news_id = news_id
    data.author_id = int(comment.author_id)
    data.parent_id = None

    db.create_comment(data, user_id=comment.author_id)
    return True
  
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
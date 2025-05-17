from fastapi import APIRouter
from routers.dto import comment_dto

router = APIRouter(prefix="/comment", tags=["comment"])

@router.get('/', response_model=list[comment_dto.CommentItem])
async def get_comments(news_id: int):
    raise NotImplementedError("This function is not implemented yet.")

@router.post('/', response_model=bool)
async def post_comment(news_id: int, comment: comment_dto.PostCommentRequest):
    raise NotImplementedError("This function is not implemented yet.")
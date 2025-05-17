from fastapi import APIRouter
from routers.dto import comment_dto
from services.comment_service.get_comments import get_comments
from services.comment_service.post_comment import post_comment
from services.comment_service.get_comment_summary import get_comment_summary

router = APIRouter(prefix="/comment", tags=["comment"])

@router.get('/', response_model=list[comment_dto.CommentItem])
async def get_comments_handler(news_id: int):
    return await get_comments(news_id)

@router.post('/', response_model=bool)
async def post_comment_handler(news_id: int, comment: comment_dto.PostCommentRequest):
    return await post_comment(news_id, comment)

@router.get('/summary', response_model=comment_dto.CommentSummary)
async def get_comment_summary_handler(news_id: int):
    return await get_comment_summary(news_id)
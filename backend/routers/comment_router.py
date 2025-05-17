from fastapi import APIRouter, Request, Response
from routers.dto import comment_dto
from services.comment_service.post_comment import post_comment
from services.comment_service.get_comment_summary import get_comment_summary
from routers.middlewares import auth_middleware

router = APIRouter(prefix="/comment", tags=["comment"])

@router.post('/', response_model=bool)
async def post_comment_handler(news_id: int, comment: comment_dto.PostCommentRequest, request: Request, response: Response):
    user_id = auth_middleware(request, response)
    return await post_comment(news_id, comment, user_id)

@router.get('/summary', response_model=comment_dto.CommentSummary)
async def get_comment_summary_handler(news_id: int, request: Request, response: Response):
    user_id = auth_middleware(request, response)
    return await get_comment_summary(news_id, user_id)
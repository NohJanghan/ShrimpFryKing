from fastapi import APIRouter, HTTPException, Request, Response
from routers.dto import comment_dto
from services.comment_service.post_comment import post_comment
from services.comment_service.get_comment_summary import get_comment_summary
from services.comment_service.post_comment_like import post_comment_like, delete_comment_like
from routers.middlewares import auth_middleware

router = APIRouter(prefix="/comment", tags=["comment"])

@router.post('/', response_model=bool)
async def post_comment_handler(news_id: int, content: str, request: Request, response: Response):
    user_id = auth_middleware(request, response)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await post_comment(news_id, content, user_id)

@router.get('/summary', response_model=comment_dto.CommentSummary)
async def get_comment_summary_handler(news_id: int, request: Request, response: Response):
    user_id = auth_middleware(request, response)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await get_comment_summary(news_id, user_id)

@router.post('/like', response_model=bool)
async def post_comment_like_handler(news_id: int, comment_i: int, request: Request, response: Response):
    user_id = auth_middleware(request, response)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await post_comment_like(news_id, comment_i, user_id)

@router.delete('/like', response_model=bool)
async def delete_comment_like_handler(news_id: int, comment_i: int, request: Request, response: Response):
    user_id = auth_middleware(request, response)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await delete_comment_like(news_id, comment_i, user_id)

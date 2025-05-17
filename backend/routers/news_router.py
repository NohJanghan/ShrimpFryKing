from fastapi import APIRouter, HTTPException, Request, Response
from routers.dto import news_dto
from typing import Literal
from services.news_service.get_news import get_news
from services.news_service.get_news_by_id import get_news_by_id
from services.news_service.create_news import create_news
from services.user_service import session_store
from routers.middlewares import auth_middleware

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/", response_model=list[news_dto.NewsItemBrief])
async def get_news_handler(
    order_by: Literal['recent', 'hot'],
    request: Request,
    response: Response,
    page: int = 1,
    page_size: int = 10
):
    user_id = auth_middleware(request, response)
    print(f"User ID: {user_id}")

    return await get_news(order_by, user_id, page, page_size)

@router.get("/{news_id}", response_model=news_dto.NewsItemDetail)
async def get_news_by_id_handler(news_id: int, request: Request, response: Response):
    user_id = auth_middleware(request, response)
    return await get_news_by_id(news_id, user_id)

@router.post("/", response_model=bool)
async def create_news_handler(news_url: str):
    return await create_news(news_url)
from fastapi import APIRouter, Request
from routers.dto import news_dto
from typing import Literal
from services.news_service.get_news import get_news
from services.news_service.get_news_by_id import get_news_by_id
from services.news_service.create_news import create_news
from db.DBservice import db
from fastapi.concurrency import run_in_threadpool

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/", response_model=list[news_dto.NewsItemBrief])
async def get_news_handler(
    order_by: Literal['recent', 'hot'],
    page: int = 1,
    page_size: int = 10):
    return await get_news(order_by, page, page_size)

@router.get("/{news_id}", response_model=news_dto.NewsItemDetail)
async def get_news_by_id_handler(news_id: int):
    return await get_news_by_id(news_id)

@router.post("/", response_model=bool)
async def create_news_handler(news_url: str):
    return await create_news(news_url)

@router.post("/{news_id}/like", response_model=bool)
async def like_news(news_id: int, request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    action = data.get("action", 1)  # 1: 좋아요, -1: 취소
    await run_in_threadpool(db.update_news, news_id, likes=action, user_id=user_id)
    return True

@router.post("/{news_id}/dislike", response_model=bool)
async def dislike_news(news_id: int, request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    action = data.get("action", 1)  # 1: 싫어요, -1: 취소
    await run_in_threadpool(db.update_news, news_id, dislikes=action, user_id=user_id)
    return True
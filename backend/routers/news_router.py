from fastapi import APIRouter
from routers.dto import news_dto
from typing import Literal
from services.news_service import create_news

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/", response_model=list[news_dto.NewsItemBrief])
async def get_news_handler(order_by: Literal['recent', 'hot'], page: int = 1, page_size: int = 10):
    raise NotImplementedError("This endpoint is not implemented yet.")

@router.get("/{news_id}", response_model=news_dto.NewsItemDetail)
async def get_news_by_id_handler(news_id: int):
    raise NotImplementedError("This endpoint is not implemented yet.")

@router.post("/", response_model=bool)
async def create_news_handler(news_url: str):
    return await create_news(news_url)
from fastapi import APIRouter
from routers.dto import news_dto
from typing import Literal

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/", response_model=list[news_dto.NewsItemBrief])
async def get_news(order_by: Literal['recent', 'hot'], page: int = 1, page_size: int = 10):
    raise NotImplementedError("This endpoint is not implemented yet.")

@router.get("/{news_id}", response_model=news_dto.NewsItemDetail)
async def get_news_by_id(news_id: int):
    raise NotImplementedError("This endpoint is not implemented yet.")

@router.post("/", response_model=bool)
async def create_news(news_url: str):
    raise NotImplementedError("This endpoint is not implemented yet.")
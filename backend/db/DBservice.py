from db import *
from poco_data import *
from typing import Literal
from entity import *

class DBservice():
    def __init__(self):
        self.newsDB = NewsDB()

    def get_news_list(self, order_by: Literal['recent', 'hot'], page: int = 1, page_size: int = 10) -> list["sdfs"]:
        raise NotImplementedError("This endpoint is not implemented yet.")

    def get_news_by_id(self, id):
        raise NotImplementedError("This endpoint is not implemented yet.")

    def create_news(self, data: CreateNewsItem):
        raise NotImplementedError("This endpoint is not implemented yet.")

    def create_comment(self, data: CreateCommentItem):
        raise NotImplementedError("This endpoint is not implemented yet.")

    # def update_comment(self, index, likes: int | None = None, dislikes: int | None = None):
    #     raise NotImplementedError("This endpoint is not implemented yet.")

    # def update_news(self, id, likes: int | None = None, dislikes: int | None = None):
    #     raise NotImplementedError("This endpoint is not implemented yet.")

    # def delete_comment(self, id):
    #     raise NotImplementedError("This endpoint is not implemented yet.")
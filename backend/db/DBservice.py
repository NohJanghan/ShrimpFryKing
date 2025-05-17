from db import *
from typing import Literal
from entity import *

class DBservice():
    def __init__(self, dbname = "news.db"):
        self.newsDB = NewsDB(dbname)
        self.userDB = UserDB(dbname)

    def get_news_list(self, order_by: Literal['recent', 'hot'], page: int = 1, page_size: int = 10) -> list["sdfs"]:
        raise NotImplementedError("This endpoint is not implemented yet.")

    def get_news_by_id(self, id: int = 1) -> NewsItem:
        try:
            newsdict = self.newsDB.get_news(id)
            if newsdict is None:
                raise Exception("News not found")
            news = NewsItem()
            news.news_id = newsdict["news_id"]
            news.title = newsdict["title"]
            news.content = newsdict["content"]
            news.url = newsdict["url"]
            news.image_url = newsdict["image_url"]
            news.category = newsdict["category"]
            news.brief = newsdict["brief"]
            news.author_id = newsdict["author_id"]
            news.date = newsdict["date"]
            news.like = newsdict["like"]
            news.dislike = newsdict["dislike"]
            news.opinion = newsdict["opinion"]
            news.comment = []
            for comment in newsdict["comment"].split(overSEPERATOR):
                comment_item = CommentItem()
                comment_item.reset_using_string(comment)
                news.comment.append(comment_item)
            return news
        except:
            raise Exception("Error occurred while fetching news")

    def create_news(self, data: CreateNewsItem):
        raise NotImplementedError("This endpoint is not implemented yet.")

    def create_comment(self, data: CreateCommentItem):
        raise NotImplementedError("This endpoint is not implemented yet.")

    def update_comment(self, index, likes: int | None = None, dislikes: int | None = None):
        raise NotImplementedError("This endpoint is not implemented yet.")

    def update_news(self, id, likes: int | None = None, dislikes: int | None = None):
        raise NotImplementedError("This endpoint is not implemented yet.")

    # def delete_comment(self, id):
    #     raise NotImplementedError("This endpoint is not implemented yet.")
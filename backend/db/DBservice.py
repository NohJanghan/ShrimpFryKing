from .db import *
from typing import Literal
from .entity import *

def get_news_from_dict(newsdict: dict) -> NewsItem:
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

class DBservice():
    def __init__(self, dbname = "agora.db"):
        self.newsDB = NewsDB(dbname)
        self.userDB = UserDB(dbname)

    def get_news_list(self, order_by: Literal['recent', 'hot'], page: int = 1, page_size: int = 10, user_id: str = "") -> list["NewsItem"]:
        try:
            page_init = page_size * (page - 1) + 1
            page_end = page_size * page
            if order_by == "recent":
                newslist = self.newsDB.recent_news(page_end)
                newslist = newslist[page_init-1:]
                newslist = [get_news_from_dict(newsdict) for newsdict in newslist]
            elif order_by == "hot":
                newslist = self.newsDB.hot_news(page_end)
                newslist = newslist[page_init-1:]
                newslist = [get_news_from_dict(newsdict) for newsdict in newslist]
            else:
                raise Exception("Invalid order_by parameter")
            return newslist
        except:
            raise Exception("Error occurred while fetching news")

    def get_news_by_id(self, id: int = 1, user_id: str = "") -> NewsItem:
        try:
            newsdict = self.newsDB.get_news(id)
            if newsdict is None:
                raise Exception("News not found")
            return get_news_from_dict(newsdict)
        except:
            raise Exception("Error occurred while fetching news")

    def create_news(self, data: CreateNewsItem, user_id: str = "") -> None:
        try:
            if not self.userDB.is_user_exist(user_id):
                raise Exception("User not found")
            if data.author_id != user_id:
                raise Exception("User ID does not match")
            self.newsDB.insert_news(data.title, data.content, data.brief, data.url, data.image_url, data.category, data.author_id)
        except Exception as e:
            print(e)
            raise Exception(e)
        except:
            raise Exception("Error occurred while creating news")

    def create_comment(self, data: CreateCommentItem, user_id: str = "") -> None:
        try:
            if not self.userDB.is_user_exist(user_id):
                raise Exception("User not found")
            if data.author_id != user_id:
                raise Exception("User ID does not match")
            if not self.newsDB.is_news_exist(data.news_id):
                raise Exception("News not found")
            if data.parent_id is None:

                self.newsDB.insert_comment(data.news_id, data.content, data.author_id, data.parent_id)
            else:
                if not self.newsDB.is_comment_exist(data.news_id, data.parent_id):
                    raise Exception("Parent comment not found")
        except Exception as e:
            print(e)
            raise Exception(e)
        except:
            raise Exception("Error occurred while creating comment")

    def update_comment(self, index, likes: int | None = None, dislikes: int | None = None, user_id: str = "") -> bool:
        raise NotImplementedError("This endpoint is not implemented yet.")

    def update_news(self, id, likes: int | None = None, dislikes: int | None = None, user_id: str = "") -> bool:
        raise NotImplementedError("This endpoint is not implemented yet.")

    # def delete_comment(self, id):
    #     raise NotImplementedError("This endpoint is not implemented yet.")

db = DBservice("agora.db")
# import asyncio
from db.db import *
from typing import Literal
from db.entity import *

def get_news_from_dict(newsdict: dict, user_id:str) -> NewsItem:
    try:
        comment = []
        for i, _comment in enumerate(newsdict["comment"].split(overSEPERATER)):
            if _comment == "":
                continue
            comment_item = CommentItem()
            comment_item.reset_using_string(_comment, user_id)
            comment_item.news_id = newsdict["news_id"]
            comment_item.comment_index = i
            comment.append(comment_item)
        news = NewsItem(
            news_id = newsdict["news_id"],
            title= newsdict["title"],
            content = newsdict["content"],
            url = newsdict["URL"],
            image_url = newsdict["imageURL"],
            category = newsdict["category"],
            brief = newsdict["brief"],
            author_id = newsdict["author_id"],
            date = newsdict["date"],
            like = newsdict["like"],
            dislike = newsdict["dislike"],
            opinion = newsdict["opinion"],
            comment = comment,
            Isliked = newsdict["Isliked"],
            Isdisliked = newsdict["Isdisliked"],
            likelist = newsdict["likelist"].split(SEPERATER),
            dislikelist = newsdict["dislikelist"].split(SEPERATER)
        )
        return news
    except Exception as e:
        print("-------------------")
        print(e)
        raise Exception("Error occurred while getting news from dict")

class DBservice():
    def __init__(self, dbname = "agora.db"):
        self.newsDB = NewsDB(dbname)
        self.userDB = UserDB(dbname)

    def is_user_exist(self, user_id: str) -> bool:
        try:
            if len(self.userDB.get_user(user_id)) != 0:
                return True
            else:
                return False
        except:
            raise Exception("Error occurred while checking user existence")

    def login(self, user_id: str, password: str) -> bool:
        # True : login success
        # False : login failed
        try:
            return self.userDB.login(user_id, password)
        except:
            raise Exception("Error occurred while logging in")

    def signup_id(self, user_id: str) -> bool:
        # True : id available
        # False : id not available
        try:
            return self.userDB.signup_id(user_id)
        except:
            raise Exception("Error occurred while signing up ID")

    def signup(self, user_id: str, password: str, user_name: str) -> bool:
        # True : signup success
        # False : signup failed
        try:
            return self.userDB.signup(user_id, password, user_name)
        except:
            raise Exception("Error occurred while signing up")

    def get_news_list(self, order_by: Literal['recent', 'hot'], page: int = 1, page_size: int = 10, user_id: str="") -> list["NewsItem"]:
        try:
            page_init = page_size * (page - 1) + 1
            page_end = page_size * page
            if order_by == "recent":
                newslist = self.newsDB.recent_news(page_end, user_id)
                newslist = newslist[page_init-1:]
                newslist = [get_news_from_dict(newsdict, user_id) for newsdict in newslist]
            elif order_by == "hot":
                newslist = self.newsDB.hot_news(page_end, user_id)
                newslist = newslist[page_init-1:]
                newslist = [get_news_from_dict(newsdict, user_id) for newsdict in newslist]
            else:
                raise Exception("Invalid order_by parameter")
            return [news.replace() for news in newslist]
        except:
            raise Exception("Error occurred while fetching news")

    def get_news_by_id(self, id: int = 1, user_id: str="") -> NewsItem:
        try:
            newsdict = self.newsDB.get_news(id, user_id)
            if newsdict is {}:
                raise Exception("News not found")
            return get_news_from_dict(newsdict, user_id).replace()
        except:
            raise Exception("Error occurred while fetching news")

    def create_news(self, data: CreateNewsItem) -> None:
        try:
            if not self.is_user_exist(data.author_id):
                raise Exception("User not found")
            data = data.replace()
            self.newsDB.insert_news(data.title, data.content, data.brief, data.url, data.image_url, data.category, data.author_id)
        except Exception as e:
            print(e)
            raise Exception(e)
        except:
            raise Exception("Error occurred while creating news")

    def create_comment(self, data: CreateCommentItem, user_id: str = "") -> None:
        try:
            if not self.is_user_exist(user_id):
                raise Exception("User not found")
            if data.author_id != user_id:
                raise Exception("User ID does not match")
            newsdict = self.newsDB.get_news(data.news_id, user_id)
            if newsdict is {}:
                raise Exception("News not found")
            news = get_news_from_dict(newsdict, user_id)
            data = data.replace()
            if data.parent_id is None:
                newscomment = news.comment
                newscomment.append(CommentItem(news.news_id, data.author_id, data.content, data.posneg))
                ret = self.newsDB.update_news(data.news_id, comment=newscomment, user_id=user_id)
                if not ret:
                    raise Exception("Failed to update news with new comment")
            else:
                # Check if parent comment exists
                newscomment = news.comment
                if data.parent_id < len(newscomment) and data.parent_id >= 0:
                    newscomment[data.parent_id].insert_additional_comment(data.author_id, data.content)
                    ret = self.newsDB.update_news(data.news_id, comment=newscomment, user_id=user_id)
                    if not ret:
                        raise Exception("Failed to update news with new additional comment")
                else:
                    raise Exception("Parent comment not found")
        except Exception as e:
            print("-------------------")
            print(e)
            raise Exception(e)
        except:
            raise Exception("Error occurred while creating comment")

    def update_comment(self, news_id: int, comment_index: int, child_comment_index: int | None = None, likes: int | None = None, content: str = "", user_id: str = ""):
        # raise NotImplementedError("This endpoint is not implemented yet.")
        try:
            if not self.is_user_exist(user_id):
                raise Exception("User not found")
            news = self.newsDB.get_news(news_id, user_id)
            if news is {}:
                raise Exception("News not found")
            news = get_news_from_dict(news, user_id)
            if comment_index < 0 or comment_index >= len(news.comment):
                raise Exception("Comment index out of range")
            comment = news.comment[comment_index]

            if child_comment_index is None:
                if likes is not None:
                    if likes == 1 and not comment.Isliked:
                        comment.setlike(True, user_id)
                    elif likes == -1 and comment.Isliked:
                        comment.setlike(False, user_id)
                if content != "":
                    if comment.author_id == user_id:
                        comment.content = content
                    else:
                        raise Exception("User ID does not match")
            else:
                if content != "":
                    if child_comment_index < 0 or child_comment_index >= len(comment.additional_comment):
                        raise Exception("Child comment index out of range")
                    if comment.additional_comment[child_comment_index][0] != user_id:
                        raise Exception("User ID does not match")
                    comment.additional_comment[child_comment_index][1] = content
            news.comment[comment_index] = comment
            ret = self.newsDB.update_news(news_id, comment=news.comment, user_id=user_id)
            if not ret:
                raise Exception("Failed to update news with new comment")
        except Exception as e:
            print(e)
            raise Exception(e)
        except:
            raise Exception("Error occurred while updating comment")

    def update_news(self, news_id, likes: int | None = None, dislikes: int | None = None, user_id: str = ""):
        try:
            if not self.is_user_exist(user_id):
                raise Exception("User not found")
            news = self.newsDB.get_news(news_id, user_id)
            if news is {}:
                raise Exception("News not found")
            news = get_news_from_dict(news, user_id)
            if likes is not None:
                if likes == 1 and not news.Isliked:
                    news.setlike(True, user_id)
                elif likes == -1 and news.Isliked:
                    news.setlike(False, user_id)
            if dislikes is not None:
                if dislikes == 1 and not news.Isdisliked:
                    news.setdislike(True, user_id)
                elif dislikes == -1 and news.Isdisliked:
                    news.setdislike(False, user_id)
            ret = self.newsDB.update_news(news.news_id, like=news.like, dislike=news.dislike, opinion=news.like+news.dislike, likelist=news.likelist, dislikelist=news.dislikelist, user_id=user_id)
            if not ret:
                raise Exception("Failed to update news with new like/dislike")
        except Exception as e:
            print(e)
            raise Exception(e)
        except:
            raise Exception("Error occurred while updating news")

    # def delete_comment(self, id):
    #     raise NotImplementedError("This endpoint is not implemented yet.")

db = DBservice("agora.db")
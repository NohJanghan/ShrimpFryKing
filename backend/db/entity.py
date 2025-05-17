# import asyncio
from dataclasses import dataclass
from .DBservice import *

SEPERATER = "|||SEP|||"
overSEPERATER = "|||OVERSEP|||"
innerSEPERATER = "|||sep|||"
spaceSEPERATER = "|||space|||"
enterSEPERATER = "|||enter|||"

@dataclass
class CreateNewsItem:
    title: str
    content: str
    url: str
    image_url: str
    category: str
    brief: str
    author_id: str

    def replace(self):
        self.title = seperaterRUN(self.title)
        self.content = seperaterRUN(self.content)
        self.brief = seperaterRUN(self.brief)
        return self

@dataclass
class CreateCommentItem:
    content: str
    news_id: int
    author_id: int
    parent_id: int | None= None # int이면 additional Comment

    def replace(self):
        self.content = seperaterRUN(self.content)
        return self

@dataclass
class NewsItem:
    news_id: int
    title: str
    content: str
    url: str
    image_url: str
    category: str
    brief: str
    author_id: str
    date: int
    like: int
    dislike: int
    opinion: int
    comment: list['CommentItem'] # list of CommentItem
    Isliked: bool
    Isdisliked: bool

    def replace(self):
        self.title = seperaterUNRUN(self.title)
        self.content = seperaterUNRUN(self.content)
        self.brief = seperaterUNRUN(self.brief)
        self.comment = [comment.replace for comment in self.comment]
        return self

class CommentItem:
    news_id: int
    comment_index: int
    content: str
    author_id: str
    parent_id: int | None= None # int이면 additional Comment
    posneg: int # 0 : neutral, 1 : pos, -1 : neg
    like: int
    additional_comment: list[list] # list of Additional Comment(id, content)
    Isliked: bool
    # parent_id가 None이 아니면 []

    def __init__(self, id:str, content:str):
        self.author_id = id
        self.content = content
        self.posneg = 0
        self.like = 0
        self.additional_comment = []
        self.Isliked = False
        self.likelist = []
    def insert_additional_comment(self, id:str, content:str) -> bool:
        # True : insert success
        # False : insert failed
        try:
            self.additional_comment.append([id, content])
            return True
        except:
            print("insert comment error")
            return False
    def get_string(self) -> str:
        # return comment string
        ret = self.author_id + SEPERATER + self.content + SEPERATER + str(self.posneg) + SEPERATER + str(self.like) + SEPERATER + str(innerSEPERATER.join(self.likelist)) + SEPERATER
        for c in self.additional_comment:
            ret += c[0] + SEPERATER + c[1] + SEPERATER
        return ret
    def reset_using_string(self, string:str, user_id:str) -> bool:
        # reset comment using string
        try:
            lines = string.split(SEPERATER)
            self.author_id = lines[0]
            self.content = lines[1]
            self.posneg = int(lines[2])
            self.like = int(lines[3])
            self.likelist = lines[4].split(innerSEPERATER)
            self.Isliked = user_id in self.likelist
            self.additional_comment = []
            for i in range(5, len(lines), 2):
                if i + 1 < len(lines):
                    self.additional_comment.append([lines[i], lines[i + 1]])
            return True
        except:
            print("reset comment error")
            return False
    def replace(self):
        self.content = seperaterUNRUN(self.content)
        for i in range(len(self.additional_comment)):
            self.additional_comment[i][1] = seperaterUNRUN(self.additional_comment[i][1])
        return self
    def getIsliked(self) -> bool:
        return self.Isliked
    def setlike(self, like:bool, user_id:str):
        if like == True:
            self.like += 1
            self.likelist.append(user_id)
        else:
            self.like -= 1
            self.likelist.remove(user_id)
        self.Isliked = like
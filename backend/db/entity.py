# import asyncio
from dataclasses import dataclass

SEPERATER = "|||SEP|||"
overSEPERATER = "|||OVERSEP|||"
innerSEPERATER = "|||sep|||"
seperater_map = {
    '.': '|||DOT|||',
    ',': '|||COMMA|||',
    '\"': '|||QUOTE|||',
    "\'": '|||APOST|||',
    ':': '|||COLON|||',
    ';': '|||SEMIC|||',
    ' ': '|||SPACE|||',
    '\n': '|||ENTER|||',
    '\r': '|||RETURN|||',
    '<': '|||LT|||',
    '>': '|||GT|||',
    '&': '|||AMP|||',
    '%': '|||PERCENT|||',
    '=': '|||EQUAL|||',
    '+': '|||PLUS|||',
    '-': '|||MINUS|||',
    '*': '|||ASTERISK|||',
    '/': '|||SLASH|||',
    '\\': '|||BACKSLASH|||',
    '@': '|||AT|||',
    '#': '|||HASH|||',
    '$': '|||DOLLAR|||',
    '^': '|||CARET|||',
    '(': '|||LPAREN|||',
    ')': '|||RPAREN|||',
    '{': '|||LBRACE|||',
    '}': '|||RBRACE|||',
    '[': '|||LBRACKET|||',
    ']': '|||RBRACKET|||',
    '?': '|||QUESTION|||',
    '!': '|||EXCLAM|||',
    '&': '|||AMPERSAND|||',
    '`': '|||BACKTICK|||',
    '~': '|||TILDE|||',
    '\t': '|||TAB|||',
    '\\': '|||BACKSLASH|||',
    '_': '|||UNDERBAR|||'
}

def seperaterRUN(data: str) -> str:
    """
    for c, spt in seperater_map.items():
        data = data.replace(c, spt)
    """
    return data

def seperaterUNRUN(data: str) -> str:
    """
    for spt, c in seperater_map.items():
        data = data.replace(spt, c)
    """
    return data

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

class CreateCommentItem:
    news_id: int
    author_id: str
    content: str
    posneg: int # 0 : neutral, 1 : pos, -1 : neg
    parent_id: int | None= None # int이면 additional Comment
    def __init__(self, news_id:int=0, author_id:str="", content:str="", posneg:int=0, parent_id:int | None = None):
        self.content = content
        self.news_id = news_id
        self.author_id = author_id
        self.posneg = posneg
        self.parent_id = parent_id
    def replace(self):
        self.content = seperaterRUN(self.content)
        return self

class NewsItem:
    # news_id: int
    # title: str
    # content: str
    # url: str
    # image_url: str
    # category: str
    # brief: str
    # author_id: str
    # date: int
    # like: int
    # dislike: int
    # opinion: int
    # comment: list['CommentItem'] # list of CommentItem
    # Isliked: bool
    # Isdisliked: bool
    # likelist: list[str]
    # dislikelist: list[str]
    def __init__(self, news_id:int=0, title:str="", content:str="", url:str="", image_url:str="", category:str="", brief:str="", author_id:str="", date:int=0, like:int=0, dislike:int=0, opinion:int=0, comment:list['CommentItem']=[], Isliked:bool=False, Isdisliked:bool=False, likelist:list[str]=[], dislikelist:list[str]=[]):
        self.news_id = news_id
        self.title = title
        self.content = content
        self.url = url
        self.image_url = image_url
        self.category = category
        self.brief = brief
        self.author_id = author_id
        self.date = date
        self.like = like
        self.dislike = dislike
        self.opinion = opinion
        self.comment = comment
        self.Isliked = Isliked
        self.Isdisliked = Isdisliked
        self.likelist = likelist
        self.dislikelist = dislikelist
    def replace(self):
        self.title = seperaterUNRUN(self.title)
        self.content = seperaterUNRUN(self.content)
        self.brief = seperaterUNRUN(self.brief)
        self.comment = [comment.replace() for comment in self.comment]
        return self
    def setlike(self, like:bool, user_id:str):
        if like == True:
            self.like += 1
            self.likelist.append(user_id)
        else:
            self.like -= 1
            self.likelist.remove(user_id)
        self.Isliked = like
    def setdislike(self, dislike:bool, user_id:str):
        if dislike == True:
            self.dislike += 1
            self.dislikelist.append(user_id)
        else:
            self.dislike -= 1
            self.dislikelist.remove(user_id)
        self.Isdisliked = dislike

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

    def __init__(self, news_id:int=0, id:str="", content:str="", posneg:int=0):
        self.news_id = news_id
        self.author_id = id
        self.content = content
        self.posneg = posneg
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
        ret = str(self.news_id) + SEPERATER + self.author_id + SEPERATER + self.content + SEPERATER + str(self.posneg) + SEPERATER + str(self.like) + SEPERATER + str(innerSEPERATER.join(self.likelist)) + SEPERATER
        for c in self.additional_comment:
            ret += c[0] + SEPERATER + c[1] + SEPERATER
        return ret
    def reset_using_string(self, string:str, user_id:str) -> bool:
        # reset comment using string
        try:
            lines = string.split(SEPERATER)
            self.news_id = int(lines[0])
            self.author_id = lines[1]
            self.content = lines[2]
            self.posneg = int(lines[3])
            self.like = int(lines[4])
            self.likelist = lines[5].split(innerSEPERATER)
            self.Isliked = user_id in self.likelist
            self.additional_comment = []
            for i in range(6, len(lines), 2):
                if i + 1 < len(lines):
                    self.additional_comment.append([lines[i], lines[i + 1]])
            return True
        except:
            print("reset comment error")
            print(string)
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
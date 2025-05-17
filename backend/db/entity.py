SEPERATOR = "|||SEP|||"
overSEPERATOR = "|||OVERSEP|||"

class CreateNewsItem:
    title: str
    content: str
    url: str
    image_url: str
    category: str
    brief: str
    author_id: str

class CreateCommentItem:
    content: str
    news_id: int
    author_id: int
    parent_id: int | None= None # int이면 additional Comment

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

class CommentItem:
    news_id: int
    comment_index: int
    content: str
    author_id: str
    parent_id: int | None= None # int이면 additional Comment
    posneg: int # 0 : neutral, 1 : pos, -1 : neg
    like: int
    dislike: int
    additional_comment: list[list] # list of Additional Comment(id, content)
    Isliked: bool
    Isdisliked: bool
    # parent_id가 None이 아니면 []

    def __init__(self, id:str, content:str):
        self.author_id = id
        self.content = content
        self.posneg = 0
        self.like = 0
        self.dislike = 0
        self.additional_comment = []
        self.Isliked = False
        self.Isdisliked = False
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
        ret = self.author_id + SEPERATOR + self.content + SEPERATOR + str(self.posneg) + SEPERATOR + str(self.like) + SEPERATOR + str(self.dislike) + SEPERATOR + str(self.Isliked) + SEPERATOR + str(self.Isdisliked) + SEPERATOR
        for c in self.additional_comment:
            ret += c[0] + SEPERATOR + c[1] + SEPERATOR
        return ret
    def reset_using_string(self, string:str) -> bool:
        # reset comment using string
        try:
            lines = string.split(SEPERATOR)
            self.author_id = lines[0]
            self.content = lines[1]
            self.posneg = int(lines[2])
            self.like = int(lines[3])
            self.dislike = int(lines[4])
            self.Isliked = bool(int(lines[5]))
            self.Isdisliked = bool(int(lines[6]))
            self.additional_comment = []
            for i in range(7, len(lines), 2):
                if i + 1 < len(lines):
                    self.additional_comment.append([lines[i], lines[i + 1]])
            return True
        except:
            print("reset comment error")
            return False
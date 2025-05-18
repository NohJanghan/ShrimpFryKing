from pydantic import BaseModel

class NewsItemBrief(BaseModel):
    id: int
    title: str
    brief: str
    imageURL: str | None = None
    likes: int
    dislikes: int

class NewsItemDetail(BaseModel):
    news_id: int
    title: str
    content: str
    url: str
    image_url: str | None = None
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

class CommentItem(BaseModel):
    news_id: int
    comment_index: int
    content: str
    author_id: str
    parent_id: int | None= None # int이면 additional Comment
    posneg: int # 0 : neutral, 1 : pos, -1 : neg
    like: int
    additional_comment: list[list] # list of Additional Comment(id, content)
    Isliked: bool
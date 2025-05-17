from pydantic import BaseModel

class NewsItemBrief(BaseModel):
    id: int
    title: str
    brief: str
    imageURL: str
    likes: int
    dislikes: int

class NewsItemDetail(BaseModel):
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
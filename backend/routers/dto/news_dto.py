from pydantic import BaseModel

class NewsItemBrief(BaseModel):
    id: int
    title: str
    brief: str
    imageURL: str
    likes: int
    dislikes: int

class NewsItemDetail(BaseModel):
    id: int
    title: str
    brief: str
    content: str
    imageURL: str
    likes: int
    dislikes: int
    # comments


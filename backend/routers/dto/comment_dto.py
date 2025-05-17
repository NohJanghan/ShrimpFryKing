from pydantic import BaseModel

class AdditionalCommentItem(BaseModel):
    author: str
    content: str

class CommentItem(BaseModel):
    author: str
    content: str
    posneg: int # 1 for positive, -1 for negative
    likes: int
    dislikes: int
    additional_comments: list[AdditionalCommentItem]

class PostCommentRequest(BaseModel):
    author_id: str
    content: str
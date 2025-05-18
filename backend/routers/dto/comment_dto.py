from pydantic import BaseModel

class AdditionalCommentItem(BaseModel):
    author: str
    content: str

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
    # parent_id가 None이 아니면 []

class PostCommentRequest(BaseModel):
    parent_id : int | None = None
    content: str

class CommentSummary(BaseModel):
    summarized_positive_comment: str
    summarized_negative_comment: str
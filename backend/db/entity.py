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
    # here
    pass

class CommentItem:
    # here
    pass
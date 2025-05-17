from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from routers import news_router, comment_router

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(news_router.router)
app.include_router(comment_router.router)
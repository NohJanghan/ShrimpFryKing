from fastapi import FastAPI
from routers import news_router

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(news_router.router)
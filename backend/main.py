from fastapi import FastAPI
from routers import news_router
from dotenv import load_dotenv

app = FastAPI()
load_dotenv()

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(news_router.router)
from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI
from routers import news_router, comment_router, user_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(news_router.router)
app.include_router(comment_router.router)
app.include_router(user_router.router)
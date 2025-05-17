from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI
from routers import news_router, comment_router, user_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 시 전체 허용, 배포 시 도메인 제한 권장
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
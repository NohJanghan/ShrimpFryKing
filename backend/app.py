# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.news_router import router as news_router

app = FastAPI()

# CORS 설정 (프론트랑 연동 시 필요, 지금은 테스트용으로 * 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 또는 ["http://localhost:3000"] 등
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(news_router)

# 헬스체크용 루트 엔드포인트
@app.get("/")
def root():
    return {"message": "News API is running!"}
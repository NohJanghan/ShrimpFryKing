from fastapi import FastAPI, Request, Response, HTTPException
from services.user_service import session_store

def auth_middleware(request: Request, response: Response):
    """
    사용자 인증을 확인하는 미들웨어
    세션 ID로부터 사용자 ID를 확인하고 인증되지 않은 사용자는 401 에러를 반환합니다.
    """
    user_id = None
    session_id = request.cookies.get("session_id")

    if session_id:
        user_id = session_store.get(session_id)

    if not user_id:
        if session_id:
            response.delete_cookie("session_id")
        raise HTTPException(status_code=401, detail="Unauthorized")

    return user_id


import uuid
from fastapi import APIRouter, Request, Response
from services import user_service
from services.user_service import session_store, check_id_duplicate

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/check_id")
async def get_current_user(id):
    return check_id_duplicate(id)

@router.post("/login")
async def login(id: str, password: str, response: Response):
    success = user_service.login(
        user_id=id,
        password=password
    )
    if success:
        session_id = str(uuid.uuid4())
        response.set_cookie(key="session_id", value=session_id)#https 설정하면 좋음
        session_store[session_id] = id
        return True
    else:
        response.status_code = 401
        return False

@router.post("/register")
async def register(id: str, password: str, user_name: str):
    return user_service.register(
        user_id=id,
        password=password,
        user_name=user_name
    )
@router.post("/logout")
async def logout(request: Request, response: Response):
    if request.cookies.get("session_id") is None:
        return False
    session_id = request.cookies.get("session_id")
    if session_id and session_id in session_store:
        del session_store[session_id]
    response.delete_cookie(key="session_id")
    return True

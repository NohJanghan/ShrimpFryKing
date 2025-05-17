from fastapi import APIRouter

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/")
async def get_current_user():
    raise NotImplementedError("get_user not implemented")

@router.post("/login")
async def login():
    raise NotImplementedError("login not implemented")

@router.post("/register")
async def register():
    raise NotImplementedError("register not implemented")

@router.post("/logout")
async def logout():
    raise NotImplementedError("logout not implemented")


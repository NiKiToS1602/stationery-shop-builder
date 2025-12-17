from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import secrets

from app.core.redis_client import get_redis

router = APIRouter()


class LoginIn(BaseModel):
    email: EmailStr


class ConfirmIn(BaseModel):
    email: EmailStr
    code: str


@router.post("/login/")
async def login(data: LoginIn):
    redis = get_redis()
    code = f"{secrets.randbelow(1_000_000):06d}"
    await redis.set(f"otp:{data.email}", code, ex=300)
    return {"ok": True}


@router.post("/confirm/")
async def confirm(data: ConfirmIn):
    redis = get_redis()
    saved = await redis.get(f"otp:{data.email}")

    if not saved or saved.decode() != data.code:
        raise HTTPException(status_code=400, detail="Invalid code")

    await redis.delete(f"otp:{data.email}")
    return {"access_token": "stub"}

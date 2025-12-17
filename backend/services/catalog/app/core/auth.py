from fastapi import Header, HTTPException
from jose import jwt, JWTError
from app.core.config import settings


async def require_auth(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.removeprefix("Bearer ").strip()

    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")

        subject = payload.get("sub")
        if not subject:
            raise HTTPException(status_code=401, detail="Invalid token subject")

        return {"sub": subject}

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

import os
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()


def validate_user_id(user_id: str) -> str:
    """
    Validate user_id from request header
    Returns the user_id if valid
    """
    if not user_id:
        raise ValueError("user_id cannot be empty")
    
    user_id = str(user_id).strip()
    
    if len(user_id) == 0:
        raise ValueError("user_id cannot be empty")
    
    print(f"✓ User ID validated: {user_id}")
    return user_id
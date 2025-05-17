from fastapi import HTTPException
from db.DBservice import db

session_store = {}

def register(user_id: str, password: str, user_name: str) -> bool:
    """
    Register a new user with the given user_id, password, and user_name.

    Args:
        user_id (str): The ID of the user.
        password (str): The password for the user.
        user_name (str): The name of the user.

    Returns:
        bool: True if registration is successful, False otherwise.
    """
    try:
        # Check if the user ID is already taken
        if db.is_user_exist(user_id):
            return False

        # Create a new user in the database
        db.signup(user_id, password, user_name)
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def login(user_id: str, password: str) -> bool:
    """
    Log in a user with the given user_id and password.

    Args:
        user_id (str): The ID of the user.
        password (str): The password for the user.

    Returns:
        bool: True if login is successful, False otherwise.
    """
    try:
        # Check if the user ID exists and the password is correct
        if db.login(user_id, password):
            return True
        else:
            return False
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

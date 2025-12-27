from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# In-memory storage (for testing)
user_data_store = []

# Pydantic model to validate incoming JSON
class UserDetails(BaseModel):
    name: str
    email: str
    age: int
    gender: str

@app.post("/user-details")
def receive_user_details(user: UserDetails):
    # Store in memory
    user_data_store.append(user.dict())
    print("Received user data:", user.dict())
    return {"status": "success", "data": user.dict()}

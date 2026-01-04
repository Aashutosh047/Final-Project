from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS (Vite runs on 8080)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
user_data_store = []
questionnaire_store = []

# Models
class UserDetails(BaseModel):
    name: str
    email: str
    age: int
    gender: str

class Questionnaire(BaseModel):
    hairFallSeverity: str
    familyHistory: str
    stressLevel: str
    dietQuality: str
    sleepDuration: str
    scalpItching: bool
    scalpDandruff: bool
    scalpRedness: bool
    hairWashFrequency: str
    useHeatStyling: bool
    useChemicalTreatments: bool

@app.get("/")
def root():
    return {"message": "Hair Health Assessment API running"}

@app.post("/user-details")
def receive_user_details(user: UserDetails):
    user_data_store.append(user.dict())
    print("Received user data:", user.dict())
    return {"status": "success", "data": user.dict()}

@app.post("/questionnaire")
def receive_questionnaire(q: Questionnaire):
    questionnaire_store.append(q.dict())
    print("Received questionnaire:", q.dict())
    return {"status": "success", "data": q.dict()}

@app.get("/all-data")
def get_all_data():
    return {
        "users": user_data_store,
        "questionnaires": questionnaire_store
    }

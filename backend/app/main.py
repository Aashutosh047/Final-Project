from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
from pathlib import Path
from pprint import pprint

# Add parent directory to path to enable imports
sys.path.append(str(Path(__file__).parent.parent))

from app.ml.model import run_ml_pipeline

app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# In-memory storage
# =========================
user_data_store = []
questionnaire_store = []

# =========================
# Models
# =========================
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

# =========================
# Routes
# =========================
@app.get("/")
def root():
    return {"message": "Hair Health Assessment API running"}

@app.post("/user-details")
def receive_user_details(user: UserDetails):
    user_data_store.append(user.dict())

    print("\n[/user-details] Received user data:")
    pprint(user.dict())

    return {"status": "success"}
@app.post("/questionnaire")
def receive_questionnaire(q: Questionnaire):
    raw_q = q.dict()
    questionnaire_store.append(raw_q)

    print("\n[/questionnaire] Received raw questionnaire:")
    pprint(raw_q)

    ml_result = run_ml_pipeline(raw_q)

    print("\n========== ML RESULT ==========")
    pprint(ml_result)
    print("================================\n")

    return {
        "status": "success",
        "ml_result": ml_result
    }


@app.get("/all-data")
def get_all_data():
    return {
        "users": user_data_store,
        "questionnaires": questionnaire_store
    }

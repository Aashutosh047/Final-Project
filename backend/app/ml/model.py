import numpy as np
from typing import Dict, List, Tuple

# ==============================
# Disease Labels
# ==============================
DISEASES = [
    "Androgenetic Alopecia",
    "Telogen Effluvium",
    "Seborrheic Dermatitis",
    "Alopecia Areata",
    "Tinea Capitis",
    "Trichotillomania",
    "Diffuse Hair Loss",
    "Hair Shaft Disorder",
    "Other"
]

# ==============================
# Encoding Maps
# ==============================
HAIR_FALL_MAP = {"low": 0, "medium": 1, "high": 2}
YES_NO_MAP = {"no": 0, "yes": 1}
STRESS_MAP = {"low": 0, "moderate": 1, "high": 2}
DIET_MAP = {"poor": 0, "average": 1, "good": 2, "excellent": 3}
SLEEP_MAP = {"<5": 0, "5_to_7": 1, "7_to_9": 2, ">9": 3}
WASH_FREQ_MAP = {
    "once a week": 0,
    "twice a week": 1,
    "every other day": 2,
    "daily": 3
}

# ==============================
# Disease Contribution Matrix
# ==============================
DISEASE_CONTRIBUTIONS = np.array([
    [2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0],  # Androgenetic Alopecia
    [2, 0, 2, 2, 1, 0, 0, 0, 0, 0, 0],  # Telogen Effluvium
    [1, 0, 0, 1, 0, 0, 2, 2, 1, 1, 0],  # Seb Dermatitis
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],  # Alopecia Areata
    [1, 0, 0, 0, 0, 0, 2, 2, 1, 0, 0],  # Tinea Capitis
    [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],  # Trichotillomania
    [2, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0],  # Diffuse Hair Loss
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 2, 1],  # Hair Shaft Disorder
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  # Other
], dtype=np.float32)

# ==============================
# Formatting Layer (Backend → ML)
# ==============================
def format_questionnaire_for_model(raw_q: Dict) -> Dict:
    return {
        "hair_fall": raw_q["hairFallSeverity"].lower(),
        "family_history": raw_q["familyHistory"].lower(),
        "stress": raw_q["stressLevel"].lower(),
        "diet": raw_q["dietQuality"].lower(),
        "sleep": raw_q["sleepDuration"].lower(),
        "wash_frequency": raw_q["hairWashFrequency"].lower(),
        "heat_styling": raw_q["useHeatStyling"],
        "chemical_treatment": raw_q["useChemicalTreatments"],
        "scalp_issues": [
            issue for issue, present in {
                "itching": raw_q["scalpItching"],
                "dandruff": raw_q["scalpDandruff"],
                "redness": raw_q["scalpRedness"]
            }.items() if present
        ]
    }

# ==============================
# Encoding Layer
# ==============================
def encode_questionnaire(data: Dict) -> np.ndarray:
    vector = []

    vector.append(HAIR_FALL_MAP[data["hair_fall"]])
    vector.append(YES_NO_MAP[data["family_history"]])
    vector.append(STRESS_MAP[data["stress"]])
    vector.append(DIET_MAP[data["diet"]])
    vector.append(SLEEP_MAP[data["sleep"]])

    scalp = set(data["scalp_issues"])
    vector.append(1 if "itching" in scalp else 0)
    vector.append(1 if "dandruff" in scalp else 0)
    vector.append(1 if "redness" in scalp else 0)

    vector.append(WASH_FREQ_MAP[data["wash_frequency"]])
    vector.append(int(data["heat_styling"]))
    vector.append(int(data["chemical_treatment"]))

    return np.array(vector, dtype=np.float32)

# ==============================
# Prediction Layer
# ==============================
def predict_from_vector(vector: np.ndarray) -> List[Tuple[str, float]]:
    raw_scores = DISEASE_CONTRIBUTIONS @ vector
    probs = raw_scores / (raw_scores.sum() + 1e-8)

    results = sorted(
        zip(DISEASES, probs),
        key=lambda x: x[1],
        reverse=True
    )

    return results

# ==============================
# MAIN PIPELINE (CALLED BY FASTAPI)
# ==============================
def run_ml_pipeline(raw_questionnaire: Dict):
    formatted = format_questionnaire_for_model(raw_questionnaire)
    vector = encode_questionnaire(formatted)
    predictions = predict_from_vector(vector)

    print("\n[ML] Formatted Questionnaire:")
    print(formatted)

    print("\n[ML] Encoded Feature Vector:")
    print(vector)

    print("\n[ML] Disease Predictions:")
    for disease, prob in predictions:
        print(f"{disease}: {prob:.2f}")

    return {
        "formatted": formatted,
        "encoded_vector": vector.tolist(),
        "predictions": [
            {"disease": d, "probability": float(p)}
            for d, p in predictions
        ]
    }

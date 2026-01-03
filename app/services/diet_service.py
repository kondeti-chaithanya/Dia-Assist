from app.models.schemas import PatientInput
from app.services.diet_plan import get_diet_plan

def generate_diet_plan(data: PatientInput):
    return get_diet_plan(data.dict())

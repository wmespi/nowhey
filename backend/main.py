from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
from supabase import create_client, Client

load_dotenv()

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Clients
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Failed to initialize Supabase: {e}")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("Gemini API Key not found.")

# Models
class AssessmentRequest(BaseModel):
    restaurant_name: str
    description: str = None

class ReviewRequest(BaseModel):
    restaurant_id: int
    user_name: str
    rating: float
    review: str

@app.get("/")
def read_root():
    return {"message": "Welcome to nowhey API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/assess")
async def assess_restaurant(request: AssessmentRequest):
    if not GEMINI_API_KEY:
        return {
            "id": 0,
            "score": 7,
            "summary": "Mock assessment (No API Key)",
            "dairyFreeOptions": ["Mock Option 1", "Mock Option 2"]
        }
    
    # 1. Get or Create Restaurant in DB
    restaurant_id = None
    if supabase:
        try:
            # Check if exists
            res = supabase.table("restaurants").select("id").eq("name", request.restaurant_name).execute()
            if res.data:
                restaurant_id = res.data[0]['id']
            else:
                # Create
                res = supabase.table("restaurants").insert({"name": request.restaurant_name}).execute()
                if res.data:
                    restaurant_id = res.data[0]['id']
        except Exception as e:
            print(f"Supabase Error (Restaurant): {e}")

    # 2. Assess with Gemini
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt_json = f"""
        You are a dairy-free food expert. Assess the restaurant '{request.restaurant_name}'.
        {f"Description: {request.description}" if request.description else ""}
        Return ONLY a valid JSON object with the following keys:
        - score: integer 0-10
        - summary: string
        - dairyFreeOptions: list of strings
        """
        response = model.generate_content(prompt_json)
        import json
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        
        # Attach restaurant_id to response
        data['id'] = restaurant_id
        return data
    except Exception as e:
        print(f"Gemini Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reviews")
async def get_reviews(restaurant_name: str):
    if not supabase:
        return []
    
    try:
        # Get ID first
        res_id = supabase.table("restaurants").select("id").eq("name", restaurant_name).execute()
        if not res_id.data:
            return []
        
        r_id = res_id.data[0]['id']
        
        response = supabase.table("reviews").select("*").eq("restaurant_id", r_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Supabase Error: {e}")
        return []

@app.post("/api/reviews")
async def create_review(review: ReviewRequest):
    if not supabase:
        return {"message": "Review saved (Mock - DB not connected)"}
    
    try:
        data = review.dict()
        response = supabase.table("reviews").insert(data).execute()
        return response.data
    except Exception as e:
        print(f"Supabase Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

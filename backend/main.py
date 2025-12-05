from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
from supabase import create_client, Client
import httpx
from bs4 import BeautifulSoup

load_dotenv()

app = FastAPI()

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Backend is running"}

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
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

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
    google_place_id: str = None
    website: str = None

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

# Google Places Integration
@app.get("/api/places/search")
async def search_places(query: str):
    if not GOOGLE_MAPS_API_KEY:
        raise HTTPException(status_code=500, detail="Google Maps API Key not configured")
    
    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress"
    }
    payload = {"textQuery": query}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch from Google Places")
        return response.json()

@app.get("/api/restaurants/{place_id}")
async def get_restaurant_details(place_id: str):
    # 1. Check DB first
    if supabase:
        try:
            res = supabase.table("restaurants").select("*").eq("google_place_id", place_id).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            print(f"Supabase Error (Check): {e}")

    # 2. If not in DB, fetch from Google Places
    if not GOOGLE_MAPS_API_KEY:
         raise HTTPException(status_code=500, detail="Google Maps API Key not configured")

    url = f"https://places.googleapis.com/v1/places/{place_id}"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "id,displayName,websiteUri"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch place details")
        
        place_data = response.json()
        name = place_data.get("displayName", {}).get("text")
        website = place_data.get("websiteUri")
        
        # 3. Save to DB
        if supabase and name:
            try:
                # Check if name exists (fallback legacy check)
                existing = supabase.table("restaurants").select("*").eq("name", name).execute()
                if existing.data:
                    # Update existing with place_id if missing
                    r_id = existing.data[0]['id']
                    supabase.table("restaurants").update({"google_place_id": place_id, "website": website}).eq("id", r_id).execute()
                    return {**existing.data[0], "google_place_id": place_id, "website": website}
                else:
                    # Create new
                    new_res = supabase.table("restaurants").insert({
                        "name": name,
                        "google_place_id": place_id,
                        "website": website
                    }).execute()
                    if new_res.data:
                        return new_res.data[0]
            except Exception as e:
                print(f"Supabase Error (Insert): {e}")
                # Return mock/transient object if DB fails
                return {"id": 0, "name": name, "google_place_id": place_id, "website": website}
        
        return {"id": 0, "name": name, "google_place_id": place_id, "website": website}

async def fetch_website_content(url: str):
    if not url:
        return ""
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                # Remove script and style elements
                for script in soup(["script", "style"]):
                    script.decompose()
                text = soup.get_text()
                # Break into lines and remove leading/trailing space on each
                lines = (line.strip() for line in text.splitlines())
                # Break multi-headlines into a line each
                chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                # Drop blank lines
                text = '\n'.join(chunk for chunk in chunks if chunk)
                return text[:5000] # Limit context size
    except Exception as e:
        print(f"Website fetch error: {e}")
    return ""

@app.post("/api/assess")
async def assess_restaurant(request: AssessmentRequest):
    if not GEMINI_API_KEY:
        return {
            "id": 0,
            "score": 7,
            "summary": "Mock assessment (No API Key)",
            "dairyFreeOptions": ["Mock Option 1", "Mock Option 2"]
        }
    
    # Fetch website content if available
    website_content = ""
    if request.website:
        website_content = await fetch_website_content(request.website)
    
    # Assess with Gemini
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        context_str = f"Website Content (Truncated): {website_content}" if website_content else "No website content available."
        
        prompt_json = f"""
        You are a dairy-free food expert. Assess the restaurant '{request.restaurant_name}'.
        {f"Description: {request.description}" if request.description else ""}
        {context_str}
        
        Based on the name, description, and website content (if provided), assess how dairy-free friendly this restaurant is.
        Return ONLY a valid JSON object with the following keys:
        - score: integer 0-10
        - summary: string
        - dairyFreeOptions: list of strings
        """
        response = model.generate_content(prompt_json)
        import json
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        
        # Attach restaurant_id if we can find it (for legacy frontend compatibility)
        # Ideally frontend passes ID, but if not we try to look it up
        if supabase:
             res = supabase.table("restaurants").select("id").eq("name", request.restaurant_name).execute()
             if res.data:
                 data['id'] = res.data[0]['id']
        
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

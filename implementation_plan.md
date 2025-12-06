# Phase 2: Specific Feature Branch Plan

## Goal
Execute Phase 2 features using descriptive feature branches that clearly indicate the scope of work.

## Branch Strategy
All branches will be created off `develop`.

---

## 1. Backend Work

### Feature: Search Refinement
**Branch**: `feature/backend-filter-google-places-food`
#### [MODIFY] [main.py](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/backend/main.py)
- Update `/search` endpoint to include `types=['restaurant', 'cafe', 'bakery', 'food']`.

### Feature: LLM Enhancements
**Branch**: `feature/backend-llm-prompt-scoring-update`
#### [MODIFY] [main.py](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/backend/main.py)
- **Prompt**: Update system prompt to detect "accommodating" language.
- **Scoring**: Enforce 0-5 scale in the Pydantic model and prompt instructions.

### Feature: Data & Schema
**Branch**: `feature/backend-schema-add-address-column`
#### [MODIFY] [schema.sql](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/backend/schema.sql)
- Add `address` column to `restaurants` table.

#### [MODIFY] [main.py](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/backend/main.py)
- Update `get_restaurant` to fetch/store `formatted_address`.

### Feature: Infrastructure - Modularize Code
**Branch**: `feature/backend-infrastructure-modularization`
#### [NEW] [backend/app/](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/backend/app/)
- Create `app` directory structure:
    - `__init__.py`
    - `main.py` (Entry point)
    - `routers/` (API endpoints)
        - `places.py`
        - `reviews.py`
        - `assess.py`
    - `services/` (Business logic)
        - `google_maps.py`
        - `gemini.py`
        - `supabase.py`
    - `models/` (Pydantic models)
        - `schemas.py`

#### [MODIFY] [backend/main.py](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/backend/main.py)
- Refactor to use the new structure.
- Eventually replace with `app/main.py` or keep as entry point importing from `app`.

#### [NEW] [backend/tests/](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/backend/tests/)
- Create tests for each module:
    - `test_places.py`
    - `test_reviews.py`
    - `test_assess.py`

---

## 2. Frontend Work

### Feature: Assets
**Branch**: `feature/frontend-generate-robot-cow-icon`
- **Generate**: "Robot Cow" icon (SVG/PNG) for LLM score.

### Feature: Score Banner
**Branch**: `feature/frontend-component-score-banner`
#### [NEW] [ScoreBanner.jsx](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/frontend/src/components/ScoreBanner.jsx)
- Component to display LLM Score (displayed next to Robot Cow icon) and User Score (displayed next to Spilled Milk icon).

#### [MODIFY] [RestaurantDetails.jsx](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/frontend/src/pages/RestaurantDetails.jsx)
- Import and place `ScoreBanner` at the top.

### Feature: Address Display
**Branch**: `feature/frontend-ui-display-address`
#### [MODIFY] [RestaurantDetails.jsx](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/frontend/src/pages/RestaurantDetails.jsx)
- Display the restaurant's address (dependent on Backend Data Schema work).

### Feature: Branding
**Branch**: `feature/frontend-branding-favicon-og`
#### [MODIFY] [index.html](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/frontend/index.html)
- Update `<link rel="icon">` to use the Spilled Milk icon.
- Add Open Graph meta tags (`og:image`, `og:title`, `og:description`) using the full Brand Logo.

#### [NEW] [public/](file:///Users/williamespinoza/Documents/Coding%20Projects/nowhey/frontend/public/)
- Add `favicon.svg` (Spilled Milk).
- Add `og-image.png` (Full Brand Logo).

---

## Execution Order
Recommended Start: `feature/backend-filter-google-places-food`

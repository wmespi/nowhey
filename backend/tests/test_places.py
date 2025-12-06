
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import sys
import os

# Add backend directory to path so we can import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

@pytest.fixture
def mock_google_places_response():
    return {
        "places": [
            {
                "id": "place1",
                "displayName": {"text": "Vegan Bistro"},
                "formattedAddress": "123 Green St",
                "types": ["restaurant", "vegan_restaurant", "food"]
            },
            {
                "id": "place2",
                "displayName": {"text": "Gas Station Sushi"},
                "formattedAddress": "456 Highway Rd",
                "types": ["gas_station", "store", "food"]
            },
            {
                "id": "place3",
                "displayName": {"text": "Cool Cafe"},
                "formattedAddress": "789 Bean Blvd",
                "types": ["cafe", "food", "establishment"]
            },
            {
                "id": "place4",
                "displayName": {"text": "Hardware Store"},
                "formattedAddress": "101 Tool Ln",
                "types": ["store", "point_of_interest"]
            }
        ]
    }

@patch("httpx.AsyncClient")
def test_search_places_success(mock_client_cls, mock_google_places_response):
    # Setup mock client instance
    mock_client_instance = AsyncMock()
    mock_client_cls.return_value = mock_client_instance
    
    # Handle context manager
    mock_client_instance.__aenter__.return_value = mock_client_instance
    mock_client_instance.__aexit__.return_value = None
    
    # Setup response (Synchronous object)
    from unittest.mock import MagicMock
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = mock_google_places_response
    
    # Configure the async method to return this response when awaited
    mock_client_instance.post.return_value = mock_response

    # Call endpoint
    response = client.get("/api/places/search?query=vegan")

    # Assertions
    assert response.status_code == 200
    data = response.json()
    
    # We expect 3 places (Hardware Store filtered out)
    assert "places" in data
    assert len(data["places"]) == 3
    
    names = [p["displayName"]["text"] for p in data["places"]]
    assert "Vegan Bistro" in names
    assert "Gas Station Sushi" in names
    assert "Cool Cafe" in names
    assert "Hardware Store" not in names

@patch("httpx.AsyncClient")
def test_search_places_api_error(mock_client_cls):
    # Setup mock client instance
    mock_client_instance = AsyncMock()
    mock_client_cls.return_value = mock_client_instance
    
    # Handle context manager
    mock_client_instance.__aenter__.return_value = mock_client_instance
    mock_client_instance.__aexit__.return_value = None

    # Setup mock for error
    from unittest.mock import MagicMock
    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_response.json.return_value = {"error": "Bad Request"}
    mock_client_instance.post.return_value = mock_response

    # Call endpoint
    response = client.get("/api/places/search?query=invalid")

    # Assertions
    assert response.status_code == 400


import os
import requests

from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from recommender import movies, recommend_movies


# Load TMDB token from backend/.env
load_dotenv(Path(__file__).resolve().parent / ".env")

TMDB_TOKEN = os.getenv("TMDB_READ_ACCESS_TOKEN")

TMDB_BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"


app = FastAPI(title="Cinemate Movie Recommendation API")


# React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://cinemate-hafsah.vercel.app",
        "https://cinemate-sandy.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Common function to communicate with TMDB
def tmdb_request(endpoint, params=None):

    if not TMDB_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="TMDB token not found. Check your .env file."
        )

    headers = {
        "Authorization": f"Bearer {TMDB_TOKEN}",
        "accept": "application/json"
    }

    try:
        response = requests.get(
            f"{TMDB_BASE_URL}/{endpoint}",
            headers=headers,
            params=params,
            timeout=15
        )

        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as error:
        print("TMDB connection error:", error)

        raise HTTPException(
            status_code=502,
            detail="Unable to connect to TMDB. Please try again."
        )


# Format movie information
def format_movies(data):

    result = []

    for movie in data.get("results", []):

        result.append({
            "id": movie.get("id"),
            "title": movie.get("title"),
            "overview": movie.get("overview"),
            "release_date": movie.get("release_date"),
            "rating": movie.get("vote_average"),
            "poster": (
                IMAGE_BASE_URL + movie["poster_path"]
                if movie.get("poster_path")
                else None
            ),
            "backdrop": (
                "https://image.tmdb.org/t/p/original"
                + movie["backdrop_path"]
                if movie.get("backdrop_path")
                else None
            ),
            "language": movie.get("original_language"),
            "genre_ids": movie.get("genre_ids", [])
        })

    return result


# Home endpoint
@app.get("/")
def home():

    return {
        "message": "Welcome to Cinemate Movie Recommendation API!"
    }


# Existing movie dataset
@app.get("/movies")
def get_movies():

    return movies.drop(
        columns=["combined_features"]
    ).to_dict(orient="records")


# Existing CSV-based recommendation system
@app.get("/recommend/{movie_title}")
def get_recommendations(movie_title: str):

    recommendations = recommend_movies(movie_title)

    if not recommendations:
        return {
            "message": "Movie not found",
            "recommendations": []
        }

    return {
        "selected_movie": movie_title,
        "recommendations": recommendations
    }


# Trending movies with pagination
@app.get("/tmdb/trending")
def get_trending(
    page: int = Query(default=1, ge=1, le=500)
):

    data = tmdb_request(
        "trending/movie/week",
        {"page": page}
    )

    return format_movies(data)


# Now playing movies in India
@app.get("/tmdb/now-playing")
def get_now_playing(
    page: int = Query(default=1, ge=1, le=500)
):

    data = tmdb_request(
        "movie/now_playing",
        {
            "region": "IN",
            "page": page
        }
    )

    return format_movies(data)


# Upcoming movies in India
@app.get("/tmdb/upcoming")
def get_upcoming(
    page: int = Query(default=1, ge=1, le=500)
):

    data = tmdb_request(
        "movie/upcoming",
        {
            "region": "IN",
            "page": page
        }
    )

    return format_movies(data)


# Hollywood, Bollywood and Kollywood
# Supports multiple pages
@app.get("/tmdb/industry/{industry}")
def get_industry_movies(
    industry: str,
    page: int = Query(default=1, ge=1, le=500)
):

    industry_settings = {
        "hollywood": {
            "with_original_language": "en",
            "region": "US"
        },
        "bollywood": {
            "with_original_language": "hi",
            "region": "IN"
        },
        "kollywood": {
            "with_original_language": "ta",
            "region": "IN"
        }
    }

    industry = industry.lower()

    if industry not in industry_settings:
        raise HTTPException(
            status_code=404,
            detail="Invalid industry. Choose hollywood, bollywood or kollywood."
        )

    params = {
        **industry_settings[industry],
        "sort_by": "popularity.desc",
        "include_adult": "false",
        "page": page
    }

    data = tmdb_request(
        "discover/movie",
        params
    )

    return format_movies(data)


# Similar movie recommendations from TMDB
@app.get("/tmdb/recommendations/{movie_id}")
def get_tmdb_recommendations(movie_id: int):

    data = tmdb_request(
        f"movie/{movie_id}/recommendations"
    )

    return format_movies(data)


import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load movie dataset
movies = pd.read_csv("movies.csv")

# Handle missing values
movies = movies.fillna("")

# Combine genre and description
movies["combined_features"] = (
    movies["genre"] + " " + movies["description"]
)

# Convert movie text into numerical vectors
tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(movies["combined_features"])

# Calculate similarity between movies
similarity_matrix = cosine_similarity(tfidf_matrix)


def recommend_movies(movie_title, number_of_recommendations=5):

    # Find the selected movie
    movie_matches = movies[
        movies["title"].str.lower() == movie_title.lower()
    ]

    if movie_matches.empty:
        return []

    movie_index = movie_matches.index[0]

    # Get similarity scores
    similarity_scores = list(
        enumerate(similarity_matrix[movie_index])
    )

    # Sort from highest similarity to lowest
    similarity_scores = sorted(
        similarity_scores,
        key=lambda x: x[1],
        reverse=True
    )

    # Exclude the selected movie
    similarity_scores = [
        item for item in similarity_scores
        if item[0] != movie_index
    ]

    # Get top recommendations
    top_movies = similarity_scores[:number_of_recommendations]

    recommendations = []

    for index, score in top_movies:
        movie = movies.iloc[index]

        recommendations.append({
            "title": movie["title"],
            "genre": movie["genre"],
            "year": int(movie["year"]),
            "rating": float(movie["rating"]),
            "description": movie["description"],
            "similarity": round(float(score), 3)
        })

    return recommendations

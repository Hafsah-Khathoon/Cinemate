# 🎬 Cinemate – Movie Discovery & Recommendation Platform

Cinemate is a full-stack movie discovery and recommendation platform that allows users to explore movies from different film industries, discover trending releases, and receive movie recommendations.

## ✨ Features

- 🎥 Discover trending and popular movies.
- 🌎 Explore Hollywood, Bollywood, and Kollywood movies.
- 🔥 Browse trending movies.
- 🎞️ Explore now-playing and upcoming movies.
- ⭐ View movie ratings, posters, and release dates.
- 🤖 Get similar movie recommendations.
- 🔖 Add movies to a personal watchlist.
- 🔍 Search and discover movies.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- CSS
- Vite
- Lucide React

### Backend
- Python
- FastAPI

### Machine Learning
- Pandas
- NumPy
- Scikit-learn
- TF-IDF Vectorization
- Cosine Similarity

### Movie Data
- TMDB API

## 📁 Project Structure

```text
Cinemate/
│
├── backend/
│   ├── venv/
│   ├── main.py
│   ├── recommender.py
│   ├── movies.csv
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

Follow these steps to run Cinemate locally.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/Cinemate.git
cd Cinemate
```

### 2. Backend Setup

Navigate to the backend folder:

```powershell
cd backend
```

Create a virtual environment if you haven't already:

```powershell
python -m venv venv
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the required dependencies:

```powershell
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder and add your TMDB API read access token:

```env
TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

Start the backend server:

```powershell
uvicorn main:app --reload
```

Backend runs at:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

`http://localhost:5173`

## 🔐 Environment Variables

Cinemate uses a TMDB API access token to retrieve movie information.

- Store the token in `backend/.env`.
- Never upload your `.env` file or API token to GitHub.
- Keep `backend/.env` listed in `.gitignore`.

## 🎯 Project Goal

The goal of Cinemate is to provide a simple and user-friendly platform for discovering movies across multiple film industries while combining full-stack development with machine-learning-based recommendations.

## 👩‍💻 Developed By

**Hafsah Khathoon M.**

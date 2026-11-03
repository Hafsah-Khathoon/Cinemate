# 🎬 Cinemate – Movie Discovery & Recommendation Platform

Cinemate is a full-stack web application that helps users discover movies across different film industries and explore personalized movie recommendations.

🌐 **Live Demo:** https://cinemate-hafsah.vercel.app/

## ✨ Features

- Discover trending and popular movies.
- Explore Hollywood, Bollywood and Kollywood movies.
- Browse now-playing and upcoming releases.
- View movie posters, ratings and release dates.
- Get similar movie recommendations.
- Search movies and manage a personal watchlist.

## 🛠️ Tech Stack

- **Frontend:** React.js, JavaScript, CSS, Vite, Lucide React
- **Backend:** Python, FastAPI
- **Machine Learning:** Pandas, NumPy, Scikit-learn, TF-IDF, Cosine Similarity
- **Movie Data:** TMDB API

## 🚀 Run Locally

**1. Clone the repository**

```bash
git clone https://github.com/Hafsah-Khathoon/Cinemate.git
cd Cinemate
```

**2. Set up the backend**

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a `.env` file inside `backend`:

```env
TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
```

Start the backend:

```bash
uvicorn main:app --reload
```

**3. Set up the frontend**

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## 🌐 Deployment

- **Frontend:** [Vercel](https://cinemate-hafsah.vercel.app/)
- **Backend:** [Render](https://cinemate-backend-m2xu.onrender.com/)
- **API Documentation:** [FastAPI Docs](https://cinemate-backend-m2xu.onrender.com/docs)

## 👩‍💻 Developer

**Hafsah Khathoon M.**

[GitHub](https://github.com/Hafsah-Khathoon) | [LinkedIn](https://www.linkedin.com/in/hafsahkhathoon14/)

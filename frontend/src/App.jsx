
import { useState, useEffect } from "react";
import {
  Search,
  Bookmark,
  Star,
  Sparkles,
  Play,
  Clapperboard,
  X,
  ArrowRight,
  Menu
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const MOVIES_PER_PAGE = 20;

const getPoster = (title) =>
  `https://placehold.co/500x750/151827/e5b94b?text=${encodeURIComponent(
    title || "Movie"
  )}`;

const formatMovie = (movie) => ({
  ...movie,
  id: movie.id,
  image: movie.poster || getPoster(movie.title),
  year: movie.release_date
    ? movie.release_date.slice(0, 4)
    : "",
  genre: movie.language?.toUpperCase() || "Movie",
  rating:
    movie.rating != null
      ? Number(movie.rating).toFixed(1)
      : "N/A"
});

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [activeItem, setActiveItem] = useState("Home");

  const [savedMovies, setSavedMovies] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("cinemate-watchlist")
      );

      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [recommendations, setRecommendations] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");

  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] =
    useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [error, setError] = useState("");
  const [recommendationError, setRecommendationError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Save watchlist in local storage
  useEffect(() => {
    localStorage.setItem(
      "cinemate-watchlist",
      JSON.stringify(savedMovies)
    );
  }, [savedMovies]);

  // Get the correct TMDB endpoint
  const getEndpoint = (item) => {
    const endpoints = {
      Home: "/tmdb/trending",
      "Explore Movies": "/tmdb/trending",
      Trending: "/tmdb/trending",
      Hollywood: "/tmdb/industry/hollywood",
      Bollywood: "/tmdb/industry/bollywood",
      Kollywood: "/tmdb/industry/kollywood",
      "Now Playing": "/tmdb/now-playing",
      Upcoming: "/tmdb/upcoming"
    };

    return endpoints[item] || "/tmdb/trending";
  };

  // Load the first page whenever the category changes
  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      if (activeItem === "My Watchlist") {
        setMovies([]);
        setLoadingMovies(false);
        setLoadingMore(false);
        setHasMore(false);
        setPage(1);
        setError("");
        return;
      }

      setLoadingMovies(true);
      setLoadingMore(false);
      setError("");
      setMovies([]);
      setPage(1);
      setHasMore(true);

      try {
        const endpoint = getEndpoint(activeItem);
        const response = await fetch(
          `${API_URL}${endpoint}?page=1`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load movies. Please try again."
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid movie data received.");
        }

        if (!cancelled) {
          setMovies(data.map(formatMovie));
          setHasMore(data.length === MOVIES_PER_PAGE);
        }
      } catch (err) {
        if (!cancelled) {
          setMovies([]);
          setError(
            err.message || "Could not connect to the backend."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingMovies(false);
        }
      }
    };

    fetchMovies();

    return () => {
      cancelled = true;
    };
  }, [activeItem]);

  // Load the next page of movies
  const loadMoreMovies = async () => {
    if (
      loadingMore ||
      loadingMovies ||
      !hasMore ||
      activeItem === "My Watchlist"
    ) {
      return;
    }

    const nextPage = page + 1;

    setLoadingMore(true);
    setError("");

    try {
      const endpoint = getEndpoint(activeItem);

      const response = await fetch(
        `${API_URL}${endpoint}?page=${nextPage}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load more movies. Please try again."
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid movie data received.");
      }

      const newMovies = data.map(formatMovie);

      // Add new movies without duplicates
      setMovies((previousMovies) => {
        const existingIds = new Set(
          previousMovies.map((movie) => movie.id)
        );

        const uniqueMovies = newMovies.filter(
          (movie) => !existingIds.has(movie.id)
        );

        return [...previousMovies, ...uniqueMovies];
      });

      setPage(nextPage);
      setHasMore(data.length === MOVIES_PER_PAGE);
    } catch (err) {
      setError(
        err.message || "Could not load more movies."
      );
    } finally {
      setLoadingMore(false);
    }
  };

  // Get similar movies directly from TMDB
  const findSimilar = async (movie) => {
    if (!movie.id) {
      setRecommendationError(
        "Movie ID is missing. Please try another movie."
      );
      return;
    }

    setSelectedMovie(movie.title);
    setRecommendations([]);
    setRecommendationError("");
    setLoadingRecommendations(true);

    setTimeout(() => {
      document.getElementById("recommendations")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);

    try {
      const response = await fetch(
        `${API_URL}/tmdb/recommendations/${movie.id}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to fetch recommendations from TMDB."
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid recommendation data received.");
      }

      setRecommendations(data.map(formatMovie));

      if (data.length === 0) {
        setRecommendationError(
          "No similar movies found. Try another movie."
        );
      }
    } catch (err) {
      setRecommendationError(
        err.message || "Something went wrong while finding movies."
      );
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Add or remove movies from watchlist
  const toggleSave = (movie) => {
    setSavedMovies((previous) => {
      const alreadySaved = previous.some(
        (item) => item.id === movie.id
      );

      if (alreadySaved) {
        return previous.filter(
          (item) => item.id !== movie.id
        );
      }

      return [...previous, movie];
    });
  };

  // Sidebar navigation
  const navigate = (item) => {
    setActiveItem(item);
    setMobileMenuOpen(false);
    setSearch("");
    setRecommendations([]);
    setSelectedMovie("");
    setRecommendationError("");

    if (item === "Home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      setTimeout(() => {
        document.getElementById("movie-library")?.scrollIntoView({
          behavior: "smooth"
        });
      }, 100);
    }
  };

  // Select movie source
  const movieSource =
    activeItem === "My Watchlist" ? savedMovies : movies;

  // Search movies
  const filteredMovies = movieSource.filter((movie) =>
    movie.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Movie card
  const renderMovieCard = (movie) => {
    const isSaved = savedMovies.some(
      (item) => item.id === movie.id
    );

    return (
      <article className="movie-card" key={movie.id}>
        <div className="poster-container">
          <img
            src={movie.image || getPoster(movie.title)}
            alt={movie.title}
            className="movie-poster"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = getPoster(movie.title);
            }}
          />

          <button
            className={`save-btn ${isSaved ? "saved" : ""}`}
            onClick={() => toggleSave(movie)}
            aria-label={
              isSaved ? "Remove from watchlist" : "Save movie"
            }
          >
            <Bookmark size={18} />
          </button>

          <div className="poster-overlay">
            <button
              className="view-btn"
              onClick={() => findSimilar(movie)}
            >
              <Sparkles size={16} />
              Find Similar
            </button>
          </div>
        </div>

        <div className="movie-info">
          <div className="movie-title-row">
            <h3>{movie.title}</h3>

            <span className="rating">
              <Star size={14} fill="currentColor" />
              {movie.rating ?? "N/A"}
            </span>
          </div>

          <div className="movie-meta">
            <span>{movie.genre || "Movie"}</span>

            {movie.year && (
              <>
                <span>•</span>
                <span>{movie.year}</span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  };

  // Page headings
  const pageTitle = {
    Home: "Discover Movies",
    "Explore Movies": "Explore Movies",
    Hollywood: "Hollywood Movies",
    Bollywood: "Bollywood Movies",
    Kollywood: "Kollywood Movies",
    Trending: "Trending Movies",
    "Now Playing": "Now Playing",
    Upcoming: "Upcoming Movies",
    "My Watchlist": "My Watchlist"
  };

  return (
    <div className="app">
      <Sidebar
        activeItem={activeItem}
        onNavigate={navigate}
      />

      <div className="main-layout">

        {/* Top navigation */}
        <header className="topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={22} />
          </button>

          <div className="topbar-title">
            <span>WELCOME TO CINEMATE</span>
            <h2>
              {pageTitle[activeItem] || "Discover Movies"}
            </h2>
          </div>

          <div className="topbar-right">
            <div className="topbar-watchlist">
              <Bookmark size={17} />
              <span>{savedMovies.length} Saved</span>
            </div>

            <div className="profile-avatar">C</div>
          </div>
        </header>

        {/* Mobile sidebar */}
        {mobileMenuOpen && (
          <div className="mobile-sidebar">
            <Sidebar
              activeItem={activeItem}
              onNavigate={navigate}
            />
          </div>
        )}

        <main className="dashboard">

          {/* Hero section */}
          <section className="hero-banner">
            <div className="hero-overlay"></div>

            <div className="hero-content">
              <span className="hero-tag">
                <Sparkles size={14} />
                YOUR PERSONAL MOVIE COMPANION
              </span>

              <h1>
                Every movie has a story.
                <br />
                <span>Find yours.</span>
              </h1>

              <p>
                Discover amazing movies from around the world.
                Find your next favourite with Cinemate.
              </p>

              <a href="#movie-library" className="hero-button">
                Explore Movies <ArrowRight size={17} />
              </a>
            </div>
          </section>

          {/* Similar movie recommendations */}
          {(selectedMovie || loadingRecommendations) && (
            <section
              className="content-section"
              id="recommendations"
            >
              <div className="section-heading">
                <div>
                  <span className="section-label">
                    POWERED BY TMDB
                  </span>

                  <h2>Similar to {selectedMovie}</h2>

                  <p>
                    Discover movies related to your selection.
                  </p>
                </div>

                <Sparkles
                  className="heading-icon"
                  size={25}
                />
              </div>

              {loadingRecommendations && (
                <p className="status-message">
                  Finding movies you'll love...
                </p>
              )}

              {recommendationError && (
                <p className="error-message" role="alert">
                  {recommendationError}
                </p>
              )}

              {!loadingRecommendations &&
                recommendations.length > 0 && (
                  <div className="movie-grid">
                    {recommendations.map(renderMovieCard)}
                  </div>
                )}
            </section>
          )}

          {/* Movie library */}
          <section
            className="content-section"
            id="movie-library"
          >
            <div className="section-heading">
              <div>
                <span className="section-label">
                  EXPLORE YOUR WORLD
                </span>

                <h2>
                  {pageTitle[activeItem] || "Discover Movies"}
                </h2>

                <p>
                  Find something amazing to watch today.
                </p>
              </div>

              <span className="movie-count">
                {filteredMovies.length} Movies
              </span>
            </div>

            {/* Search */}
            <div className="search-container">
              <Search size={19} />

              <input
                type="text"
                placeholder="Search for a movie..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}

            {/* Loading and movie cards */}
            {loadingMovies ? (
              <p className="status-message">
                Loading movies...
              </p>
            ) : filteredMovies.length > 0 ? (
              <>
                <div className="movie-grid">
                  {filteredMovies.map(renderMovieCard)}
                </div>

                {/* Load More button */}
                {activeItem !== "My Watchlist" && hasMore && (
                  <div className="load-more-container">
                    <button
                      className="load-more-btn"
                      onClick={loadMoreMovies}
                      disabled={loadingMore}
                    >
                      {loadingMore
                        ? "Loading Movies..."
                        : "Load More Movies"}
                      {!loadingMore && <ArrowRight size={17} />}
                    </button>
                  </div>
                )}

                {!hasMore && activeItem !== "My Watchlist" && (
                  <p className="end-message">
                    You've reached the end of the available movies.
                  </p>
                )}
              </>
            ) : (
              <div className="empty-state">
                <Clapperboard size={38} />

                <h3>No movies found</h3>

                <p>
                  {activeItem === "My Watchlist"
                    ? "Save movies using the bookmark icon to see them here."
                    : "Try another search or explore a different category."}
                </p>
              </div>
            )}
          </section>

          {/* Cinemate information */}
          <section className="recommendation-banner">
            <div className="banner-icon">
              <Sparkles size={26} />
            </div>

            <div>
              <span className="section-label">
                SMART MOVIE DISCOVERY
              </span>

              <h2>
                Let Cinemate find your next favourite.
              </h2>

              <p>
                Select a movie and discover similar movies
                using TMDB recommendations.
              </p>
            </div>

            <Play
              size={25}
              className="banner-arrow"
            />
          </section>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-logo">
              <Clapperboard size={20} />
              CINEMATE
            </div>

            <p>
              Made for movie lovers. Discover stories worth watching.
            </p>

            <span>
              This product uses the TMDB API but is not endorsed
              or certified by TMDB.
            </span>

            <span>© 2026 Cinemate</span>
          </footer>

        </main>
      </div>
    </div>
  );
}

export default App;

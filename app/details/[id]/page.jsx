"use client";

import React, { useEffect, useState } from "react";
import { fetchMovieData } from "@/src/utils/fetchMovieData";
import { FaBookmark } from "react-icons/fa";
import { FaImdb } from "react-icons/fa"; // IMDb Icon
import { useParams } from "next/navigation";
import "@/styles/details.css";
import movieSet from "@/data/data.json";
import ButtonN from "@/src/components/but";
import Card from "@/src/components/Card";
import AOS from 'aos';

function Details() {
  const { id: movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [collection, setCollection] = useState([]);
  const [collectionName, setCollectionName] = useState("");

  useEffect(() => {
    if (!movieId) {
      setError("Movie ID is missing");
      return;
    }
    
    const movie = movieSet.find((m) => m.imdb_id === movieId);
    if (movie && movie.collection.trim() !== "") {
      setCollectionName(movie.collection.trim());
    }
  }, [movieId]);

  useEffect(() => {
    if (collectionName) {
      const relatedMovies = movieSet.filter(
        (m) => m.collection === collectionName && m.imdb_id !== movieId
      );
      setCollection(relatedMovies.map((m) => m.imdb_id));
    }
  }, [collectionName]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const data = await fetchMovieData(movieId);
        setMovie(data);
        checkIfFavorite(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovie();
    AOS.refresh();
  }, [movieId]);

  const checkIfFavorite = (movie) => {
    if (!movie) return;
    let storedFavorites = JSON.parse(localStorage.getItem("Favorite")) || [];
    setIsFavorite(storedFavorites.some(item => item.movie_id === movie.imdbID));
  };

  const handleFavoriteClick = () => {
    if (!movie) return;

    setLoading(true);
    setTimeout(() => {
      let storedFavorites = JSON.parse(localStorage.getItem("Favorite")) || [];
      if (isFavorite) {
        storedFavorites = storedFavorites.filter(item => item.movie_id !== movie.imdbID);
      } else {
        storedFavorites.push({
          movie_id: movie.imdbID,
          genre: movie.Genre,
          movie_name: movie.Title,
        });
      }
      localStorage.setItem("Favorite", JSON.stringify(storedFavorites));
      setIsFavorite(!isFavorite);
      setLoading(false);
    }, 4000);
  };

  return (
    <div className="container" style={{ color: "#ffffff" }}>
      {error ? (
        <p className="error-message">{error}</p>
      ) : movie ? (
        <div className="innerContainer">
          <div
            className="details-background"
            style={{ backgroundImage: `url(${movie.Poster})` }}
          />
          <div className="details-content">
            <div
              className="movieBackground"
              style={{ backgroundImage: `url(${movie.Poster})` }}
            />
            <div className="details-info">
              <h1>{movie.Title} ({movie.Year})</h1>
              <p>by <b>{movie.Director}</b></p>
              <p className="plot">{movie.Plot}</p>

              <div className="genres">
                {movie.Genre.split(", ").map((gen, index) => (
                  <span key={index} className="genre">{gen}</span>
                ))}
              </div>

              <div className="movie-metrics">
                <p><FaImdb size={28} style={{ color: "#f5c518" }} /> {movie.imdbRating}/10</p>
                <p><b>Rated:</b> {movie.Rated}</p>
                <p><b>Box Office:</b> {movie.BoxOffice}</p>
              </div>

              <h3>Cast:</h3>
              <div className="cast-grid">
                {movie.Actors.split(", ").map((actor, index) => (
                  <span key={index} className="cast-box">{actor}</span>
                ))}
              </div>

              <button className="fav-btn" onClick={handleFavoriteClick} disabled={loading}>
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <FaBookmark size={20} />
                    {isFavorite ? " Remove from Favorites" : " Add to Favorites"}
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Related Movies Section */}
          {collection.length > 0 && (
            <div className="recommendations2">
              <h1>More like this</h1>
              <div className="RecommendSection">
                {collection.map((id, index) => (
                  <Card key={index} movieId={id} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="loading-message">Loading...</p>
      )}
    </div>
  );
}

export default Details;

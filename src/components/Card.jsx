"use client";  // ✅ Ensures this is a client-side component

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaImdb, FaBookmark, FaCheck, FaPlus } from 'react-icons/fa';
import AOS from 'aos';
import styles from '@/styles/Card.css';
import { fetchMovieData } from '@/src/utils/fetchMovieData';

import '@fortawesome/fontawesome-free/css/all.min.css';

function Card({ movieId }) {
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const data = await fetchMovieData(movieId);
        if (data) {
          setMovie(data);
          checkIfFavorite(data);
        }
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

    setIsFavorite(prev => !prev);
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
  };

  const shortenName = (movieName) => movieName?.length >= 50 ? movieName.slice(0, 50) + "..." : movieName;

  return (
    <div className="card" data-aos="fade-out">
      <div
        className="card-background"
        style={{
          backgroundImage: movie?.Poster ? `url(${movie.Poster})` : 'none'
        }}
      />

      <div className="Watchlist-icon" onClick={handleFavoriteClick}>
        {isFavorite ? (
          <div className="icon-container">
            <FaBookmark style={{ position: "absolute", top: "-3px", left: "-7px", filter: "drop-shadow(0 8px 8px rgba(15, 15, 15, 0.73))" }} size={"50px"} color="#f5c518" />
            <FaCheck className="tick-icon" size={"13px"} color="#1133aa" />
          </div>
        ) : (
          <div className="icon-container">
            <FaBookmark style={{ position: "absolute", top: "-3px", left: "-7px" }} size={"50px"} color="rgba(15, 15, 15, 0.73)" />
            <FaPlus className="tick-icon" size={"13px"} color="white" />
          </div>
        )}
      </div>

      <Link href={`/details/${movieId}`} className="card-content">
        {movie && (
          <div className="info">
            <h2 style={{ fontSize: "17px", fontWeight: "normal", color: "yellow", marginTop: "10px" }}>{movie?.Year}</h2>
            <br />
            <p style={{ fontSize: "12px" }}><strong>Director:</strong> {movie?.Director}</p>
            <br />
          </div>
        )}
      </Link>

      <div className="movieName">
        {movie && (
          <>
            <div className="ratingSection">
              <p style={{ fontSize: "15px" }}>
                <FaImdb style={{ color: "yellow" }} /> {movie?.imdbRating || "N/A"}
              </p>
            </div>
            <h2 style={{ fontSize: "12px" }}>{shortenName(movie?.Title)}</h2>
          </>
        )}
      </div>
    </div>
  );
}

export default Card;

"use client";  // ✅ Ensures this is a client-side component

import React, { useState, useEffect } from "react";
import { fetchMovieData } from '@/src/utils/fetchMovieData';
import { FaHeart, FaRegHeart, FaImdb, FaBookmark, FaCheck, FaPlus } from 'react-icons/fa';
import AOS from 'aos';
import styles from '@/styles/Card.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Card2({ movieId }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const data = await fetchMovieData(movieId);
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovie();
    AOS.refresh();
  }, [movieId]);



  const shortenName = (movieName) => movieName.length >= 50 ? movieName.slice(0, 50) + "..." : movieName;

  return (
    <div className="card" data-aos="fade-out">
      {loading ? (
        <div className="noResults">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          <div
            className="card-background"
            style={{
              backgroundImage: movie ? `url(${movie.Poster})` : 'none'
            }}
          />

          <div  className="card-content">
            {movie && (
              <div className="info">
                <h2 style={{ fontSize: "17px", fontWeight: "normal", color: "yellow", marginTop: "10px" }}>{movie.Year}</h2>
                <br />
                <p style={{ fontSize: "12px" }}><strong>Director:</strong> {movie.Director}</p>
                <br />
              </div>
            )}
          </div>

          <div className="movieName">
            <div className="ratingSection">
              <p style={{ fontSize: "15px" }}><FaImdb style={{ color: "yellow" }} /> {movie.imdbRating}</p>
            </div>
            <h2 style={{ fontSize: "12px" }}>{shortenName(movie.Title)}</h2>
          </div>
        </>
      )}
    </div>
  );
}

export default Card2;

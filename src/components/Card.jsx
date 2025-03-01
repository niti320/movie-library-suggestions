"use client";  // ✅ Ensures this is a client-side component

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Databases, ID, Query } from "appwrite";
import { client, account } from "@/lib/appwrite";
import { fetchMovieData } from '@/src/utils/fetchMovieData';
import { FaHeart, FaRegHeart, FaImdb, FaBookmark, FaCheck, FaPlus } from 'react-icons/fa';
import AOS from 'aos';
import styles from '@/styles/Card.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Card({ movieId }) {
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const favoritesCollection = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_FAVORITES;


  const getUserId = async () => {
    try {
      const user = await account.get();
      return user.$id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };


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


  const checkIfFavorite = async (movie) => {
    if (!movie) return;

    let storedFavorites = JSON.parse(localStorage.getItem("Favorite")) || [];

    if (storedFavorites.length === 0) {
      const userId = await getUserId();
      if (!userId) return;

      try {
        const response = await databases.listDocuments(databaseId, favoritesCollection);
        storedFavorites = response.documents;
        localStorage.setItem("Favorite", JSON.stringify(storedFavorites));
      } catch (error) {
        console.error("Error fetching favorites from Appwrite:", error);
      }
    }

    setIsFavorite(storedFavorites.some(item => item.movie_id === movie.imdbID));
  };


  const databases = new Databases(client);

  const handleFavoriteClick = async () => {
    setLoading(true);
    setIsFavorite(prev => !prev);

    await new Promise((resolve) => setTimeout(resolve, 4000));
    setLoading(false);

    if (!movie) return;

    const userId = await getUserId();
    if (!userId) return;

    try {
      if (isFavorite) {
        const response = await databases.listDocuments(databaseId, favoritesCollection, [
          Query.equal("movie_id", movie.imdbID),
          Query.equal("user_id", userId),
        ]);

        if (response.documents.length > 0) {
          const documentId = response.documents[0].$id;
          await databases.deleteDocument(databaseId, favoritesCollection, documentId);
        }
      } else {

        await databases.createDocument(databaseId, favoritesCollection, ID.unique(), {
          user_id: userId,
          movie_id: movie.imdbID,
          genre: movie.Genre,
          movie_name: movie.Title,
        });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      setIsFavorite(prev => !prev);
    }
  };

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

          {/* <div className="Favorite-icon" onClick={handleFavoriteClick}>
            {isFavorite ? (
              <p style={{ fontSize: "15px", display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                <FaHeart size={"18px"} color="#2299ee" /> Liked
              </p>
            ) : (
              <p style={{ fontSize: "15px", display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
                <FaRegHeart size={"18px"} color="#FFF" />
              </p>
            )}
          </div> */}

          {/* ✅ Using Next.js Link for navigation */}
          <Link href={`/details/${movieId}`} className="card-content">
            {movie && (
              <div className="info">
                <h2 style={{ fontSize: "17px", fontWeight: "normal", color: "yellow", marginTop: "10px" }}>{movie.Year}</h2>
                <br />
                <p style={{ fontSize: "12px" }}><strong>Director:</strong> {movie.Director}</p>
                <br />
              </div>
            )}
          </Link>

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

export default Card;

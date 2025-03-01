"use client";

import React, { useEffect, useState } from "react";
import { fetchMovieData } from "@/src/utils/fetchMovieData";
import { FaBookmark } from "react-icons/fa";
import { FaImdb } from "react-icons/fa"; // IMDb Icon
import { useParams } from "next/navigation";
import { Databases, ID, Query } from "appwrite";
import { client, account } from "@/lib/appwrite";
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

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const favoritesCollection = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_FAVORITES;
  // const watchlistCollection = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_WATCHLIST;

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

              {/* Genre Section */}
              <div className="genres">
                {movie.Genre.split(", ").map((gen, index) => (
                  <span key={index} className="genre">{gen}</span>
                ))}
              </div>

              {/* IMDb Rating, Year, Box Office */}
              <div className="movie-metrics">
                <p><FaImdb size={28} style={{ color: "#f5c518" }} /> {movie.imdbRating}/10</p>
                <p><b>Rated:</b> {movie.Rated}</p>
                <p><b>Box Office:</b> {movie.BoxOffice}</p>
              </div>

              {/* Cast Grid */}
              <h3>Cast:</h3>
              <div className="cast-grid">
                {movie.Actors.split(", ").map((actor, index) => (
                  <span key={index} className="cast-box">{actor}</span>
                ))}
              </div>

              {/* Favorite Button */}
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

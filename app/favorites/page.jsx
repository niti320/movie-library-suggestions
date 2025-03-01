"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/App.css";
import Card from "@/src/components/Card";
import AOS from "aos";
import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Change if needed
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const database = new Databases(client);

function Favorite() {
  const [favorite, setFavorite] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 500, easing: "ease-in-out", once: true });
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_FAVORITES,
        [Query.limit(100)]
      );
      setFavorite(response.documents);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortByRating = () => {
    setFavorite((prevFavorite) =>
      [...prevFavorite].sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0))
    );
  };

  return (
    <div className="container" style={{ flexDirection: "column" }}>
      <div className="miniContainer" style={{ flexDirection: "column" }}>


        {loading ? (
          <h2 style={{ color: "white" }}>Loading...</h2>
        ) : favorite.length > 0 ? (
          <div className="gridContainer" data-aos="fade-up">
            {favorite.map((movie) => (
              <Card key={movie.$id} movieId={movie.movie_id} />
            ))}
          </div>
        ) : (
          <div className="noResults">
            <h2 style={{ color: "white" }}>No Favorites yet</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorite;

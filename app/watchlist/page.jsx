"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/App.css";
import Card from "@/src/components/Card";
import AOS from "aos";
import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Update if needed
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const database = new Databases(client);

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 500, easing: "ease-in-out", once: true });
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await database.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_WATCHLIST,
        [Query.limit(100)]
      );
      setWatchlist(response.documents);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortByRating = () => {
    setWatchlist((prevWatchlist) =>
      [...prevWatchlist].sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0))
    );
  };

  return (
    <div className="container" style={{ flexDirection: "column" }}>
      <div className="miniContainer" style={{ flexDirection: "column" }}>
        {watchlist.length > 0 && <button onClick={sortByRating}>Sort</button>}

        {loading ? (
          <h2 style={{ color: "white" }}>Loading...</h2>
        ) : watchlist.length > 0 ? (
          <div className="gridContainer" data-aos="fade-up">
            {watchlist.map((movie) => (
              <Card key={movie.$id} movieId={movie.movie_id} />
            ))}
          </div>
        ) : (
          <div className="noResults">
            <h2 style={{ color: "white" }}>No Watchlist yet</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchlist;

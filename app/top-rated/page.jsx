"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/App.css";

// import Header from "./Header";
import AOS from "aos";
import Card from "@/src/components/Card";

const topMovies = [
  { imdbID: "tt0111161", Title: "The Shawshank Redemption" },
  { imdbID: "tt0068646", Title: "The Godfather" },
  { imdbID: "tt0468569", Title: "The Dark Knight" },
  { imdbID: "tt0071562", Title: "The Godfather: Part II" },
  { imdbID: "tt0050083", Title: "12 Angry Men" },
  { imdbID: "tt0108052", Title: "Schindler's List" },
  { imdbID: "tt0167260", Title: "The Lord of the Rings: The Return of the King" },
  { imdbID: "tt0110912", Title: "Pulp Fiction" },
  { imdbID: "tt0120737", Title: "The Lord of the Rings: The Fellowship of the Ring" },
  { imdbID: "tt0060196", Title: "The Good, the Bad and the Ugly" },
  { imdbID: "tt0137523", Title: "Fight Club" },
  { imdbID: "tt0109830", Title: "Forrest Gump" },
  { imdbID: "tt0167261", Title: "The Lord of the Rings: The Two Towers" },
  { imdbID: "tt0080684", Title: "Star Wars: Episode V - The Empire Strikes Back" },
  { imdbID: "tt0073486", Title: "One Flew Over the Cuckoo's Nest" },
  { imdbID: "tt0047478", Title: "Seven Samurai" },
  { imdbID: "tt0102926", Title: "The Silence of the Lambs" },
  { imdbID: "tt0038650", Title: "It's a Wonderful Life" },
  { imdbID: "tt0120815", Title: "Saving Private Ryan" },
  { imdbID: "tt0110413", Title: "Léon: The Professional" },
  { imdbID: "tt0317248", Title: "City of God" },
  { imdbID: "tt0114369", Title: "Se7en" },
  { imdbID: "tt0064116", Title: "Once Upon a Time in the West" },
  { imdbID: "tt0034583", Title: "Casablanca" },
  { imdbID: "tt0076759", Title: "Star Wars: Episode IV - A New Hope" },
  { imdbID: "tt0118799", Title: "Life Is Beautiful" },
  { imdbID: "tt0816692", Title: "Interstellar" },
  { imdbID: "tt0027977", Title: "Modern Times" },
  { imdbID: "tt0120689", Title: "The Green Mile" },
  { imdbID: "tt0245429", Title: "Spirited Away" },
  { imdbID: "tt6751668", Title: "Parasite" },
  { imdbID: "tt0253474", Title: "The Pianist" }
];


function TopRatedMovies() {
  const [topRated, setTopRated] = useState(topMovies);

  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,   
      easing: 'ease-in-out',  
      once: true,   
    });
  }, []);
  useEffect(() => {
      
    try {
      setTopRated(topMovies);
      setError(null);
    } catch (error) {
      console.error("Error fetching top-rated movies:", error);
      setError("Error fetching top-rated movies. Please try again.");
    }
  }, []);


  return (
    <div className="container" style={{ flexDirection: "column" }}>
      <h1 style={{ color: "white", marginBottom: "20px" }}>Top Rated Movies</h1>
      <div className="miniContainer" >
       


        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="gridContainer" data-aos="fade-up">
          {topRated.length > 0 ? (
            topRated.map((movie) => (
              <Card key={movie.imdbID} movieId={movie.imdbID} />
            ))
          ) : (
            <div className="noResults">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopRatedMovies;

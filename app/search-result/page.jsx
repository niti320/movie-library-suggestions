"use client";
import React, { useState, useEffect } from "react";
import AOS from 'aos';
import { useRouter } from "next/navigation";
import Card from "@/src/components/Card";

function SearchResult() {
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY; 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false); 

  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 500, easing: 'ease-in-out', once: true });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("query"); 
      if (query) {
        setSearchTerm(query.trim());
        handleSearchSubmit(query.trim()); 
      }
    }
  }, []);

  const handleSearchSubmit = async (query) => {
  if (!query) return;

  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    const data = await response.json();
    if (data.Response === "True") {
      setMovies(data.Search);
      setError(null);
      setNotFound(false);
    } else {
      setMovies([]);
      setError(null);
      setNotFound(true);
    }
  } catch (error) {
    console.error("Error:", error);
    setError("Something went wrong. Please try again.");
    setNotFound(false);
  }
};


  return (
    <div className="container">
      <div className="miniContainer">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="gridContainer" data-aos="fade-up">
          {notFound ? (
            <h1 style={{ color: "white", fontSize: "30px" }}>Movies not found</h1>
          ) : movies.length > 0 ? (
            movies.map((movie) => <Card key={movie.imdbID} movieId={movie.imdbID} />)
          ) : (
            <div className="loading-spinner"></div>
          )}
        </div>
      </div>
    </div>
  );
}}

export default SearchResult;

"use client";
import React, { useState, useEffect } from "react";
import styles from "@/styles/App.css"; 
import AOS from 'aos';
import { useSearchParams } from "next/navigation";
import Card from "@/src/components/Card";

function SearchResult() {
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY; 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);

  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false); 
  const searchParams = useSearchParams();


  useEffect(() => {
    AOS.init({
      duration: 500, 
      easing: 'ease-in-out', 
      once: true, 
    });
  }, []);

  useEffect(() => {
    const query = searchParams.get('query'); 
    if (query) {
      setSearchTerm(query.trim());
      handleSearchSubmit(query.trim()); 
    }
  }, [searchParams]);

  const handleSearchChange = (event) => {
    let searchValue = event.target.value;
    setSearchTerm(searchValue);
  };

  const handleSearchSubmit = async (query) => {
    if (!query) return;

    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(data.Search);
        setError(null);
        setNotFound(false); 
      } else if (data.Response === "False" && data.Error === "Movie not found!") {
        setMovies([]);
        setError(null);
        setNotFound(true); 
      } else {
        setMovies([]);
        setError(data.Error);
        setNotFound(false); 
      }
    } catch (error) {
      console.error("Error aa gaya yaha pe:", error);
      setError("Error aya hai dubara try karein.");
      setNotFound(false); 
    }
  };


  return (
    <div className="container">
      <div className="miniContainer">
       
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="gridContainer" data-aos="fade-up">
          {notFound ? (
            <div className="noResults">
              <h1 style={{color: "white", fontSize: "30px"}}>Movies not found</h1>
            </div>
          ) : (
            movies.length > 0 ? (
              movies.map((movie) => (
                <Card key={movie.imdbID} movieId={movie.imdbID}/>
              ))
            ) : (
              <div className="noResults">
                <div className="loading-spinner"></div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResult;

"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import "@/styles/HomePage.css";
import movieSet from "@/data/data.json";
import recomMovie from "@/ml/recommendations.json";
import styles from "@/styles/App.css";
import Card from "@/src/components/Card";
import Card2 from "@/src/components/card2";
import { account } from "@/lib/appwrite";
import { Databases, Query } from "appwrite";
import { client } from "@/lib/appwrite";
import Link from "next/link";
import ButtonN from "@/src/components/but";

function HomePage() {
  const [userGenre, setUserGenre] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCollection, setUserCollection] = useState([]);
  const [listedMovies, setListedMovies] = useState([]);
  const [SuggestedMovies, setSuggestedMovies] = useState([]);
  const [suggesttedMovieId, setSuggestedMovieId] = useState([]);
  const sectionRefs = useRef({});
  const unloggedMovies =
    ["tt0468569", // The Dark Knight
      "tt0099685", // Goodfellas
      "tt0075314", // Taxi Driver
      "tt6751668", // Parasite
      "tt0086879", // Amadeus
      "tt0068646", // The Godfather
      "tt0137523", // Fight Club
      "tt0110912", // Pulp Fiction
      "tt0816692"  // Interstellar
    ];


  const Favorite = useMemo(() => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("Favorite")) || [];
  }
  return [];
}, []);


  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const user = await account.get();
        setLoggedInUser(user);
      } catch (err) {
        // setLoggedInUser(null);
      }
      setLoading(false); 
    };
    checkLoggedInUser();
    fetchAndStoreUserData();

  }, []);


  console.log("Favorites: ", Favorite);

  useEffect(() => {
    if (!Favorite.length) return;

    const genreCount = Favorite.reduce((acc, movie) => {
      const genres = movie.genre.split(",").map((genre) => genre.trim());
      genres.forEach((genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
      });
      return acc;
    }, {});

    const sortedGenres = Object.entries(genreCount).sort(
      ([, countA], [, countB]) => countB - countA
    );

    const topGenres = sortedGenres.slice(0, 2).map(([genre]) => genre);

    setUserGenre((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(topGenres)) {
        return topGenres;
      }
      return prev;
    });
  }, [Favorite]);

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const favTitles = Favorite.map((movie) => movie.movie_name.trim());
    console.log("Favorites Titles - ", favTitles);

    const newRecommendations = new Set();

    favTitles.forEach((title) => {
      if (recomMovie[title]) {
        recomMovie[title].forEach((movie) => newRecommendations.add(movie));
      }
    });

    const shuffledRecommendations = shuffleArray([...newRecommendations]);

    setSuggestedMovies(shuffledRecommendations);
  }, [Favorite, recomMovie]);

  console.log("Suggested-Movies", SuggestedMovies);

  useEffect(() => {
    const newSuggestedMovieIds = [];

    SuggestedMovies.forEach((title) => {
      const matchedMovie = movieSet.find((movie) => movie.title === title);
      if (matchedMovie) {
        newSuggestedMovieIds.push(matchedMovie.imdb_id);
      }
    });

    setSuggestedMovieId(newSuggestedMovieIds);
  }, [SuggestedMovies, movieSet]);

  console.log("Suggested-Movies-Id", suggesttedMovieId);

  useEffect(() => {
    if (!userGenre.length) return;

    const favoriteIds = Favorite.map((movie) => movie.movie_id);
    let recommendedMovies = [];
    let count = 0;

    for (let i = 0; i < movieSet.length; i++) {
      const arrayGenre = movieSet[i].genre.split(",").map((genre) => genre.trim());

      const isBothGenresMatch =
        userGenre.length === 2 && userGenre.every((genre) => arrayGenre.includes(genre));

      const isNotInFavorites = !favoriteIds.includes(movieSet[i].imdb_id);

      if (isBothGenresMatch && isNotInFavorites) {
        recommendedMovies.push(movieSet[i].imdb_id);
        count++;
      }

      if (count >= 5) break;
    }

    if (count < 5) {
      for (let i = 0; i < movieSet.length; i++) {
        const arrayGenre = movieSet[i].genre.split(",").map((genre) => genre.trim());

        const isSingleGenreMatch = arrayGenre.some((genre) => userGenre.includes(genre));
        const isNotInFavorites = !favoriteIds.includes(movieSet[i].imdb_id);

        if (isSingleGenreMatch && isNotInFavorites && !recommendedMovies.includes(movieSet[i].imdb_id)) {
          recommendedMovies.push(movieSet[i].imdb_id);
          count++;
        }

        if (count >= 5) break;
      }
    }

    setListedMovies((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(recommendedMovies)) {
        return recommendedMovies;
      }
      return prev;
    });
  }, [userGenre, Favorite]);

  useEffect(() => {
    const collectionsMap = {};

    if (Favorite.length) {
      for (let i = 0; i < Favorite.length; i++) {
        const favoriteId = Favorite[i].movie_id;

        for (let key in movieSet) {
          const movie = movieSet[key];

          if (movie.imdb_id === favoriteId && movie.collection && movie.collection.trim() !== "") {
            const collectionName = movie.collection.trim();

            if (!collectionsMap[collectionName]) {
              collectionsMap[collectionName] = [];
            }

            if (!collectionsMap[collectionName].includes(favoriteId)) {
              collectionsMap[collectionName].push(favoriteId);
            }

            for (let key in movieSet) {
              const movieInCollection = movieSet[key];

              if (movieInCollection.collection === collectionName && !collectionsMap[collectionName].includes(movieInCollection.imdb_id)) {
                collectionsMap[collectionName].push(movieInCollection.imdb_id);
              }
            }
          }
        }
      }
    }

    setUserCollection((prev) => {
      const newCollections = collectionsMap;
      if (JSON.stringify(prev) !== JSON.stringify(newCollections)) {
        return newCollections;
      }
      return prev;
    });

    console.log("CollectionMap: ", collectionsMap);
  }, [Favorite, movieSet]);

  console.log("User Collection: ", userCollection);
  console.log("userGenre: ", userGenre);

  const handleMouseDown = (e, sectionName) => {
    e.preventDefault();
    const slider = sectionRefs.current[sectionName];
    slider.isDown = true;
    slider.startX = e.pageX;
    slider.scrollLeftAtStart = slider.scrollLeft;
  };

  const handleMouseMove = (e, sectionName) => {
    e.preventDefault();
    const slider = sectionRefs.current[sectionName];
    if (!slider.isDown) return;
    const x = e.pageX - slider.startX;

  
    const speedFactor = 2; 
    slider.scrollLeft = slider.scrollLeftAtStart - x * speedFactor;
  };

  const handleMouseUpOrLeave = (sectionName) => {
    const slider = sectionRefs.current[sectionName];
    slider.isDown = false;
  };

  const databases = new Databases(client);

  const fetchAndStoreUserData = async () => {
    try {
      const user = await account.get();
      if (!user) return;

      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
      const favoritesCollection = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_FAVORITES;
      // const watchlistCollection = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_WATCHLIST;


      const [favResponse] = await Promise.all([
        databases.listDocuments(databaseId, favoritesCollection, [Query.equal("user_id", user.$id)]),
      ]);

    
      localStorage.setItem("Favorite", JSON.stringify(favResponse.documents));
    } catch (error) {
      // console.error("Error fetching user data:", error);
    }
  };


  return (
    <div className="homePageContainer">

      <div className="backgroundimage">
        {!loading && !loggedInUser && ( 
          <Link
            style={{
              display: "flex",
              backgroundColor: "#22ee99",
              border: "none",
              color: "black",
              height: "50px",
              alignItems: "center",
              width: "150px",
              justifyContent: "center",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "30px",
              padding: "2px 10px",
              cursor: "pointer",
            }}
            href="/login"
          >
            Login
          </Link>
        )}

        <div className="TextBox">
          <h1>
            Add movies to your Favorites
            <br />
            See Suggestions
            <br />
            Based on Similarity, Genre, and Collection.
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="recommendations">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        loggedInUser ? (
          <div className="innerLayer">
            {SuggestedMovies.length > 0 && (
              <div className="recommendations">
                <h1>Based on your likings</h1>
                <div
                  className="RecommendSection"
                  ref={(ref) => (sectionRefs.current["SuggestedMovies"] = ref)}
                  onMouseDown={(e) => handleMouseDown(e, "SuggestedMovies")}
                  onMouseMove={(e) => handleMouseMove(e, "SuggestedMovies")}
                  onMouseUp={() => handleMouseUpOrLeave("SuggestedMovies")}
                  onMouseLeave={() => handleMouseUpOrLeave("SuggestedMovies")}
                >
                  {suggesttedMovieId.map((mov, index) => (
                    <Card key={index} movieId={mov} />
                  ))}
                </div>
              </div>
            )}
            {listedMovies.length > 0 && (
              <div className="recommendations2">
                <p>Based on your</p> <h1 >Most loved Genres</h1>
                <div style={{ display: "flex", gap: "10px" }}>{userGenre.map((gen, index) => <p key={index} style={{
                  padding: "5px",
                  backgroundColor: "#ffffff18"
                }}
                >{gen}</p>)}</div>
                <div
                  className="RecommendSection"
                  ref={(ref) => (sectionRefs.current["listedMovies"] = ref)}
                  onMouseDown={(e) => handleMouseDown(e, "listedMovies")}
                  onMouseMove={(e) => handleMouseMove(e, "listedMovies")}
                  onMouseUp={() => handleMouseUpOrLeave("listedMovies")}
                  onMouseLeave={() => handleMouseUpOrLeave("listedMovies")}
                >
                  {listedMovies.map((mov, index) => (
                    <Card key={index} movieId={mov} />
                  ))}
                </div>
              </div>
            )}

            {Object.keys(userCollection).map((collectionName) => (
              <div className="recommendations2" key={collectionName}>
                <p>Because you liked a movie similar to</p>
                <h1>{collectionName}</h1>
                <div
                  className="RecommendSection"
                  ref={(ref) => (sectionRefs.current[collectionName] = ref)}
                  onMouseDown={(e) => handleMouseDown(e, collectionName)}
                  onMouseMove={(e) => handleMouseMove(e, collectionName)}
                  onMouseUp={() => handleMouseUpOrLeave(collectionName)}
                  onMouseLeave={() => handleMouseUpOrLeave(collectionName)}
                >
                  {userCollection[collectionName].map((movieId, index) => (
                    <Card key={index} movieId={movieId} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="innerLayer">

            <div className="recommendations">
              {/* <h1>Great Movies</h1> */}
              <div
                className="RecommendSection"
                ref={(ref) => (sectionRefs.current["SuggestedMovies"] = ref)}
                onMouseDown={(e) => handleMouseDown(e, "SuggestedMovies")}
                onMouseMove={(e) => handleMouseMove(e, "SuggestedMovies")}
                onMouseUp={() => handleMouseUpOrLeave("SuggestedMovies")}
                onMouseLeave={() => handleMouseUpOrLeave("SuggestedMovies")}
              >
                {unloggedMovies.map((mov, index) => (
                  <Card2 key={index} movieId={mov} />
                ))}
              </div>
            </div>
          </div>
        )
      )

      }


    </div>
  );
}



export default HomePage;


export const fetchMovieData = async (movieId) => {
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY; 
  try {
    const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`);
    const data = await response.json();
    
    if (data.Response === "True") {
      return data;
    } else {
      throw new Error(data.Error);
    }
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return null;
  }
};

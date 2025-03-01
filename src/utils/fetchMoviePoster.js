export const fetchMoviePoster = async (movieId) => {
  try {
    const response = await fetch(`https://img.omdbapi.com/?i=${movieId}&apikey=apikery`);
    
    if (!response.ok) { // Check if response is OK (status 200)
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.Response === "True") {
      return data;
    } else {
      throw new Error(data.Error);
    }
  } catch (error) {
    console.error("Error fetching movie poster:", error);
    return null;
  }
};

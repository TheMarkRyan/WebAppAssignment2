const apiKey = "7194ca2f7febb4e3e714c7390912b48f";
const baseUrl = "https://api.themoviedb.org/3";


// Fetch favorite movies
export const fetchFavoriteMovies = async (accountId, sessionId) => {
  const url = `${baseUrl}/account/${accountId}/favorite/movies?api_key=${apiKey}&session_id=${sessionId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch favorite movies.");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Toggle favorite status
export const toggleFavorite = async (accountId, sessionId, movieId, isFavorite) => {
  const url = `${baseUrl}/account/${accountId}/favorite?api_key=${apiKey}&session_id=${sessionId}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_type: "movie",
      media_id: movieId,
      favorite: isFavorite,
    }),
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Failed to update favorite status.");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Fetch genres
export const getGenres = async () => {
  const url = `${baseUrl}/genre/movie/list?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch genres.");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getMovieReviews = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  const url = `${baseUrl}/movie/${id}/reviews?api_key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch movie reviews.");
  return await response.json();
};

// Fetch movie images
export const getMovieImages = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  const url = `${baseUrl}/movie/${id}/images?api_key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch movie images.");
  }
  return await response.json();
};

// Fetch movie details
export const getMovie = async ({ queryKey }) => {
  const [, { id }] = queryKey;
  console.log("Fetching movie details for ID:", id); // Debugging log
  const url = `${baseUrl}/movie/${id}?api_key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch movie details.");
  return await response.json();
};

// Fetch upcoming movies
export const getUpcomingMovies = async () => {
  const url = `${baseUrl}/movie/upcoming?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch upcoming movies.");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Fetch trending movies
export const getTrendingMovies = async () => {
  const url = `${baseUrl}/trending/movie/week?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch trending movies.");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Fetch latest movie
export const getLatestMovies = async () => {
  const url = `${baseUrl}/movie/latest?api_key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch latest movie.");
  return await response.json();
};

// Fetch top-rated movies
export const getTopRatedMovies = async () => {
  const url = `${baseUrl}/movie/top_rated?api_key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch top-rated movies.");
  return await response.json();
};

export const getMoviesByGenre = async (genreId, sortBy = "popularity.desc") => {
  const url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&sort_by=${sortBy}&include_adult=false&include_video=false&language=en-US`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch movies by genre.");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getMovies = async (sortBy = "popularity.desc", authToken) => {
  const url = `${baseUrl}/discover/movie?api_key=${apiKey}&sort_by=${sortBy}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to fetch movies.");
  }
  return await response.json();
};

// Fetch actor by name
export const getActorByName = async (actorName) => {
  const url = `${baseUrl}/search/person?api_key=${apiKey}&query=${actorName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch actor.");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getRecommendedMovies = async (movieId) => {
  const response = await fetch(
    `${baseUrl}/movie/${movieId}/recommendations?api_key=${apiKey}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
  }
  return await response.json();
};

export const getSimilarMovies = async (movieId) => {
  const response = await fetch(
    `${baseUrl}/movie/${movieId}/similar?api_key=${apiKey}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch similar movies: ${response.statusText}`);
  }
  return await response.json();
};

export const getMoviesByActor = async (actorName) => {
  const url = `${baseUrl}/search/person?api_key=${apiKey}&query=${actorName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch movies by actor.");
    const data = await response.json();

    // Check if the actor exists and has known movies
    const actor = data.results[0];
    if (!actor || !actor.id) {
      return { results: [] }; // Return an empty array if no actor is found
    }

    // Fetch combined credits (movies and TV shows) using the actor ID
    const creditsUrl = `${baseUrl}/person/${actor.id}/combined_credits?api_key=${apiKey}`;
    const creditsResponse = await fetch(creditsUrl);
    if (!creditsResponse.ok) throw new Error("Failed to fetch actor credits.");

    const creditsData = await creditsResponse.json();

    // Filter only movies from the combined credits
    const movies = creditsData.cast.filter((credit) => credit.media_type === "movie");

    return { results: movies };
  } catch (error) {
    console.error(error);
    return { results: [] }; // Return an empty array in case of an error
  }
};

// Get movies for a specific actor by ID
export const getMoviesByActorId = async (actorId) => {
  const url = `${baseUrl}/person/${actorId}/combined_credits?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch movies for actor.");
    const data = await response.json();
    // Filter to get only movies (not TV shows)
    return data.cast.filter((credit) => credit.media_type === "movie");
  } catch (error) {
    console.error(error);
  }
};

// Function to search for an actor
export const searchActor = async (actorName) => {
  const url = `${baseUrl}/search/person?api_key=${apiKey}&query=${actorName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch actor.");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Function to get movies an actor has appeared in
export const getActorMovies = async (actorId) => {
  const url = `${baseUrl}/person/${actorId}/movie_credits?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch actor's movies.");
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getPopularActors = async () => {
  const url = `${baseUrl}/person/popular?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch popular actors.");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getActorDetails = async (actorId) => {
  const url = `${baseUrl}/person/${actorId}?api_key=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch actor details');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const login = async (username, password) => {
  const url = `http://localhost:8080/api/users?action=login`;  // Correct API URL
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to login.");
  }

  return await response.json();
};

export const signup = async (username, password) => {
  const url = `http://localhost:8080/api/users?action=register`;  // Correct API URL
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to signup.");
  }

  return await response.json();
};

export const updateProfile = async (formData) => {
  const response = await fetch('http://localhost:8080/api/users/profile', {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update profile.');
  }

  return await response.json();
};

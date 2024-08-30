import fetch from 'node-fetch';

export const getUpcomingMovies = async () => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
        );

        if (!response.ok) {
            throw new Error(response.json().message);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getGenres = async () => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch genres from TMDB API');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching genres:', error.message);
        throw error;
    }
};


// Login function
export const login = async (username, password) => {
    const url = `${authApiUrl}?action=login`;
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
  
  // Signup function
  export const signup = async (username, password) => {
    const url = `${authApiUrl}?action=register`;
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

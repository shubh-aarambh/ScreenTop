const OMDB_API_URL = "https://www.omdbapi.com/";

// OMDB Search Movie Type
export interface OmdbMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

// OMDB Movie Details Type
export interface OmdbMovieDetails extends OmdbMovie {
  Plot: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Ratings: { Source: string; Value: string }[];
  Runtime: string;
  Released: string;
  imdbRating: string;
  Rated: string;
  Language: string;
  Country: string;
  Awards: string;
  Website?: string;
  [key: string]: any;
}

// Search movies with improved error handling
export async function searchMovies(query: string, apiKey: string) {
  try {
    // Skip empty queries
    if (!query || query.trim() === '') {
      console.error('Empty search query');
      return { results: [] };
    }
    
    // Sanitize the query
    const sanitizedQuery = query.trim();
    
    // Set up the API parameters
    const params = new URLSearchParams({ 
      s: sanitizedQuery, 
      apikey: apiKey,
      r: 'json' // Force JSON response format
    });
    
    // Make the request
    const response = await fetch(`${OMDB_API_URL}?${params.toString()}`);
    
    // Check if the request was successful
    if (!response.ok) {
      console.error(`OMDB API request failed with status: ${response.status}`);
      return { results: [] };
    }
    
    // Parse the response
    const data = await response.json();
    
    // Check for API errors
    if (data.Response === "False") {
      console.log(`OMDB API returned no results: ${data.Error || 'Unknown error'}`);
      return { results: [] };
    }
    
    // Return the results
    return {
      results: data.Search as OmdbMovie[],
    };
  } catch (error) {
    console.error('Error searching OMDB:', error);
    return { results: [] };
  }
}

// Get detailed info about a movie with improved error handling
export async function getMovieDetails(imdbID: string, apiKey: string): Promise<OmdbMovieDetails | null> {
  try {
    // Skip empty IDs
    if (!imdbID || imdbID.trim() === '') {
      console.error('Empty IMDB ID');
      return null;
    }
    
    // Set up the API parameters
    const params = new URLSearchParams({ 
      i: imdbID, 
      plot: "full", 
      apikey: apiKey,
      r: 'json' // Force JSON response format
    });
    
    // Make the request
    const response = await fetch(`${OMDB_API_URL}?${params.toString()}`);
    
    // Check if the request was successful
    if (!response.ok) {
      console.error(`OMDB API details request failed with status: ${response.status}`);
      return null;
    }
    
    // Parse the response
    const data = await response.json();
    
    // Check for API errors
    if (data.Response === "False") {
      console.log(`OMDB API returned no details: ${data.Error || 'Unknown error'}`);
      return null;
    }
    
    // Return the results
    return data as OmdbMovieDetails;
  } catch (error) {
    console.error('Error getting movie details from OMDB:', error);
    return null;
  }
}

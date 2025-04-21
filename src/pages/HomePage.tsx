import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import MovieGrid from '@/components/MovieGrid';
import { useApiKeys } from '@/contexts/ApiKeyContext';
import { analyzeMoviePrompt } from '@/services/geminiService';
import { searchMovies, OmdbMovie } from '@/services/omdbService';
import { toast } from 'sonner';

const HomePage = () => {
  const [movies, setMovies] = useState<OmdbMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { geminiApiKey, omdbApiKey } = useApiKeys();

  // Function to extract keywords from a natural language query
  const extractKeywords = (query: string): string[] => {
    // Split the query into words and filter out common words
    const words = query.toLowerCase().split(/\s+/);
    const commonWords = ['a', 'an', 'the', 'and', 'but', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'like', 'than'];
    
    return words
      .filter(word => word.length > 2 && !commonWords.includes(word)) // Keep only meaningful words
      .map(word => word.replace(/[^\w\s]/g, '')); // Remove punctuation
  };

  // Function to make multiple search attempts
  const tryMultipleSearches = async (query: string): Promise<OmdbMovie[]> => {
    // 1. Try the original query first
    console.log("Trying original query:", query);
    let searchResults = await searchMovies(query, omdbApiKey);
    
    if (searchResults.results.length > 0) {
      return searchResults.results;
    }
    
    // 2. Extract keywords and try different combinations
    const keywords = extractKeywords(query);
    console.log("Extracted keywords:", keywords);
    
    // Try each keyword individually
    for (const keyword of keywords) {
      if (keyword.length < 3) continue; // Skip very short words
      
      console.log("Trying keyword:", keyword);
      searchResults = await searchMovies(keyword, omdbApiKey);
      
      if (searchResults.results.length > 0) {
        return searchResults.results;
      }
    }
    
    // 3. Try pairs of keywords if there are multiple
    if (keywords.length >= 2) {
      for (let i = 0; i < keywords.length; i++) {
        for (let j = i + 1; j < keywords.length; j++) {
          const keywordPair = `${keywords[i]} ${keywords[j]}`;
          console.log("Trying keyword pair:", keywordPair);
          
          searchResults = await searchMovies(keywordPair, omdbApiKey);
          
          if (searchResults.results.length > 0) {
            return searchResults.results;
          }
        }
      }
    }
    
    // 4. Try reversing word order for two-word queries
    const words = query.split(' ');
    if (words.length === 2) {
      const reversedQuery = `${words[1]} ${words[0]}`;
      console.log("Trying reversed query:", reversedQuery);
      
      searchResults = await searchMovies(reversedQuery, omdbApiKey);
      
      if (searchResults.results.length > 0) {
        return searchResults.results;
      }
    }
    
    // Return empty array if all attempts failed
    return [];
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchTerm(query);
    setMovies([]);

    try {
      // Try to analyze the prompt with Gemini
      const analysis = await analyzeMoviePrompt(query, geminiApiKey);

      // If Gemini analysis succeeds, use the refined search query
      if (analysis.success && analysis.data) {
        const searchQuery = analysis.data.searchQuery;
        console.log("Using Gemini refined query:", searchQuery);
        const searchResults = await searchMovies(searchQuery, omdbApiKey);
        
        if (searchResults.results.length > 0) {
          setMovies(searchResults.results);
          setIsLoading(false);
          return;
        }
        
        // Try using the extracted keywords from Gemini
        if (analysis.data.keywords && analysis.data.keywords.length > 0) {
          console.log("Trying Gemini keywords:", analysis.data.keywords);
          for (const keyword of analysis.data.keywords) {
            const keywordResults = await searchMovies(keyword, omdbApiKey);
            if (keywordResults.results.length > 0) {
              setMovies(keywordResults.results);
              setIsLoading(false);
              return;
            }
          }
        }
      }

      // If Gemini fails or returns no results, try multi-strategy search as fallback
      console.log("Falling back to multi-strategy search");
      toast.info("Using smart search to find movies");
      
      const allResults = await tryMultipleSearches(query);
      
      if (allResults.length === 0) {
        toast.error("No movies found. Try a different description.");
        setIsLoading(false);
        return;
      }
      
      setMovies(allResults);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center mb-12">
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-30" />
        <div className="hero-gradient" />
        
        <div className="container-custom relative z-10 py-20 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 max-w-3xl">
            Find Your Perfect Movie Match
          </h1>
          <p className="text-lg md:text-xl text-center text-muted-foreground mb-10 max-w-2xl">
            Describe the movie you're looking for in natural language, and we'll find it for you.
          </p>
          <div className="hero-search">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </section>

      <section className="container-custom pb-20">
        {searchTerm && !isLoading && movies.length > 0 && (
          <div className="mb-8">
            <h2 className="section-title">Results for "{searchTerm}"</h2>
            <MovieGrid movies={movies} isLoading={isLoading} />
          </div>
        )}

        {searchTerm && !isLoading && movies.length === 0 && (
          <div className="text-center py-12">
            <h2 className="section-title">No results found for "{searchTerm}"</h2>
            <p className="text-muted-foreground mt-4">
              Try a different description or be more specific about the type of movie you're looking for.
            </p>
          </div>
        )}

        {!searchTerm && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Try searching for something like "Interstellar but funnier" or "Something like The Godfather but set in modern times"
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default HomePage;


import React from 'react';
import { OmdbMovie } from '@/services/omdbService';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: OmdbMovie[];
  isLoading: boolean;
}

const MovieGrid = ({ movies, isLoading }: MovieGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-lg bg-muted animate-pulse h-[300px]"></div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No movies found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;

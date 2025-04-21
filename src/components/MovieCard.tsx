
import React from 'react';
import { Link } from 'react-router-dom';
import { OmdbMovie } from '@/services/omdbService';
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: OmdbMovie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const { imdbID, Title, Year, Poster } = movie;

  // If image is not available, use a placeholder
  const imageUrl = Poster && Poster !== "N/A" ? Poster : 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

  return (
    <Link to={`/movie/${imdbID}`} className="movie-card group">
      <div className="aspect-[2/3] w-full relative overflow-hidden rounded-lg">
        <img 
          src={imageUrl} 
          alt={Title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="movie-card-content">
          <div className="space-y-1">
            <h3 className="font-bold text-lg line-clamp-2">{Title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{Year}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;

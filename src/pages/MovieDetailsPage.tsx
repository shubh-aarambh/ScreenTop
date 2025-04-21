import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, OmdbMovieDetails } from '@/services/omdbService';
import { useApiKeys } from '@/contexts/ApiKeyContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Clock, Film, ArrowLeft, Play } from 'lucide-react';
import { toast } from 'sonner';

const MovieDetailsPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<OmdbMovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { omdbApiKey } = useApiKeys();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId || !omdbApiKey) return;

      setIsLoading(true);
      try {
        const details = await getMovieDetails(movieId, omdbApiKey);
        setMovie(details);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        toast.error("Failed to load movie details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, omdbApiKey]);

  if (isLoading) {
    return (
      <div className="container-custom py-20">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 aspect-[2/3] bg-muted animate-pulse rounded-lg"></div>
          <div className="w-full md:w-2/3 space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded w-3/4"></div>
            <div className="h-6 bg-muted animate-pulse rounded w-1/4"></div>
            <div className="h-24 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  const imageUrl = movie.Poster && movie.Poster !== "N/A"
    ? movie.Poster
    : 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

  return (
    <div className="pb-20">
      <div className="relative w-full h-[50vh]">
        <div className="absolute inset-0 bg-cover bg-center" style={{
          backgroundImage: `url(${imageUrl})`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
          opacity: 0.3
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="container-custom relative h-full flex items-end pb-10">
          <Link to="/" className="absolute top-8 left-4 md:left-8">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowLeft size={16} />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{movie.Title} <span className="text-muted-foreground">({movie.Year})</span></h1>
        </div>
      </div>

      <div className="container-custom mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <div className="rounded-lg overflow-hidden shadow-xl mb-6">
              <img
                src={imageUrl}
                alt={movie.Title}
                className="w-full object-cover"
              />
            </div>

            <div className="space-y-4">
              {movie.imdbRating && (
                <div className="flex items-center gap-2">
                  <Star className="text-secondary fill-secondary" size={20} />
                  <span className="font-bold text-lg">{movie.imdbRating}/10</span>
                  <span className="text-muted-foreground">IMDb Rating</span>
                </div>
              )}

              {movie.Runtime && (
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-muted-foreground" />
                  <span>{movie.Runtime}</span>
                </div>
              )}

              {movie.Rated && (
                <div className="inline-block px-2 py-1 bg-muted rounded text-sm">
                  {movie.Rated}
                </div>
              )}

              {movie.Genre && (
                <div className="flex flex-wrap gap-2">
                  {movie.Genre.split(',').map((genre) => (
                    <span key={genre.trim()} className="px-3 py-1 rounded-full bg-accent text-sm">
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              )}

              {movie.Released && (
                <div>
                  <span className="text-muted-foreground">Released: </span>
                  <span>{movie.Released}</span>
                </div>
              )}

              {movie.Director && (
                <div>
                  <span className="text-muted-foreground">Director: </span>
                  <span>{movie.Director}</span>
                </div>
              )}

              {movie.Writer && (
                <div>
                  <span className="text-muted-foreground">Writer: </span>
                  <span>{movie.Writer}</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-2/3 space-y-8">
            {movie.Awards && (
              <p className="text-lg italic text-muted-foreground">{movie.Awards}</p>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.Plot}</p>
            </div>

            {movie.Actors && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.Actors.split(',').map((actor) => (
                    <span key={actor.trim()} className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      {actor.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;

import { useEffect, useState } from 'react';
import './App.css';
import SearchIcon from './search.svg';
import MovieDetails from './MovieDetails';
import MovieCard from './MovieCard';

const API_URL = 'https://www.omdbapi.com/?apikey=2108cd70';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchMovies = async (title, page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}&s=${title}&page=${page}`);
      const data = await response.json();
      
      if (data.Response === 'True') {
        setMovies(data.Search);
        setTotalResults(parseInt(data.totalResults));
      } else {
        setError(data.Error);
        setMovies([]);
      }
    } catch (err) {
      setError('Failed to fetch movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    searchMovies(searchTerm);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    searchMovies(searchTerm, newPage);
  };

  useEffect(() => {
    searchMovies('Avengers');
  }, []);

  return (
    <div className="app">
      <h1>MovieHub</h1>

      <form className="search" onSubmit={handleSearch}>
        <input
          placeholder="Search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </form>

      {loading && <div className="loader">Loading...</div>}

      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="container">
            {movies?.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              disabled={page >= Math.ceil(totalResults / 10)}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default App;
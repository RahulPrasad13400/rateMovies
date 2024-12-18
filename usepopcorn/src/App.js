import { useEffect, useState } from "react";
import StarRating from './starRating'
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '9c48fda1'

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading,setIsLoading] = useState(false )
  const [error,setError] = useState("")
  const [selectedId, setSelectedId] = useState(null)

  function handleAddWatched(movie){
    setWatched((watched)=> [...watched,movie])
  }

  function handleSelectMovie(id){
    setSelectedId(selectedId => id === selectedId ? null : id)
  }

  function handleCloseMovie(){
    setSelectedId(null)
  }

  function deleteWatched(id){
    setWatched(watched=>watched.filter(movie => id !== movie.imdbID))
  }

  useEffect(function(){
    const controller = new AbortController()
    async function fetchMovie() {
      try{
        setIsLoading(true)
        setError('')
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal:controller.signal})
        if(!res.ok) throw new Error("Something went wrong")
        const data = await res.json()
        if(data.Response === "false") throw new Error("Movie not Found")
        setMovies(data.Search)
        setIsLoading(false)
        setError("")
      }catch(err){
        console.log(err.name)
        if(err.name !== "AbortError"){
          setError(err.message)
        }
      }finally{
        setIsLoading(false)
      }

    }
    handleCloseMovie()
    fetchMovie()
    return function(){
      controller.abort()
    }
  },[query])
  return <>
      <Navbar>
          <Search query={query} setQuery={setQuery} />
          <Numresults movies={movies} />
      </Navbar>
      <Main>
        {/* <Box element={ <MovieList movies={movies} />} /> */}
          <Box>
              {/* {isLoading ? <Loader /> :<MovieList movies={movies} />} */}
              {isLoading && <Loader />}
              {error && <Error message={error}/>}
              {!error && !isLoading && <MovieList  movies={movies} onHandleSelectMovie={handleSelectMovie}/>}
          </Box>
          {/* <Box element={<><WatchedSummary watched={watched}/>  */}
          {/* <WatchedMovieList watched={watched}/></>}/> */}
          <Box>
              {selectedId ? <MovieDetails watched={watched} onAddWatched={handleAddWatched} selectedId={selectedId} onCloseMovie={handleCloseMovie}/> :
              <>
                <WatchedSummary watched={watched}/>
                <WatchedMovieList watched={watched} onDeleteWatch={deleteWatched}/>
              </>
}
          </Box>
      </Main>


    </>
}

function MovieDetails({selectedId, onCloseMovie, onAddWatched ,watched}){
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')
  console.log(watched)
  const isWatched = watched.map((movie)=>movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find(movie=>movie.imdbID === selectedId)?.userRating
  const {
    Title : title, Year : year, Poster : poster, Runtime : runtime, imdbRating, Plot : plot, Released : released, Actors : actors,  Director : director, Genre : genre } = movie
  function handleAdd(){
    const newWatchedMovie = {
      imdbID : selectedId,
      imdbRating,
      title,
      runtime:Number(runtime.split(' ').at(0)),
      year,
      poster,
      userRating
    }
    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }
  useEffect(function(){
    function callback(e){
      if(e.code === 'Escape'){
        onCloseMovie()
      }
    }
    document.addEventListener('keydown',callback)
    return function(){
      document.removeEventListener('keydown',callback)
    }
  },[onCloseMovie])
  useEffect(function(){
    async function getMovieDetails(){
      try{
        setIsLoading(true)
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
        if(!res.ok) throw new Error("something went wrong")
        const data = await res.json()
        setIsLoading(false)
        setMovie(data)
      }catch(err){
        console.log(err)
      }finally{
        setIsLoading(false)
      }

    }
    getMovieDetails()
    }
  ,[selectedId])

  useEffect(function(){
    if(!title) return
    document.title = `${title}`

    return function(){
      document.title = `usePopcorn`
    }
  },[title])

  return <div className="details">
    {isLoading ? <Loader /> : <>
    <header>
    <img src={poster} alt={`poster of ${movie} movie`}/>
    <div className="details-overview">
      <h2>{title}</h2>
      <p>{released} &bull; {runtime }</p>
      <p>⭐<span>{imdbRating} IMDb Rating</span></p>
    </div>
    </header>
    <section>
      <div className="rating">
    {!isWatched ?  <> <StarRating maxRating={10} size={24} onSetTestRate={setUserRating} />
      {userRating>0 && <button className="btn-add" onClick={handleAdd}>Add to list</button>}
      </> : <p>You rated {watchedUserRating}</p>}
      </div>
      <p><em>{plot}</em></p>
      <p>Starring {actors}</p>
      <p>Directed by {director}</p>
      
    </section>
    <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
    </>}
    </div>

}

function Loader(){
  return <div>
    <p className="loader">Loading...</p>
  </div>
}

function Error({message}){
  return <p>{message}</p>
}

function Navbar({children}){
  return <nav className="nav-bar">
  <Logo />
  {children}
</nav> 
}

function Logo(){
  return  <div className="logo">
  <span role="img">🍿</span>
  <h1>usePopcorn</h1>
</div>
}

function Search({query,setQuery}){
  return  <input
  className="search"
  type="text"
  placeholder="Search movies..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
}

function Numresults({movies}){
  return  <p className="num-results">
  Found <strong>{movies ? movies.length : ''}</strong> results
</p>
}

function Main({children}){
  return <main className="main">
    {children}
</main>
}



function MovieList({movies, onHandleSelectMovie}){
  return  <ul className="list list-movies">
  {movies?.map((movie) => (
    <Movie movie={movie} key={movie.imdbID} onHandleSelectMovie={onHandleSelectMovie}/>
  ))}
</ul>
}

function Movie({movie, onHandleSelectMovie}){
  return  <li onClick={()=>onHandleSelectMovie(movie.imdbID)}>
  <img src={movie.Poster} alt={`${movie.Title} poster`} />
  <h3>{movie.Title}</h3>
  <div>
    <p>
      <span>🗓</span>
      <span>{movie.Year}</span>
    </p>
  </div>
</li>
}

function Box({children}){
  const [isOpen, setIsOpen] = useState(true);
  return   <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
  >
    {isOpen ? "–" : "+"}
  </button>
  {isOpen && children }
</div>
}

function WatchedSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return  <div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐️</span>
      <span>{avgImdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime} min</span>
    </p>
  </div>
</div>
}

function WatchedMovieList({watched, onDeleteWatch}){
  return  <ul className="list">
  {watched.map((movie) => ( <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatch={onDeleteWatch}/> ))}
</ul>
}

function WatchedMovie({movie, onDeleteWatch}){
  return  <li key={movie.imdbID}>
  <img src={movie.poster} alt={`${movie.title} poster`} />
  <h3>{movie.title}</h3>
  <div>
    <p>
      <span>⭐️</span>
      <span>{movie.imdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{movie.userRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{movie.runtime} min</span>
    </p>
    <button className="btn-delete" onClick={()=>onDeleteWatch(movie.imdbID)}>X</button>
  </div>
</li>
}
import { useState, useEffect } from "react";
const KEY = '9c48fda1'

export function useMovie(query, callback){
    const [movies, setMovies] = useState([]);
    const [isLoading,setIsLoading] = useState(false )
    const [error,setError] = useState("")
    useEffect(function(){
        // callback?.()
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
        // handleCloseMovie()
        fetchMovie()
        return function(){
          controller.abort()
        }
      },[query])
      return {movies,error,isLoading}
}
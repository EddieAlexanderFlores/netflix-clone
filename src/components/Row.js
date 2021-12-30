import React, { useEffect, useState } from 'react';
import axios from '../axios';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import './Row.css';

const base_url = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // A snippet of code which runs based on a specific condition/variable.
    useEffect(() => {
        // if [], run once when the row loads and don't run again.
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            //console.log(request.data.results);
            return request;
        }

        fetchData();
    }, [fetchUrl]);

    //console.log(movies);

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1     // automatically play video
        }
    };

    const handleClick = (movie) => {
        //console.log("movie: ", movie);

        if (trailerUrl) {           // if there's a trailerUrl (video is playing) then ...
            setTrailerUrl('');      // clear trailerUrl (video closes). This happens when image is clicked a second time.
        } else {
            let movieUrl1 = null;
            let movieUrl2 = null;

            // find a movie trailer by the movie name and the url.
            // ex: https://www.youtube.com/watch?v=JfVOs4VSpmA  then get the v value from the url.
            movieTrailer(movie?.original_name || movie?.name || movie?.original_title || movie?.title)
            .then(response => movieUrl1 = response);

            movieTrailer(null, {tmdbId: movie.id})
            .then(response => movieUrl2 = response);

            // wait a little for variables movieUrl1 and movieUrl2 to be updated then set TrailerUrl.
            setTimeout(() => {
                if (movieUrl1 !== null) {
                    const url = new URL(movieUrl1);
                    const searchParams = new URLSearchParams(url.search);
                    const search = searchParams.get('v');
                    setTrailerUrl(search);

                    /*console.log("movieUrl1", movieUrl1);
                    console.log(url);
                    console.log(url.search);
                    console.log(searchParams);
                    console.log(search);*/
                    
                } else {
                    const url = new URL(movieUrl2);
                    const searchParams = new URLSearchParams(url.search);
                    const search = searchParams.get('v');
                    setTrailerUrl(search);

                    /*console.log("movieUrl2", movieUrl2);
                    console.log(url);
                    console.log(url.search);
                    console.log(searchParams);
                    console.log(search);*/
                }
            }, 250);
        }
    };

    const clearTrailerUrl = () => {
        setTrailerUrl('');
    }

    return (
        <div className='row'>
            <h2 className='row-title'>{title}</h2>

            <div className='row-posters'>
                {/* several row_posters */}
                {movies.map(movie => (
                    <div className='row-poster-container'>
                        <img 
                            key={movie.id}
                            onClick={() => handleClick(movie)}
                            className={`row-poster ${isLargeRow && "row-poster-large"}`}
                            src={`${base_url}${isLargeRow ? movie?.poster_path : movie?.backdrop_path}`}
                            alt={movie.name} 
                        />
                        {!isLargeRow && 
                            <h3 className='row-poster-title'>
                                {movie?.name || movie?.original_name || movie?.title || movie?.original_title}
                            </h3>
                        }
                    </div>
                ))}
            </div>

            {/* when we have trailer Url, then show youtube video */}
            {trailerUrl && 
                <>
                    <button className='youtube-close-button' onClick={() => clearTrailerUrl()}>Close</button>
                    <YouTube videoId={trailerUrl} opts={opts} />
                </>
            }
        </div>
    )
}

export default Row;

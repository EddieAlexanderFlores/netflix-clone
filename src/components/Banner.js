import React, { useEffect, useState } from 'react';
import axios from '../axios';
import requests from '../requests';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import './Banner.css';

function Banner() {
    const [movie, setMovie] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [playButtonText, setPlayButtonText] = useState("Play");

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(requests.fetchNetflixOriginals);
            setMovie(
                request.data.results[
                    Math.floor(Math.random() * request.data.results.length - 1)
                ]
            );

            return request;
        }

        fetchData();
    }, [])

    //console.log("movie", movie);

    function truncate(str, n) {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    }

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1     // automatically play video
        }
    };

    const handleClick = (movie) => {
        //console.log(movie);

        if (trailerUrl) {           // if there's a trailerUrl (video is playing) then ...
            setTrailerUrl('');      // clear trailerUrl (video closes). This happens when image is clicked a second time.
            setPlayButtonText("Play");
        } else {
            setPlayButtonText("Stop");

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
                    
                } else if (movieUrl2 !== null) {
                    const url = new URL(movieUrl2);
                    const searchParams = new URLSearchParams(url.search);
                    const search = searchParams.get('v');
                    setTrailerUrl(search);

                    /*console.log("movieUrl2", movieUrl2);
                    console.log(url);
                    console.log(url.search);
                    console.log(searchParams);
                    console.log(search);*/
                } else {
                    setPlayButtonText("Play");
                }
            }, 250);
        }
    }

    return (
        <header className='banner'
            style={{
                backgroundSize: "cover",
                backgroundImage: `url(
                    "https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
                )`,
                backgroundPosition: "top"
            }}>

            <div className='banner-contents'>
                <h1 className='banner-title'>
                    {movie?.original_name || movie?.name || movie?.original_title || movie?.title}
                </h1>

                <div className='banner-buttons'>
                    <button className='banner-button' onClick={() => handleClick(movie)}>{playButtonText}</button>
                    <button className='banner-button'>My List</button>
                </div>
                
                <p className='banner-description'>
                    {truncate(movie?.overview, 150)}
                </p>
            </div>

            <div className='banner-fade-bottom' />

            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </header>
    )
}

export default Banner;

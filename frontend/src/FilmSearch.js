import React, { useState } from "react";
import filmTitles from "./film_titles.json";

function FilmSearch() {
    const [film, setFilm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [posters, setPosters] = useState({});
    const [suggestionPosters, setSuggestionPosters] = useState({});
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

    const handleChange = async (e) => {
        const input = e.target.value;
        setFilm(input);
        setHighlightedIndex(-1);

        if (input.length > 0) {
            const matches = filmTitles.filter(title =>
                title.toLowerCase().includes(input.toLowerCase())
            ).slice(0, 5);

            setSuggestions(matches);

            const newPosters = {};
            for (let title of matches) {
                if (!suggestionPosters[title]) {
                    const queryTitle = title.replace(/\(.*?\)(?=\s*$)/, "").trim();
                    const res = await fetch(
                        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(queryTitle)}`
                    );
                    const data = await res.json();
                    newPosters[title] = data.results[0]?.poster_path
                        ? `https://image.tmdb.org/t/p/w92${data.results[0].poster_path}`
                        : null;
                }
            }
            setSuggestionPosters(prev => ({ ...prev, ...newPosters }));
        } else {
            setSuggestions([]);
        }
    };

    const handleKeyDown = (e) => {
        if (suggestions.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    selectFilm(suggestions[highlightedIndex]);
                } else {
                    selectFilm(film);
                }
            }
        } else if (e.key === "Enter" && film.trim()) {
            e.preventDefault();
            selectFilm(film);
        }
    };

    const selectFilm = (title) => {
        if (!title || title.trim() === "") return;
        setFilm(title);
        setSuggestions([]);
        setNoResults(false);
        setHasSearched(true);
        getRecommendations(title);
    };

    const getRecommendations = async (selectedFilm) => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/recommend?film=${encodeURIComponent(selectedFilm)}`
            );
            const data = await response.json();
            const recs = data.recommendations || [];
            if (recs.length === 0) {
                setNoResults(true);
            } else {
                setNoResults(false);
            }

            const formatTitleForTMDb = (title) => {
                let formatted = title.replace(/\(.*?\)(?=\s*$)/, "").trim();
                formatted = formatted.replace(/['"]/g, "");
                return formatted;
            };

            const posterAndRatingPromises = recs.map(async (title) => {
                const queryTitle = formatTitleForTMDb(title);
                const tmdbRes = await fetch(
                    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(queryTitle)}`
                );
                const tmdbData = await tmdbRes.json();
                if (tmdbData.results && tmdbData.results[0]) {
                    const poster = tmdbData.results[0].poster_path
                        ? `https://image.tmdb.org/t/p/w200${tmdbData.results[0].poster_path}`
                        : null;
                    const rating = tmdbData.results[0].vote_average ?? null;
                    return [title, { poster, rating }];
                } else {
                    return [title, { poster: null, rating: null }];
                }
            });

            const posterAndRatingArray = await Promise.all(posterAndRatingPromises);
            const posterAndRatingObj = Object.fromEntries(posterAndRatingArray);
            setPosters(posterAndRatingObj);

            setRecommendations(recs);

        } catch (error) {
            console.error("Error fetching recommendations:", error);
            setNoResults(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="film-recommender-wrapper">
            <h1 className="film-recommender-title">Film Recommender</h1>
            <p>Enter a film you like and get suggestions of similar films</p>
            <div className="film-input-wrapper">
                <input
                    type="text"
                    placeholder="Enter a film"
                    value={film}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="user-film-input"
                />
                <button
                    className="submit-button"
                    onClick={() => selectFilm(film)}
                    disabled={!film.trim()}
                >
                    Search
                </button>
            </div>
            {suggestions.length > 0 && (
                <ul className="user-film-autocomplete">
                    {suggestions.map((title, index) => (
                        <li
                            className={`autocomplete-item ${index === highlightedIndex ? "highlighted" : ""}`}
                            key={index}
                            onClick={() => selectFilm(title)}
                        >
                            {suggestionPosters[title] && (
                                <img src={suggestionPosters[title]} alt={title} style={{ width: '50px', marginRight: '8px' }} />
                            )}
                            <p className="autocomplete-item-title">{title}</p>
                        </li>
                    ))}
                </ul>
            )}
            <section className="recommendations-section">
                {hasSearched && <h2 className="recommendations-title">Recommendations</h2>}
                {loading ? (
                    <div className="loading-spinner"></div>
                ) : noResults ? (
                    <p className="no-results-message">No films found for "{film}"</p>
                ) : (
                    <ul className="recommendations-list">
                        {recommendations.map((title, index) => (
                            <li className="recommendation-item" key={index}>
                                {posters[title]?.poster && <img src={posters[title].poster} alt={title} />}
                                <p className="recommendation-item-title">{title}</p>
                                {posters[title]?.rating !== null && (
                                    <p className="recommendation-item-rating">Rating: {posters[title].rating.toFixed(1)}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default FilmSearch;

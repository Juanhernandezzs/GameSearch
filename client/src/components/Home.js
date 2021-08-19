import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVideogames, getGenres } from "../Actions";
import { Link } from "react-router-dom";
import { useState } from "react";

function Home() {
    const { data, success, error, loading } = useSelector(
        (state) => state.results
    );
    const genres = useSelector(
        (state) => state.genres
    );
    const dispatch = useDispatch();
    const [limit, setLimit] = useState(9);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const [genre, setGenre] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [sort, setSort] = useState('A-Z')
    const [source, setSource] = useState('')

    useEffect(() => {
        setMaxPage(Math.ceil(filteredData.length / limit));
    }, [filteredData, limit]);

    useEffect(() => {
        dispatch(getVideogames());
        dispatch(getGenres())
    }, [dispatch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [limit]);

    useEffect(() => {
        setFilteredData(data.filter(d => !genre || d.genres.indexOf(genre) > -1).filter(d => !source || (source === 'created' ? d.fromDB : !d.fromDB)))
    }, [data, genre, source])

    function applySort(a, b) {
        if (sort === 'A-Z') {
            if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1 }
            if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1 }
            return 0
        } else if (sort === 'Z-A') {
            if (a.name.toLowerCase() > b.name.toLowerCase()) { return -1 }
            if (a.name.toLowerCase() < b.name.toLowerCase()) { return 1 }
            return 0
        } else if (sort === 'Rating-') {
            return a.rating - b.rating
        } else if (sort === 'Rating+') {
            return b.rating - a.rating
        }
        return 0
    }

    return (
        <div className='home'>
            {loading && <div className='loading'></div>}
            {!loading && success && (
                <>
                    <div className='sidebar'>
                        <div>
                            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                                <option value={''}>All Genres</option>
                                {genres.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <select value={source} onChange={(e) => setSource(e.target.value)}>
                                <option value={''}>All Sources</option>
                                <option value={'rawg'}>From Rawg</option>
                                <option value={'created'}>Created</option>
                            </select>
                        </div>
                        <div>
                            <select value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value={'A-Z'}>A-Z</option>
                                <option value={'Z-A'}>Z-A</option>
                                <option value={'Rating+'}>Higher Rating</option>
                                <option value={'Rating-'}>Lower Rating</option>
                            </select>
                        </div>
                        <div>
                            <Link to={'/videogames/create'}>
                                <button className='button button--block'>Add Game</button>
                            </Link>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='pagination'>
                            <div className='paginator'>
                                {!!maxPage &&
                                    [...Array(maxPage)]
                                        .map((el, i) => i + 1)
                                        .filter(
                                            (pageNumber) =>
                                                pageNumber === 1 ||
                                                pageNumber === maxPage ||
                                                pageNumber === currentPage - 1 ||
                                                pageNumber === currentPage - 2 ||
                                                pageNumber === currentPage ||
                                                pageNumber === currentPage + 1 ||
                                                pageNumber === currentPage + 2
                                        )
                                        .map((pageNumber, i) => (
                                            <>
                                            {pageNumber === maxPage && currentPage < (maxPage - 3) && <span>...</span>}
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                    disabled={currentPage === pageNumber}
                                                >
                                                    {pageNumber}
                                                </button>
                                                {pageNumber === 1 && currentPage > 4 && <span>...</span>}
                                            </>
                                        ))}
                            </div>
                            <div className='showitems'>
                                <label>Show: </label>
                                <select value={limit} onChange={(e) => setLimit(e.target.value)}>
                                    <option value={9}>9 Games</option>
                                    <option value={20}>20 Games</option>
                                    <option value={30}>30 Games</option>
                                    <option value={40}>40 Games</option>
                                </select>
                            </div>
                        </div>
                        <div className='cards'>
                            {filteredData &&
                                filteredData.sort(applySort).slice(limit * (currentPage - 1), (limit * currentPage)).map((game) => (
                                    <Link className='gamecard' key={game.id} to={`/videogames/${game.id}`}>
                                        <div className='card__image' style={{ backgroundImage: `url(${game.image || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAACuCAMAAAClZfCTAAAAIVBMVEX19fXd3d3z8/Pq6urb29vi4uLx8fHt7e3n5+fk5OTf39/UY198AAACNElEQVR4nO3a4Y6rIBCGYRUE9P4veO0KijB022xSTOd9zj/Xk9AvMgjOMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgDualrGy+t6juhNXB7Sxofe4bmQVIxqt6z2w25jkhMbR9B7ZbcjzbMNMS3wroqX3yG7DtCJae4+sm+lqEFb8FNFU3qtCaAXyilVDSN7+J6Jx7j3+D2gWnkYkFzrK05OI1sV457wJ2avk9T9b1RHZOduTTcdd19qjOqK13GwEIro+QsJ7tPudbi5f8p3iWiSfe8zS0/bh4fYgRdQ6GRJOAJRGdG7oJx+CyaoSEe2Ot0GfZtZRmer3TJ0RpUVryfJIU6/avqmMKJ14XAqPjRlVR0kqI4qlp3xe4uVyVdMYUfzNVdVJ14koleZ6fd+nWnmurTGiPQlXH5HEha7ITmNETrz6sN9fFCOFEdl9yZeOIve/FGVcY0T7VSLK8BT9Sa5Fwqe0GAa1KO1h6xUtvnWzoqUkqs1Y7HmYiuw0RhR/c7UZW57e/tWqN6C4YTVWjKJ861YZUTouCpeM4gkJO/38McpWNXu0hFRbN50Rnb/arKPd/i3ulZu/l7Aby9uInMu+nAm9WUojanWjSQ1+WiOSMxL7+9RGJPXEyDfqjajqjnXSp1jlEW2z7fzG6OdWo5buiB4NRsGYsDQ61YnoNRoiEg7y36GiFbvZiE5Cp7KZ+g29hw4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIbhB3oYDvixwDtCAAAAAElFTkSuQmCC'})` }}>
                                            <div className='gamecard-content'>
                                                <h4>{game.name}</h4>
                                                <p title={game.genres.join(", ")}>{game.genres.join(", ")}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
// import SearchIcon from '@mui/icons-material/Search';

function SearchBar() {
    const [name, setName] = useState("");
    const [searchResults, setSearchResults] = useState([])
    const [focused, setFocused] = useState(false)

    function handleChange(e) {
        setName(e.target.value);
    }
    async function doSearch() {
        if (name.length > 0) {
            let response = await fetch(`http://localhost:3001/videogames?name=${name}`);
            if (response.status === 200) {
                setSearchResults(await response.json())
            }
        } else {
            setSearchResults([])
        }
    }

    useEffect(() => {
        doSearch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name])

    return (
        <div className='searchbox'>
            <div className="inputdiv">
                <input
                    type="text"
                    placeholder="Search"
                    value={name}
                    onChange={(e) => handleChange(e)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 200)}
                />
                <div className="searchicon">
                    <SearchIcon></SearchIcon>
                </div>
            </div>
            {name.length > 0 && focused && (
                <div className='searchbox__results'>
                    {(searchResults.length > 0 ? searchResults.map(r =>
                        <div key={r.id} className='searchbox__result'>
                            <Link to={`/videogames/${r.id}`} onClick={() => setName('')}>
                                <div className='searchbox__result-image' style={{ backgroundImage: `url(${r.image || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAACuCAMAAAClZfCTAAAAIVBMVEX19fXd3d3z8/Pq6urb29vi4uLx8fHt7e3n5+fk5OTf39/UY198AAACNElEQVR4nO3a4Y6rIBCGYRUE9P4veO0KijB022xSTOd9zj/Xk9AvMgjOMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgDualrGy+t6juhNXB7Sxofe4bmQVIxqt6z2w25jkhMbR9B7ZbcjzbMNMS3wroqX3yG7DtCJae4+sm+lqEFb8FNFU3qtCaAXyilVDSN7+J6Jx7j3+D2gWnkYkFzrK05OI1sV457wJ2avk9T9b1RHZOduTTcdd19qjOqK13GwEIro+QsJ7tPudbi5f8p3iWiSfe8zS0/bh4fYgRdQ6GRJOAJRGdG7oJx+CyaoSEe2Ot0GfZtZRmer3TJ0RpUVryfJIU6/avqmMKJ14XAqPjRlVR0kqI4qlp3xe4uVyVdMYUfzNVdVJ14koleZ6fd+nWnmurTGiPQlXH5HEha7ITmNETrz6sN9fFCOFEdl9yZeOIve/FGVcY0T7VSLK8BT9Sa5Fwqe0GAa1KO1h6xUtvnWzoqUkqs1Y7HmYiuw0RhR/c7UZW57e/tWqN6C4YTVWjKJ861YZUTouCpeM4gkJO/38McpWNXu0hFRbN50Rnb/arKPd/i3ulZu/l7Aby9uInMu+nAm9WUojanWjSQ1+WiOSMxL7+9RGJPXEyDfqjajqjnXSp1jlEW2z7fzG6OdWo5buiB4NRsGYsDQ61YnoNRoiEg7y36GiFbvZiE5Cp7KZ+g29hw4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIbhB3oYDvixwDtCAAAAAElFTkSuQmCC'})` }}>
                                </div>
                                <div>{r.name}</div>
                            </Link>
                        </div>) : 'No results')}
                </div>)}
        </div>
    );
}

export default SearchBar;

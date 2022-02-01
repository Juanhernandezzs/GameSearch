import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getGameDetail } from "../Actions";
import { SpinnerDiamond } from 'spinners-react';
import { Link, useHistory } from "react-router-dom";

function GameDetail() {
    const { data, success, error, loading } = useSelector(
        (state) => state.detail
    );
    const dispatch = useDispatch();
    const { idVideogame } = useParams();
    const history = useHistory()
    const id = data.id

    useEffect(() => {
        dispatch(getGameDetail(idVideogame));
    }, [dispatch, idVideogame]);

    const destroy = async () => {
        await fetch("http://localhost:3001/videogame/" + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        history.push(`/videogames`)
    }


    // const update = async (e) => {
    //     e.preventDefault();
    //     if (validate()) {
    //         await fetch("http://localhost:3001/videogames", {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(input)
    //         })
    //         history.push(`/videogames`)
    //     }
    // }

    return (
        <div className='detailcontent' style={loading ? { height: '80%' } : { display: 'flex' }}>
            {loading && <div className='loading'><SpinnerDiamond color={'#f90021'} secondaryColor={'#f90021'} size={100} /></div>}
            {!loading && error && (
                <>
                    {error === 404 ? <h1 className='error'>Game not found</h1> : <h1 className='error'>Error {error}</h1>}
                </>
            )}
            {!loading && success && (
                <>
                    <div className='gamedetail'>
                        <h1>{data.name}</h1>
                        <p>{data.genres.join(', ')}</p>
                        <img src={data.image || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAACuCAMAAAClZfCTAAAAIVBMVEX19fXd3d3z8/Pq6urb29vi4uLx8fHt7e3n5+fk5OTf39/UY198AAACNElEQVR4nO3a4Y6rIBCGYRUE9P4veO0KijB022xSTOd9zj/Xk9AvMgjOMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgDualrGy+t6juhNXB7Sxofe4bmQVIxqt6z2w25jkhMbR9B7ZbcjzbMNMS3wroqX3yG7DtCJae4+sm+lqEFb8FNFU3qtCaAXyilVDSN7+J6Jx7j3+D2gWnkYkFzrK05OI1sV457wJ2avk9T9b1RHZOduTTcdd19qjOqK13GwEIro+QsJ7tPudbi5f8p3iWiSfe8zS0/bh4fYgRdQ6GRJOAJRGdG7oJx+CyaoSEe2Ot0GfZtZRmer3TJ0RpUVryfJIU6/avqmMKJ14XAqPjRlVR0kqI4qlp3xe4uVyVdMYUfzNVdVJ14koleZ6fd+nWnmurTGiPQlXH5HEha7ITmNETrz6sN9fFCOFEdl9yZeOIve/FGVcY0T7VSLK8BT9Sa5Fwqe0GAa1KO1h6xUtvnWzoqUkqs1Y7HmYiuw0RhR/c7UZW57e/tWqN6C4YTVWjKJ861YZUTouCpeM4gkJO/38McpWNXu0hFRbN50Rnb/arKPd/i3ulZu/l7Aby9uInMu+nAm9WUojanWjSQ1+WiOSMxL7+9RGJPXEyDfqjajqjnXSp1jlEW2z7fzG6OdWo5buiB4NRsGYsDQ61YnoNRoiEg7y36GiFbvZiE5Cp7KZ+g29hw4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIbhB3oYDvixwDtCAAAAAElFTkSuQmCC"} alt="" />
                        <div>
                            <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
                            <p><b>Release date: </b>{data.released || 'Unknown'}</p>
                            <p><b>Rating: </b>{isNaN(data.rating) || data.rating == null ? 'Unknown' : `${data.rating}/5`}</p>
                            <p><b>Platforms: </b>{data.platforms.join(', ')}</p>
                        </div>
                    </div>
                    {data.fromDB && <div className="deleteupdate">
                        <button className="button updatebtn" onClick={() => destroy()}>Delete game</button>
                        <Link
                            to={`/videogames/edit/${data.id}`}
                            style={{ textDecoration: "none" }}
                            className="linkbtn"
                        >
                            <button className="button updatebtn2">Edit game</button>
                        </Link>
                    </div>}
                </>
            )}
        </div>
    );
}

export default GameDetail;

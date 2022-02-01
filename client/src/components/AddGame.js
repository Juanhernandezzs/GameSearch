import React, { useState, useEffect } from "react";
import { getGenres } from "../Actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Rating } from '@material-ui/lab';
import { getGameDetail } from "../Actions";

function AddGame() {
    const dispatch = useDispatch();
    const { data } = useSelector(
        (state) => state.detail
    );
    const platforms = ["PC",
        "PlayStation",
        "Xbox",
        "Apple Macintosh",
        "Nintendo"]
    const [errors, setErrors] = useState({})
    const [input, setInput] = useState({
        name: '',
        description: '',
        genres: [],
        platforms: [],
        image: '',
        rating: 0,
        released: ''
    });
    const [rating, setRating] = useState(0)

    const genres = useSelector(
        (state) => state.genres
    );
    const history = useHistory()

    const { idVideogame } = useParams();

    useEffect(() => {
        if (idVideogame) {
            dispatch(getGameDetail(data.id));
            setInput({
                id: data.id,
                name: data.name,
                description: data.description,
                genres: [],
                platforms: data.platforms,
                image: data.image,
                rating: data.rating,
                released: data.released
            })
        }
        // eslint-disable-next-line
    }, [dispatch]);

    useEffect(() => {
        dispatch(getGenres())
    }, [dispatch]);


    const handleInputChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (e) => {
        let val = isNaN(e.target.value) ? e.target.value : parseInt(e.target.value)
        setInput(currentInput => {
            return {
                ...currentInput,
                [e.target.name]: currentInput[e.target.name].indexOf(val) > -1 ? currentInput[e.target.name].filter(e => e !== val) : [...currentInput[e.target.name], val]
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validate()) {
            if (input.id) {
                await fetch("http://localhost:3001/videogame/" + input.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(input)
                })
                history.push(`/videogames`)
            } else {
                await fetch("http://localhost:3001/videogames", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(input)
                })
                history.push(`/videogames`)
            }
        }
    }

    // const create = async (e) => {
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

    // const update = async (e) => {
    //     e.preventDefault();
    //     if (validate()) {
    //         await fetch("http://localhost:3001/videogames", {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(input)
    //         })
    //         history.push(`/videogames`)
    //     }
    // }

    function validate() {
        let errors = {};
        if (!input.name) {
            errors.name = "Name is required";
        }
        if (!input.description) {
            errors.description = "Must have a description";
        }
        if (!input.genres || !input.genres.length) {
            errors.genres = "You must choose genres";
        }
        if (!input.platforms || !input.platforms.length) {
            errors.platforms = "You must choose platforms";
        }
        if (input.image && input.image.length > 255) {
            errors.image = "Image URL cannot be longer than 255 characters";
        }
        setErrors(errors)
        return Object.keys(errors).length === 0;
    }

    return (
        <div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", color: 'white' }}
        >
            <form className='form' style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
                <h1>Add a game</h1>
                <label className='formlabel'>Name*</label>
                <input onChange={handleInputChange} name="name" type="text" value={input.name} />
                {errors.name && <p className="danger">{errors.name}</p>}
                <label className='formlabel'>Description*</label>
                <input onChange={handleInputChange} name="description" type="text" value={input.description} />
                {errors.description && <p className="danger">{errors.description}</p>}
                <label className='formlabel'>Release Date</label>
                <input onChange={handleInputChange} name="released" type="date" value={input.released} />
                <label className='formlabel'>Image URL</label>
                <input onChange={handleInputChange} name="image" type="text" value={input.image} />
                {errors.image && <p className="danger">{errors.image}</p>}
                <label className='formlabel'>Rating</label>
                {/* <input onChange={handleInputChange} name="rating" type="number" /> */}
                <Rating
                    value={input.rating || rating}
                    name="rating"
                    onChange={(event, newValue) => {
                        setRating(newValue);
                        setInput({
                            ...input,
                            rating: newValue,
                        });
                    }}
                />
                <label className='formlabel'>Select Genres*</label>
                <div className='checkboxoptions'>
                    {genres.map(g => <label key={g.id}><input value={g.id} type='checkbox' name='genres' onChange={handleCheckboxChange} checked={input.genres.indexOf(g.id) > -1} />{g.name}</label>)}
                </div>
                {errors.genres && <p className="danger">{errors.genres}</p>}
                <label className='formlabel'>Select Platforms*</label>
                <div className='checkboxoptions'>
                    {platforms.map(g => <label key={g}><input value={g} type='checkbox' name='platforms' onChange={handleCheckboxChange} checked={input.platforms.indexOf(g) > -1} />{g}</label>)}
                </div>
                {errors.platforms && <p className="danger">{errors.platforms}</p>}
                <button className='button' type="submit">Create Game</button>
            </form>
        </div>
    );
}

export default AddGame;

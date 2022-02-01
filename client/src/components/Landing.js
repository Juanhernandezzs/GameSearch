import React from 'react'
import { Link } from 'react-router-dom'
import { getGenres } from '../Actions'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'

function Landing() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getGenres())
    })

    return (
        <div className='landingcontainer'>
            <div className='landingpage'>
                <h1>Welcome to <b className='boldh1'>Game Search</b></h1>
                {/* <h2>About</h2> */}
                {/* <div className='textcontainer'>
                    <p>This is a project I developed as a Full-Stack dev. </p>
                    <p>Here you can browse games from an external API, create a brand new game and delete/edit the games created.</p>
                </div> */}
                <Link className='button' to='/videogames'>
                    Get started
                </Link>
                <div className='landingbackground'></div>
            </div>
        </div>
    )
}

export default Landing
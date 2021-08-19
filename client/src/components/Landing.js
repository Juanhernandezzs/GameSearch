import React from 'react'
import { Link } from 'react-router-dom'

function Landing() {
    return (
        <div className='landingcontainer'>
            <div className='landingpage'>
                <h1>Welcome</h1>
                <Link className='button' to='/videogames'>
                    Search games
                </Link>
                <div className='landingbackground'></div>
            </div>
        </div>
    )
}

export default Landing
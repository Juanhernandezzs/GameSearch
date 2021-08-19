const fetch = require('node-fetch')

export const GET_VIDEOGAMES = 'GET_VIDEOGAMES'
export const GET_GAME_DETAIL = 'GET_GAME_DETAIL'
export const GET_GENRES = 'GET_GENRES'

export function getVideogames() {
    return (dispatch) => {
        dispatch({
            type: GET_VIDEOGAMES,
            payload: {
                data: [],
                success: undefined,
                error: undefined,
                loading: true
            }
        })
        fetch(`http://localhost:3001/videogames`).then(r => r.json())
            .then(r => {
                dispatch({
                    type: GET_VIDEOGAMES, payload: {
                        data: r,
                        success: true,
                        error: false,
                        loading: false
                    }
                })
            })
    }
}

export function getGameDetail(id) {
    return (dispatch) => {
        dispatch({
            type: GET_GAME_DETAIL,
            payload: {
                data: {},
                success: undefined,
                error: undefined,
                loading: true
            }
        })
        fetch('http://localhost:3001/videogame/' + id)
            .then(async r => {
                if (r.status === 200) {
                    console.log('no error', r)
                    dispatch({
                        type: GET_GAME_DETAIL, payload: {
                            data: await r.json(),
                            success: true,
                            error: undefined,
                            loading: false
                        }
                    })
                } else {
                    dispatch({
                        type: GET_GAME_DETAIL, payload: {
                            data: {},
                            success: false,
                            error: r.status,
                            loading: false
                        }
                    })
                }
            }).catch(err => {
                console.log('error', err)
                dispatch({
                    type: GET_GAME_DETAIL, payload: {
                        data: {},
                        success: false,
                        error: err,
                        loading: false
                    }
                })
            })
    }
}


export function getGamesByName(name) {
    return (dispatch) => {
        dispatch({
            type: GET_VIDEOGAMES,
            payload: {
                data: [],
                success: undefined,
                error: undefined,
                loading: true
            }
        })
        fetch(`http://localhost:3001/videogames?name=${name}`).then(r => r.json())
            .then(r => {
                dispatch({
                    type: GET_VIDEOGAMES, payload: {
                        data: r,
                        success: true,
                        error: undefined,
                        loading: false
                    }
                })
            }).catch(err => {
                dispatch({
                    type: GET_VIDEOGAMES, payload: {
                        data: [],
                        success: false,
                        error: err,
                        loading: false
                    }
                })
            })
    }
}

export function getGenres() {
    return (dispatch) => {
        fetch('http://localhost:3001/genres').then(r => r.json())
            .then(r => { dispatch({ type: GET_GENRES, payload: r }) })
    }
}
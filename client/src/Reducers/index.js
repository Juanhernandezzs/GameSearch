import { GET_VIDEOGAMES, GET_GAME_DETAIL, GET_GENRES } from '../Actions'

const initialState = {
    results: {
        data: [],
        success: undefined,
        error: undefined,
        loading: false
    },
    detail: {
        data: {},
        success: undefined,
        error: undefined,
        loading: false
    },
    genres: []
}

export default function reducer(state = initialState, { type, payload }) {
    switch (type) {
        case GET_VIDEOGAMES: return {
            ...state,
            results: payload
        }
        case GET_GAME_DETAIL: return {
            ...state,
            detail: payload
        }
        case GET_GENRES: return {
            ...state, 
            genres: payload
        }

        default: return state
    }
}
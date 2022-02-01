const { Router } = require('express');
const fetch = require('node-fetch');
const { Op } = require('sequelize');
const { Genre, Videogame } = require('../db.js');
const {
    RAWG_API_KEY
} = process.env;

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const mapFromDB = function (game) {
    return {
        id: game.id,
        name: game.name,
        rating: game.rating,
        released: game.releaseDate,
        image: game.image,
        genres: game.genres && game.genres.map(g => g.name),
        description: game.description,
        platforms: game.platforms.split(','),
        fromDB: true
    }
}

const mapDetailFromRawg = function (game, mainPage) {
    if (!mainPage) {
        return {
            id: game.id,
            name: game.name,
            image: game.background_image,
            genres: game.genres.map(g => g.name),
            description: game.description,
            released: game.released,
            rating: game.rating,
            platforms: game.parent_platforms.map(p => p.platform.name),
            fromDB: false
        }
    } else {
        return {
            id: game.id,
            name: game.name,
            rating: game.rating,
            image: game.background_image,
            genres: game.genres.map(g => g.name),
            fromDB: false
        }
    }
}

router.post('/videogames', async (req, res) => {
    const game = await Videogame.create({
        name: req.body.name,
        description: req.body.description,
        rating: req.body.rating,
        image: req.body.image,
        releaseDate: req.body.released,
        platforms: req.body.platforms.join(',')
    })
    await game.setGenres(req.body.genres)
    res.send(game)
})

router.get('/videogames', async function (req, res, next) {
    try {
        if (!req.query.name) {
            let result1 = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=40&page=1`).then(r => r.json())
            let result2 = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=40&page=2`).then(r => r.json())
            let result3 = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=20&page=5`).then(r => r.json())
            let fromRawg = await (await Promise.all([result1, result2, result3])).reduce((total, res) => [...total, ...res.results], [])
            let fromDB = await Videogame.findAll({ include: Genre })
            let allGames = fromRawg.map(r => mapDetailFromRawg(r, true))
            allGames.push(...fromDB.map(g => mapFromDB(g)))
            res.send(allGames)
        } else {
            let fromDb = await Videogame.findAll({ where: { name: { [Op.substring]: req.query.name } } })
            let result = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${req.query.name}&page_size=${15 - fromDb.length}`).then(r => r.json())
            let all = [...fromDb.map(r => mapFromDB(r)), ...result.results.map(r => mapDetailFromRawg(r, true))]
            res.send(all)
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/videogame/:idVideogame', async function (req, res, next) {
    try {
        const { idVideogame } = req.params
        if (isNaN(idVideogame)) {
            let game = await Videogame.findByPk(idVideogame, { include: Genre })
            res.send(mapFromDB(game))
        } else {
            await fetch(`https://api.rawg.io/api/games/${idVideogame}?key=${RAWG_API_KEY}`).then(async r => {
                if (r.status == 200) {
                    res.send(mapDetailFromRawg(await r.json()))
                } else {
                    res.status(r.status).send('error')
                }
            })
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put('/videogame/:idVideogame', async function (req, res, next) {
    try {
        const { idVideogame } = req.params
        const update = await Videogame.update({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            rating: req.body.rating,
            releaseDate: req.body.released,
            platforms: req.body.platforms.join(','),
        }, { where: { id: idVideogame } }).then(async function () {
            await Videogame.findByPk(idVideogame).then(async function (game) {
                await Genre.findOrCreate({ where: { id: req.body.genres } }).then(genre => {
                    game.setGenres(req.body.genres)
                })
            })
        })
        res.json('Game updated')
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.delete('/videogame/:idVideogame', async function (req, res, next) {
    try {
        const { idVideogame } = req.params
        await Videogame.destroy({ where: { id: idVideogame } })
        res.json('Game deleted')
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/genres', async function (req, res) {
    try {
        let fromRawg = await fetch(`https://api.rawg.io/api/genres?key=${RAWG_API_KEY}`).then(t => t.json())
        let existent = await Genre.findAll()
        let promises = fromRawg.results.filter(t => !existent.some(e => e.id === t.id)).map(t => {
            return Genre.create({
                id: t.id,
                name: t.name
            })
        })

        await Promise.all(promises)

        res.send(await Genre.findAll())
    } catch (error) {
        res.status(500).send(console.error('Ocurrió un error: ', error))
    }
})

module.exports = router;

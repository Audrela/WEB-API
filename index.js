'use strict'
const restify = require('restify')
const server = restify.createServer()

const music = require('./Modules/music')
const playlist = require('./Modules/playlist')
const authentification = require('./Modules/authentification')
const users = require('./Modules/users')



server.use(restify.fullResponse())
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

server.get('/musicsearch', music.musicSearch)		//Search for item


server.get('/playlist',authentification.authorize, playlist.list)		//Get playlist
server.get('/playlist/:id',authentification.authorize, playlist.list)		//Get playlist using id
server.post('/playlist',authentification.authorize, playlist.validate, playlist.add)  // get details of a particular fav using id
server.del('/playlist/:id',authentification.authorize, playlist.deleteItem)		//Delete playlist usingid
server.put('/playlist/:id',authentification.authorize, playlist.validate, playlist.update)	//Update playlist using id


server.post('/users', users.validateUser, users.add)  // add a new user to the DB (pending confirmation)
server.post('/users/confirm/:username', users.validateCode, users.confirm)	//Confirm user using confirmation code
server.del('/users/:username', authentification.authorize, users.delete)  // delete a user

const port = process.env.PORT || 8081
server.listen(port, err => console.log(err || `App running on port ${port}`))

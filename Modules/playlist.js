
'use strict'

const storage = require('node-persist')  // use basic file-based data persistence
const playlistConnection = require('./database').playlistConnection

storage.initSync()
// VALIDATES \\
exports.validate = function validate(req, res, next) {
	const playlist = req.body
	if (!playlist) return res.send(400, {Message: 'Need to send some data'})	// Checks if any data was sent to playlist
	if (!playlist.id || !playlist.artist || !playlist.track) return res.send(400, {Message: 'Missing components: id, artist or track'}) //Requires id,artist and track. If missing send error.
	next() //Moves to next function
}

exports.list = function list(req, res) {
	// get all the books saved in the user's list
	playlistConnection(req, res, playlists => res.send({playlist: playlists.values()})) // creates a playlist
}
// ADD ITEMS \\
exports.add = function add(req, res) {

	// connect to the playlist database then saves the item
	playlistConnection(req, res, playlists => {

		// first check that the id is not used already
		const list = req.body

		if (playlists.getItemSync(list.id)) return res.send(400, {message: 'id already exists', id: list.id})

		// Checks the data and adds to playlist

		playlists.setItem(list.id, list, err => {
			if (err) {
				console.log(err)
				return res.send(500, {message: 'Could not add to playlist', list: list})
			} else {
				return res.send(201, {message: 'Added to playlist', list: list})
			}
		})
	})
}
// GETS THE PLAYLIST \\
exports.get = function get (req, res, next) {
	// use the ID in the URL to look up a particular track
	const trackid = req.params.id

	// connects to the playlists database and request a track
	playlistConnection(req, res, playlists => {
		playlists.getItem(trackid, (err, track) => {
			if (err) return res.send(500, {message: 'Couldnt get the playlist'})

			// track will be undefined if there was no match
			if (!track) return res.send(404, {message: 'id not found', id: trackid})
			
			// otherwise return the tracks object
			res.send({favourite: trackid})
		})
	})
	next()
}



																	/// UPDATING \\\
exports.update = function updateItem (req, res, next) {
	// use the ID in the URL to ensure the playlist exists, then overwrite it
	res.setHeader('content-type', 'application/json')
	res.setHeader('Allow', 'GET, PUT')
	
	playlistConnection(req, res, playlists => {
		// removes current item and adds new one with updated data
		const list = req.body
		
		if (playlists.removeItemSync(list.id)) return res.send(400, {message: 'Playlist updated', id: list.id})
		playlists.removeItem(list.id, list, err => {
			if(err) return res.send(404, {Message: 'delete error'}, null)
		})
	})
	
		playlistConnection(req, res, playlists => {

		const list = req.body

		playlists.setItem(list.id, list, err => {
			if (err) {
				console.log(err)
				return res.send(500, {list: list})
			} else {
				return res.send(201, {list: list})
			}
		})
	})
}






// DELETE ITEM FROM PLAYLIST \\
exports.deleteItem = function deleteItem (req, res, next) {
	// use the ID in the URL to remove a specific item from playlist
	
	playlistConnection(req, res, playlists => {
		res.setHeader('content-type', 'application/json')
		res.setHeader('Allow', 'GET, POST, DELETE')
		const list = req.body
		
		if (playlists.removeItemSync(list.id)) return res.send(400, {message: 'Playlist deleted', id: list.id})
		// Removes a playlist 
		playlists.removeItem(list.id, list, err => {
			if(err) return res.send(404, {Message: 'Playlist deleted'}, deleteItem.item)
		res.send(500, {message: 'Playlist empty'})
		res.send(JSON.parse(list)).item // Returns empty playlist
		})
	})
}
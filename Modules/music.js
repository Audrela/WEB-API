'use strict'

const request = require('request')
// FUNCTION TO SEARCH FOR MUSIC
exports.musicSearch = function (req, res) {
  const q = req.query.q // query to be able to search for item
  const url = 'https://api.spotify.com/v1/search?q=drake&limit=5&type=track'  // URL TO SEARCH FOR SONG
  const song = req.body.song
  
 request.get(url, function (error, response, body) {
   if (!error && response.statusCode == 200) {
      res.send(JSON.parse(body)).items    // Sends list of items to body
   }
 })
}


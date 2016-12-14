'use strict'

const usersConnection = require('./database').usersConnection

exports.authorize = function authorize(req, res, next) {
	// Checks if basic authorization is used
	const auth = req.authorization

	if (!auth || !auth.basic) return res.send(401, {message: 'Need basic authorization header'})

	const username = auth.basic.username
	const password = auth.basic.password
// Connects to users database and checks if username, password or confirmation is matched
	usersConnection(res, usersDB => {
		const users = usersDB.values()

		for (let i = 0; i < users.length; i++) {
			if (users[i].username === username && users[i].password === password && users[i].confirmed === true) return next()
		}
		return res.send(401, {message: 'Username or password incorrect, or registration not confirmed'})
	})

}
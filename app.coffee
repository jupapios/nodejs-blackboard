# Module dependencies

express = require 'express'
routes = require './routes'
mongoose = require 'mongoose'
stylus = require 'stylus'
nib = require 'nib'

app = module.exports = express.createServer()

# Moongo

Schema = mongoose.Schema

BoardSchema = new Schema {
	type  : { type: Number }
	value : { type: String }
	x     : { type: Number }
	y     : { type: Number }
}

db = mongoose.connect 'mongodb://localhost/blackboard'
model = mongoose.model 'Data', BoardSchema
Data = mongoose.model 'Data'

# Configuration

app.configure () ->
	app.set 'views', __dirname + '/views'
	app.set 'view engine', 'jade'
	app.use express.bodyParser()
	app.use express.methodOverride()
	app.use express.cookieParser()
	app.use stylus.middleware {
		src: __dirname + '/stylus',
		dest: __dirname + '/public',
		compile: (str, path) ->
			return stylus(str)
				.set('filename', path)
				.set('compress', true)
				.use(nib())
				.import('nib')
	}
	app.use app.router
	app.use express.static __dirname + '/public'

app.configure 'development', () ->
	app.use express.errorHandler { dumpExceptions: true, showStack: true }

app.configure 'production', () ->
	app.use express.errorHandler()

# IO

users = {}
io = require('socket.io').listen app
io.set 'log level', 1

io.sockets.on 'connection', (socket) ->
	socket.on 'adduser', (user) ->
		if users[user]==user
			socket.emit 'sign', { state: 0 }
		else
			socket.user = user
			users[user] = user
			socket.emit 'sign', { state: 1 }
			Data.find {}, (err, docs) ->
				if err
					throw err
				socket.emit 'objects', docs
			io.sockets.emit 'update', users

	socket.on 'handle', (data) ->
		Data.findById data.obj[0], (err, p) ->
			p.x=data.obj[1]
			p.y=data.obj[2]
			p.save()
		socket.broadcast.emit 'handle', data

	socket.on 'disconnect', () ->
		delete users[socket.user]
		io.sockets.emit 'update', users

# Routes

app.get '/', routes.index

app.listen 3000
console.log "Nodejs blackboard running on port %d in %s mode", app.address().port, app.settings.env
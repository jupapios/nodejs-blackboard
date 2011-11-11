var mongoose = require('mongoose');
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var app = module.exports = express.createServer();

// Static
var namedefault='panda';

// Mongo
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BoardSchema = new Schema({
  type  : { type: Number },
  value : { type: String },
  x     : { type: Number },
  y     : { type: Number }
});

var db = mongoose.connect('mongodb://localhost/blackboard');
var model = mongoose.model('Data', BoardSchema);
var Data = mongoose.model('Data');

// Express
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(stylus.middleware({ 
    src: __dirname + '/stylus',
    dest: __dirname + '/public',
    compile: function (str, path) {
      return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib())
        .import('nib');
      }
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

/*app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});*/

// IO
var users = {};
var io = require('socket.io').listen(app);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {

  socket.on('adduser', function(user){
    if(users[user]==user)
      socket.emit('sign', {state: 0});
    else {
      socket.user = user;
      users[user] = user;
      socket.emit('sign', {state: 1});
      // Send objects to new client
      Data.find({}, function(err, docs) {
        if(err) { throw err; }
        socket.emit('objects', docs);
      });
      io.sockets.emit('update', users);
    }
  });

  socket.on('handle', function (data) {
    Data.findById(data.obj[0], function(err, p) {
			p.x=data.obj[1];
			p.y=data.obj[2];
			p.save();
    });
    socket.broadcast.emit('handle', data);
  });

  socket.on('disconnect', function(){
    //mongoose.disconnect();
    delete users[socket.user];
    io.sockets.emit('update', users);
  });

});

// Routes
app.get('/', function(req, res){
  res.render('index', {
    title: 'Blackboard',
    user: namedefault+Math.ceil(Math.random()*1000)
  });
});

app.listen(3000);

//SERVER CODE
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
//here we send an entire html file to be loaded on the webpage
res.sendFile(__dirname + '/index.html');
});
//built in connection event when the event occurs that means a socket object has been passed to the server
//and print to the console that a user has joined.
io.on('connection', function(socket){
//console.log('new user joined');
//here we send an event to every socket connected to the server that has the name 'joined'
//this event is handled in every client to update their screen and print that a new user has joined the chat
io.emit('joined');
//here we handle the emit from the client to the server. we take the message from the client that sent it and emit it to all other connected sockets.
	socket.on('chat message', function(msg){
		console.log("chat message: " + msg);
		//io.emit emits to all other clients. check broadcasting for emiting to specific clients.
		io.emit('chat message', msg);
	});
	socket.on('disconnect', function(){
		//here we emit the event called 'disconnect' and it is handled in every client.
		io.emit('disconnect');
	});
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});

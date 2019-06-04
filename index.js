//SERVER CODE
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var connectedUsers = new Map();
app.get('/', function(req, res){
//here we send an entire html file to be loaded on the webpage
	res.sendFile(__dirname + '/index.html');
});
//built in connection event when the event occurs that means a socket object has been passed to the server
//and print to the console that a user has joined.
io.on('connection', function(socket){
//here we handle the emition of the userName from each client and add them to a map that has their UNIQUE socket id and 
	socket.on('userID', function(userName){
		connectedUsers.set(socket.id, userName);
	});
	//here we send an event to every socket connected to the server that has the name 'joined'
	//this event is handled in every client to update their screen and print that a new user has joined the chat
	//name of the user joined has to be handled here. it should be sent as a string to other clients.
	io.emit('joined', 'a user ');
//here we handle the emit from the client to the server. we take the message from the client that sent it and emit it to all other connected sockets.
	socket.on('chat message', function(msg){
		console.log("chat message: " + msg);
		//io.emit emits to all other clients. check broadcasting for emiting to specific clients.
		io.emit('chat message', msg);
	});
	socket.on('disconnect', function(){
		//here we emit the event called 'disconnect' and the user name of the disconnected node that we have stored in our map.
		//and it is handled in every client.

		io.emit('disconnect', connectedUsers.get(socket.id));
	});
	
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});
